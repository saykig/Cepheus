'use client'

import type { CSSProperties, FocusEvent, PointerEvent as ReactPointerEvent } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import styles from './technical-capacity-figure.module.css'

const TECHNICAL_CAPACITY_YEARS = [2023, 2024, 2025, 2026, 2027, 2030] as const
const TECHNICAL_CAPACITY_YEAR_POSITIONS = [0, 0.18, 0.37, 0.56, 0.75, 1] as const

type TechnicalCapacityYear = (typeof technicalCapacityFigureData.years)[number]
type TechnicalCapacityScenario = 'current' | 'accelerated'

type FigureFrame = {
  width: number
  height: number
  x: number
  y: number
  progress: number
  morph: number
  fixed: boolean
  sticky: boolean
  visible: boolean
}

type Point = { x: number; y: number }

type TrajectoryPoint = Point & { index: number }

type SegmentPhase = {
  index: number
  start: number
  end: number
}

const DEFAULT_FRAME: FigureFrame = {
  width: 1048,
  height: 360,
  x: 0,
  y: 0,
  progress: 0,
  morph: 0,
  fixed: false,
  sticky: false,
  visible: false,
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount

const smoothstep = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

const normalizedExponential = (value: number, exponent: number) => {
  const t = clamp(value)
  return (Math.exp(exponent * t) - 1) / (Math.exp(exponent) - 1)
}

const trajectoryValue = (
  start: number,
  end: number,
  position: number,
  exponent: number,
) => lerp(start, end, normalizedExponential(position, exponent))

const capabilityValues = TECHNICAL_CAPACITY_YEAR_POSITIONS.map((position) =>
  trajectoryValue(0.7, 0.04, position, 2),
)
const publicCurrentValues = TECHNICAL_CAPACITY_YEAR_POSITIONS.map((position) =>
  trajectoryValue(0.88, 0.69, position, 1.25),
)
const publicAcceleratedValues = TECHNICAL_CAPACITY_YEAR_POSITIONS.map(
  (position, index) => {
    if (index <= 3) return publicCurrentValues[index]
    const projectionPosition =
      (position - TECHNICAL_CAPACITY_YEAR_POSITIONS[3]) /
      (1 - TECHNICAL_CAPACITY_YEAR_POSITIONS[3])
    return trajectoryValue(
      publicCurrentValues[3],
      0.39,
      projectionPosition,
      1.25,
    )
  },
)

const technicalCapacityFigureData = {
  years: TECHNICAL_CAPACITY_YEARS,
  capability: capabilityValues,
  publicCurrent: publicCurrentValues,
  publicAccelerated: publicAcceleratedValues,
} as const

const SEGMENT_PHASES: SegmentPhase[] = [
  { index: 1, start: 0, end: 0.18 },
  { index: 2, start: 0.18, end: 0.36 },
  { index: 3, start: 0.36, end: 0.54 },
  { index: 4, start: 0.72, end: 0.84 },
  { index: 5, start: 0.84, end: 1 },
]

function pointsToPath(points: Point[], maximumRadius: number) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = points[index - 1]
    const point = points[index]
    const next = points[index + 1]
    const previousLength = Math.hypot(point.x - previous.x, point.y - previous.y)
    const nextLength = Math.hypot(next.x - point.x, next.y - point.y)
    const radius = Math.min(
      maximumRadius,
      previousLength * 0.18,
      nextLength * 0.18,
    )
    const beforeRatio = previousLength === 0 ? 0 : radius / previousLength
    const afterRatio = nextLength === 0 ? 0 : radius / nextLength
    const before = {
      x: lerp(point.x, previous.x, beforeRatio),
      y: lerp(point.y, previous.y, beforeRatio),
    }
    const after = {
      x: lerp(point.x, next.x, afterRatio),
      y: lerp(point.y, next.y, afterRatio),
    }
    path += ` L ${before.x} ${before.y} Q ${point.x} ${point.y}, ${after.x} ${after.y}`
  }
  const last = points[points.length - 1]
  return `${path} L ${last.x} ${last.y}`
}

function pointsToArea(upper: Point[], lower: Point[], maximumRadius: number) {
  if (!upper.length || !lower.length) return ''
  const upperPath = pointsToPath(upper, maximumRadius)
  const lowerReversed = [...lower].reverse()
  const lowerPath = lowerReversed
    .map((point, index) => `${index === 0 ? 'L' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  return `${upperPath} ${lowerPath} Z`
}

function markerThreshold(year: TechnicalCapacityYear) {
  const thresholds: Record<TechnicalCapacityYear, number> = {
    2023: 0,
    2024: 0.18,
    2025: 0.36,
    2026: 0.54,
    2027: 0.84,
    2030: 0.995,
  }
  return thresholds[year]
}

export function TechnicalCapacityFigure() {
  const figureRef = useRef<HTMLElement>(null)
  const updateRef = useRef<() => void>(() => {})
  const rafRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const [frame, setFrame] = useState<FigureFrame>(DEFAULT_FRAME)
  const [activeYear, setActiveYear] = useState<2027 | 2030 | null>(null)
  const [interactionProgress, setInteractionProgress] = useState<number | null>(
    null,
  )
  const [technicalCapacityScenario, setTechnicalCapacityScenario] =
    useState<TechnicalCapacityScenario>('current')
  const titleId = useId()
  const descriptionId = useId()
  const svgId = useId().replaceAll(':', '')

  const closeInteraction = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setInteractionProgress(null)
    setActiveYear(null)
    window.requestAnimationFrame(() => updateRef.current())
  }, [])

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current === null) return
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }, [])

  const scheduleClose = useCallback(() => {
    cancelScheduledClose()
    closeTimerRef.current = window.setTimeout(closeInteraction, 140)
  }, [cancelScheduledClose, closeInteraction])

  const openInteraction = useCallback(
    (year: 2027 | 2030) => {
      if (frame.progress < markerThreshold(year)) return
      cancelScheduledClose()
      setInteractionProgress(frame.progress)
      setActiveYear(year)
    },
    [cancelScheduledClose, frame.progress],
  )

  useEffect(() => {
    const figure = figureRef.current
    if (!figure) return

    const body = figure.closest<HTMLElement>('.essay-body')
    const prose = figure.previousElementSibling as HTMLElement | null
    const openingHeading = document.getElementById('first-collision')
    const completionHeading = document.getElementById(
      'what-do-we-owe-to-each-other',
    )
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const measure = () => {
      rafRef.current = null
      const inlineRect = figure.getBoundingClientRect()
      const bodyRect = body?.getBoundingClientRect()
      const proseRect = prose?.getBoundingClientRect()
      const headingRect = openingHeading?.getBoundingClientRect()
      const completionHeadingRect = completionHeading?.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const reducedMotion = motionQuery.matches
      const availableRight = proseRect
        ? viewportWidth - proseRect.right - 32
        : 0
      const isMobile = viewportWidth <= 900
      const stickyEligible = !isMobile && availableRight >= 280
      const figureDocumentTop = inlineRect.top + window.scrollY
      const railTop = 88
      const completionDocumentTop = completionHeadingRect
        ? completionHeadingRect.top + window.scrollY
        : figureDocumentTop + viewportHeight * 2.6
      const desktopProgressEnd = Math.max(1, completionDocumentTop - railTop)
      const mobileProgressStart = figureDocumentTop - viewportHeight * 0.72
      const mobileProgressEnd =
        figureDocumentTop + inlineRect.height - viewportHeight * 0.18
      const rawProgress = reducedMotion
        ? 1
        : isMobile
          ? clamp(
              (window.scrollY - mobileProgressStart) /
                Math.max(1, mobileProgressEnd - mobileProgressStart),
            )
          : clamp(window.scrollY / desktopProgressEnd)
      const renderedProgress = interactionProgress ?? rawProgress
      const morph = stickyEligible ? 1 : 0
      const stickyWidth = clamp(availableRight, 280, 460)
      const stickyHeight = stickyWidth / 1.2
      const stickyX = proseRect ? proseRect.right + 16 : inlineRect.left
      const interactionExtra =
        activeYear === 2030 ? 182 : activeYear === 2027 ? 145 : 0
      const essayEndTop = bodyRect
        ? bodyRect.bottom - stickyHeight - interactionExtra - 16
        : railTop
      const headingAlignedTop = Math.max(railTop, headingRect?.top ?? railTop)
      const boundedStickyTop = Math.min(headingAlignedTop, essayEndTop)
      const shouldFix = stickyEligible
      const visible = isMobile || stickyEligible

      const width = shouldFix
        ? stickyWidth
        : inlineRect.width
      const height = shouldFix
        ? stickyHeight
        : inlineRect.height
      const x = shouldFix ? stickyX : inlineRect.left
      const y = shouldFix ? boundedStickyTop : inlineRect.top

      setFrame((previous) => {
        const next: FigureFrame = {
          width,
          height,
          x,
          y,
          progress: renderedProgress,
          morph,
          fixed: shouldFix,
          sticky: shouldFix && boundedStickyTop <= railTop,
          visible,
        }
        const unchanged = (Object.keys(next) as Array<keyof FigureFrame>).every(
          (key) =>
            typeof next[key] === 'boolean'
              ? next[key] === previous[key]
              : Math.abs((next[key] as number) - (previous[key] as number)) <
                0.001,
        )
        return unchanged ? previous : next
      })
    }

    const requestMeasure = () => {
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(measure)
    }

    updateRef.current = requestMeasure
    requestMeasure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)
    motionQuery.addEventListener('change', requestMeasure)
    const observer = new ResizeObserver(requestMeasure)
    observer.observe(figure)
    if (body) observer.observe(body)
    if (prose) observer.observe(prose)
    if (openingHeading) observer.observe(openingHeading)
    if (completionHeading) observer.observe(completionHeading)

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      observer.disconnect()
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)
      motionQuery.removeEventListener('change', requestMeasure)
    }
  }, [activeYear, interactionProgress])

  useEffect(() => {
    if (!activeYear) return
    const onPointerDown = (event: PointerEvent) => {
      if (!figureRef.current?.contains(event.target as Node)) closeInteraction()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [activeYear, closeInteraction])

  const geometry = useMemo(() => {
    const { width, height, morph } = frame
    const left = lerp(34, 18, morph)
    const right = lerp(24, 12, morph)
    const top = lerp(28, 18, morph)
    const bottom = lerp(30, 24, morph)
    const plotWidth = Math.max(1, width - left - right)
    const plotHeight = Math.max(1, height - top - bottom)
    const publicValues =
      technicalCapacityScenario === 'accelerated'
        ? technicalCapacityFigureData.publicAccelerated
        : technicalCapacityFigureData.publicCurrent
    const activePhase =
      SEGMENT_PHASES.find((phase) => frame.progress < phase.end) ?? null
    const completedIndex = activePhase ? activePhase.index - 1 : 5
    const phaseProgress = activePhase
      ? clamp(
          (frame.progress - activePhase.start) /
            (activePhase.end - activePhase.start),
        )
      : 1
    const layoutProgress = activePhase ? smoothstep(phaseProgress) : 1
    const drawProgress = activePhase ? smoothstep(phaseProgress) : 1
    const previewProgress = activePhase
      ? Math.min(1, drawProgress + 0.14)
      : 1
    const prefixPosition = (index: number, count: number) => {
      if (count <= 1) return 0
      if (index >= count - 1) return 1
      return (
        TECHNICAL_CAPACITY_YEAR_POSITIONS[index] /
        TECHNICAL_CAPACITY_YEAR_POSITIONS[count - 1]
      )
    }
    const completedCount = completedIndex + 1
    const yearPositions = TECHNICAL_CAPACITY_YEAR_POSITIONS.map((position, index) => {
      if (!activePhase) return position
      if (index < completedCount) {
        return lerp(
          prefixPosition(index, completedCount),
          prefixPosition(index, completedCount + 1),
          layoutProgress,
        )
      }
      return 1
    })
    const previousPosition = yearPositions[completedIndex]
    const activeHeadPosition = activePhase
      ? lerp(previousPosition, 1, drawProgress)
      : 1
    const previewLayoutProgress = activePhase
      ? smoothstep(Math.min(1, phaseProgress + 0.14))
      : 1
    const previewPreviousPosition = activePhase
      ? lerp(
          prefixPosition(completedIndex, completedCount),
          prefixPosition(completedIndex, completedCount + 1),
          previewLayoutProgress,
        )
      : 1
    const previewHeadPosition = activePhase
      ? Math.max(
          activeHeadPosition,
          lerp(previewPreviousPosition, 1, previewProgress),
        )
      : 1
    const xFromPosition = (position: number) => left + position * plotWidth
    const yFromValue = (value: number) => top + value * plotHeight
    const cornerRadius = lerp(10, 6, morph)

    const createTrajectory = (values: readonly number[], exponent: number) => {
      const active: TrajectoryPoint[] = []
      for (let index = 0; index <= completedIndex; index += 1) {
        active.push({
          index,
          x: xFromPosition(yearPositions[index]),
          y: yFromValue(values[index]),
        })
      }

      if (activePhase && drawProgress > 0) {
        active.push({
          index: activePhase.index,
          x: xFromPosition(activeHeadPosition),
          y: yFromValue(
            lerp(
              values[completedIndex],
              values[activePhase.index],
              normalizedExponential(drawProgress, exponent),
            ),
          ),
        })
      }

      const activeEnd = active[active.length - 1]
      const preview = activePhase
        ? [
            activeEnd,
            {
              index: activePhase.index,
              x: xFromPosition(previewHeadPosition),
              y: yFromValue(
                lerp(
                  values[completedIndex],
                  values[activePhase.index],
                  normalizedExponential(previewProgress, exponent),
                ),
              ),
            },
          ]
        : []

      const markers = values.map((value, index) => {
        if (index <= completedIndex) {
          return {
            index,
            opacity: 1,
            x: xFromPosition(yearPositions[index]),
            y: yFromValue(value),
          }
        }
        if (activePhase && index === activePhase.index) {
          const previewPoint = preview[1]
          return {
            index,
            opacity: 0.35 + 0.65 * drawProgress,
            x: previewPoint.x,
            y: previewPoint.y,
          }
        }
        return {
          index,
          opacity: 0,
          x: frame.width - right,
          y: yFromValue(value),
        }
      })

      return { active, markers, preview }
    }

    const capabilityTrajectory = createTrajectory(
      technicalCapacityFigureData.capability,
      2,
    )
    const publicTrajectory = createTrajectory(publicValues, 1.25)
    const historicalCapability = capabilityTrajectory.active.filter(
      (point) => point.index <= 3,
    )
    const historicalPublic = publicTrajectory.active.filter(
      (point) => point.index <= 3,
    )
    const projectedCapability = capabilityTrajectory.active.filter(
      (point) => point.index >= 3,
    )
    const projectedPublic = publicTrajectory.active.filter(
      (point) => point.index >= 3,
    )
    const uncertaintyOffset = lerp(7, 5, morph)

    return {
      left,
      right,
      top,
      bottom,
      plotWidth,
      plotHeight,
      cornerRadius,
      capability: capabilityTrajectory.markers,
      publicCapacity: publicTrajectory.markers,
      capabilityPreview: capabilityTrajectory.preview,
      publicPreview: publicTrajectory.preview,
      previewProjected: (activePhase?.index ?? 0) >= 4,
      historicalCapability,
      historicalPublic,
      projectedCapability,
      projectedPublic,
      capabilityUncertaintyUpper: projectedCapability
        .map((point) => ({ ...point, y: point.y - uncertaintyOffset })),
      capabilityUncertaintyLower: projectedCapability
        .map((point) => ({ ...point, y: point.y + uncertaintyOffset })),
      publicUncertaintyUpper: projectedPublic
        .map((point) => ({ ...point, y: point.y - uncertaintyOffset * 0.7 })),
      publicUncertaintyLower: projectedPublic
        .map((point) => ({ ...point, y: point.y + uncertaintyOffset * 0.7 })),
    }
  }, [frame, technicalCapacityScenario])

  const dividerOpacity = clamp((frame.progress - 0.54) / 0.08)
  const uncertaintyOpacity = clamp((frame.progress - 0.84) / 0.16) * 0.42
  const trajectoryLabelSize = lerp(12, 10.5, frame.morph)
  const tickSize = lerp(10.5, 9.5, frame.morph)
  const markerRadius = lerp(3.7, 3.1, frame.morph)
  const baselineY = frame.height - geometry.bottom + 2
  const historicalEndX = geometry.capability[3].x
  const gapLabelOnLeft = historicalEndX > frame.width - lerp(112, 84, frame.morph)
  const labelSeparation = smoothstep(frame.progress / 0.54)
  const capabilityLabelOffset = lerp(16, 24, labelSeparation)
  const publicLabelOffset = lerp(14, 20, labelSeparation)
  const stageStyle = frame.fixed
    ? ({
        width: `${frame.width}px`,
        height: `${frame.height}px`,
        transform: `translate3d(${frame.x}px, ${frame.y}px, 0)`,
      } as CSSProperties)
    : undefined
  const figureClassName = [
    styles.figure,
    activeYear === 2027 && !frame.fixed ? styles.withInlineInfo : '',
    activeYear === 2030 && !frame.fixed ? styles.withInlineControl : '',
  ]
    .filter(Boolean)
    .join(' ')
  const stageClassName = [
    styles.stage,
    frame.fixed ? styles.stageFixed : '',
    frame.visible ? '' : styles.stageHidden,
  ]
    .filter(Boolean)
    .join(' ')

  const handleFocusLeave = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null
    if (next && event.currentTarget.contains(next)) return
    closeInteraction()
  }

  const handleStagePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') scheduleClose()
  }

  return (
    <figure
      className={figureClassName}
      ref={figureRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onBlur={handleFocusLeave}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && activeYear) {
          event.preventDefault()
          closeInteraction()
        }
      }}
    >
      <figcaption className="visually-hidden" id={titleId}>
        Technical capability and public capacity, 2023–2030
      </figcaption>
      <p className="visually-hidden" id={descriptionId}>
        An illustrative comparison of rapidly increasing frontier AI capability
        and more gradual public institutional capacity. Solid lines cover 2023
        through 2026; dashed lines are projections through 2030.
      </p>

      <div
        className={stageClassName}
        style={stageStyle}
        data-technical-capacity-state={
          !frame.visible
            ? 'hidden'
            : frame.sticky
              ? 'sticky'
              : frame.fixed
                ? 'right-rail'
                : 'inline'
        }
        data-technical-capacity-progress={frame.progress.toFixed(3)}
        data-technical-capacity-locked={interactionProgress?.toFixed(3)}
        onPointerEnter={cancelScheduledClose}
        onPointerLeave={handleStagePointerLeave}
      >
        <svg
          className={styles.svg}
          viewBox={`0 0 ${frame.width} ${frame.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          data-technical-capacity-svg
        >
          <path
            className={styles.historicalGap}
            d={pointsToArea(
              geometry.historicalCapability,
              geometry.historicalPublic,
              geometry.cornerRadius,
            )}
          />
          <path
            className={styles.projectedGap}
            d={pointsToArea(
              geometry.projectedCapability,
              geometry.projectedPublic,
              geometry.cornerRadius,
            )}
          />

          <line
            className={styles.baseline}
            x1={geometry.left}
            x2={frame.width - geometry.right}
            y1={baselineY}
            y2={baselineY}
            vectorEffect="non-scaling-stroke"
          />
          <line
            className={styles.divider}
            x1={historicalEndX}
            x2={historicalEndX}
            y1={geometry.top - 18}
            y2={baselineY}
            opacity={dividerOpacity}
            vectorEffect="non-scaling-stroke"
          />

          <g>
            <path
              className={styles.capabilityLine}
              d={pointsToPath(
                geometry.historicalCapability,
                geometry.cornerRadius,
              )}
              vectorEffect="non-scaling-stroke"
            />
            <path
              className={styles.publicLine}
              d={pointsToPath(geometry.historicalPublic, geometry.cornerRadius)}
              vectorEffect="non-scaling-stroke"
            />
          </g>

          <g>
            <path
              className={`${styles.capabilityLine} ${styles.projectedLine}`}
              d={pointsToPath(
                geometry.projectedCapability,
                geometry.cornerRadius,
              )}
              vectorEffect="non-scaling-stroke"
            />
            <path
              className={`${styles.publicLine} ${styles.projectedLine}`}
              d={pointsToPath(geometry.projectedPublic, geometry.cornerRadius)}
              vectorEffect="non-scaling-stroke"
            />
            {[
              geometry.capabilityUncertaintyUpper,
              geometry.capabilityUncertaintyLower,
              geometry.publicUncertaintyUpper,
              geometry.publicUncertaintyLower,
            ].map((points, index) => (
                <path
                  className={styles.uncertaintyLine}
                  d={pointsToPath(points, geometry.cornerRadius)}
                  key={index}
                opacity={uncertaintyOpacity}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {geometry.capabilityPreview.length > 1 ? (
            <path
              className={`${styles.capabilityLine} ${styles.previewLine}${
                geometry.previewProjected ? ` ${styles.projectedLine}` : ''
              }`}
              d={pointsToPath(geometry.capabilityPreview, geometry.cornerRadius)}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          {geometry.publicPreview.length > 1 ? (
            <path
              className={`${styles.publicLine} ${styles.previewLine}${
                geometry.previewProjected ? ` ${styles.projectedLine}` : ''
              }`}
              d={pointsToPath(geometry.publicPreview, geometry.cornerRadius)}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}

          <text
            className={styles.capabilityLabel}
            x={geometry.left}
            y={geometry.capability[0].y - capabilityLabelOffset}
            fontSize={trajectoryLabelSize}
          >
            Frontier AI capability
          </text>
          <text
            className={styles.publicLabel}
            x={geometry.left}
            y={geometry.publicCapacity[0].y + publicLabelOffset}
            fontSize={trajectoryLabelSize}
          >
            Public institutional capacity
          </text>

          <text
            className={styles.gapLabel}
            x={
              historicalEndX +
              (gapLabelOnLeft ? -lerp(8, 5, frame.morph) : lerp(8, 5, frame.morph))
            }
            y={
              (geometry.capability[3].y + geometry.publicCapacity[3].y) / 2
            }
            fontSize={tickSize}
            opacity={dividerOpacity}
            textAnchor={gapLabelOnLeft ? 'end' : 'start'}
          >
            governance gap
          </text>

          {technicalCapacityFigureData.years.map((year, index) => {
            const markerOpacity = geometry.capability[index].opacity
            const active = activeYear === year
            return (
              <g key={year} opacity={markerOpacity}>
                <circle
                  className={`${styles.capabilityMarker}${
                    active ? ` ${styles.markerActive}` : ''
                  }`}
                  cx={geometry.capability[index].x}
                  cy={geometry.capability[index].y}
                  r={active ? markerRadius + 1.25 : markerRadius}
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  className={`${styles.publicMarker}${
                    active ? ` ${styles.markerActive}` : ''
                  }`}
                  cx={geometry.publicCapacity[index].x}
                  cy={geometry.publicCapacity[index].y}
                  r={active ? markerRadius + 1.25 : markerRadius}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  className={`${styles.yearLabel}${
                    active ? ` ${styles.yearLabelActive}` : ''
                  }`}
                  x={geometry.capability[index].x}
                  y={frame.height - 6}
                  fontSize={tickSize}
                  textAnchor={
                    index === 0 ? 'start' : index === 5 ? 'end' : 'middle'
                  }
                >
                  {year}
                </text>
              </g>
            )
          })}
        </svg>

        {([2027, 2030] as const).map((year) => {
          const index = technicalCapacityFigureData.years.indexOf(year)
          const point =
            year === 2027
              ? geometry.capability[index]
              : geometry.publicCapacity[index]
          const available = frame.progress >= markerThreshold(year)
          return (
            <button
              aria-controls={
                activeYear === year ? `${svgId}-${year}-content` : undefined
              }
              aria-describedby={
                activeYear === 2027 && year === 2027
                  ? `${svgId}-2027-content`
                  : undefined
              }
              aria-expanded={activeYear === year}
              aria-label={`Open ${year} projection details`}
              className={styles.markerButton}
              disabled={!available}
              key={year}
              onClick={() =>
                activeYear === year ? closeInteraction() : openInteraction(year)
              }
              onFocus={() => openInteraction(year)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') openInteraction(year)
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') scheduleClose()
              }}
              style={{ left: point.x, top: point.y }}
              type="button"
            />
          )
        })}

        {activeYear === 2027 ? (
          <aside
            className={styles.infoCard}
            id={`${svgId}-2027-content`}
            onPointerEnter={cancelScheduledClose}
            onPointerLeave={scheduleClose}
            role="tooltip"
          >
            <div className={styles.cardHeading}>
              2027 · High-capability scenario
            </div>
            <p className={styles.cardBody}>
              Frontier capability accelerates while public capacity develops
              incrementally. The gap widens sharply under this assumption.
            </p>
            <p className={styles.cardNote}>Projection, not observed data.</p>
          </aside>
        ) : null}

        {activeYear === 2030 ? (
          <fieldset
            className={styles.scenarioControl}
            id={`${svgId}-2030-content`}
            onPointerEnter={cancelScheduledClose}
            onPointerLeave={scheduleClose}
          >
            <legend className={styles.scenarioLegend}>2030 scenario</legend>
            <div className={styles.scenarioOptions}>
              <label className={styles.scenarioOption}>
                <input
                  checked={technicalCapacityScenario === 'current'}
                  name="technical-capacity-scenario"
                  onChange={() => setTechnicalCapacityScenario('current')}
                  type="radio"
                  value="current"
                />
                <span>Current institutional trajectory</span>
              </label>
              <label className={styles.scenarioOption}>
                <input
                  checked={technicalCapacityScenario === 'accelerated'}
                  name="technical-capacity-scenario"
                  onChange={() => setTechnicalCapacityScenario('accelerated')}
                  type="radio"
                  value="accelerated"
                />
                <span>Accelerated institutional response</span>
              </label>
            </div>
            <p className={styles.scenarioResult} aria-live="polite">
              {technicalCapacityScenario === 'current'
                ? 'Gap becomes entrenched.'
                : 'Gap narrows, but does not disappear.'}
            </p>
          </fieldset>
        ) : null}
      </div>

      <div className="visually-hidden">
        <table>
          <caption>Technical capability figure summary</caption>
          <thead>
            <tr>
              <th>Period</th>
              <th>Frontier AI capability</th>
              <th>Public institutional capacity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>2023–2026</th>
              <td>Observed trajectory rises rapidly.</td>
              <td>Observed trajectory develops gradually.</td>
            </tr>
            <tr>
              <th>2027–2030 projection</th>
              <td>Continues accelerating.</td>
              <td>
                Either continues gradually or rises faster under the accelerated
                institutional response scenario; the gap remains in both cases.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  )
}
