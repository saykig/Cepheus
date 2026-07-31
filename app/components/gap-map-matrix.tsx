'use client'

import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from './use-in-view'
import { WatercolorNode, WatercolorNodeDefs } from './watercolor-node'
import type { Locale } from 'app/lib/i18n'
import { visualCopy } from 'app/lib/visual-copy'

type HelpId = 'knowledge' | 'authority' | 'gap'

type PilotTopic = {
  id: string
  label: string
  series: number
  importance: number
  gapType: string
  gap: string
  knowledge: number
  authority: number
  dependency: number
  oversight: number
}

type PilotAxis = {
  key: keyof PilotTopic
  label: string
  low: string
  high: string
}

type PilotPreset = {
  id: string
  label: string
  x: PilotAxis
  y: PilotAxis
}

type PilotData = {
  title: string
  description: string
  note: string
  presets: PilotPreset[]
  topics: PilotTopic[]
}

const HELP_TEXT: Record<HelpId, string> = {
  knowledge:
    'How strongly technical capability, information, and evaluation access are concentrated outside public institutions. These pilot positions are illustrative, not finalized scores.',
  authority:
    'The extent to which public institutions possess binding, operational powers over that field. These pilot positions are illustrative, not finalized scores.',
  gap:
    'A short description of the illustrative institutional mismatch represented by the selected pilot node.',
}

const HELP_DOM_IDS: Record<HelpId, string> = {
  knowledge: 'gap-help-knowledge',
  authority: 'gap-help-authority',
  gap: 'gap-help-result',
}

const sx = (value: number) => value
const sy = (value: number) => 100 - value
const rFor = (value: number) => (2 + (Math.sqrt(value) / 10) * 3.6) * 1.16
const colorFor = (topic: PilotTopic) => `var(--series-${topic.series})`

function HelpTooltip({
  active,
  className,
  helpId,
}: {
  active: boolean
  className: string
  helpId: HelpId
}) {
  return (
    <span
      id={HELP_DOM_IDS[helpId]}
      className={`gap-help-tooltip ${className}`}
      role="tooltip"
      hidden={!active}
    >
      {HELP_TEXT[helpId]}
    </span>
  )
}

export function GapMapMatrix({ locale = 'en' }: { locale?: Locale }) {
  const copy = visualCopy[locale]
  const { ref, inView } = useInView<HTMLElement>()
  const [data, setData] = useState<PilotData | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [activeTooltip, setActiveTooltip] = useState<HelpId | null>(null)
  const touchStartedOpen = useRef(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/data/gap-data.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Gap Matrix data returned ${response.status}`)
        }
        return response.json() as Promise<PilotData>
      })
      .then((pilotData) => {
        setData(pilotData)
        setSelectedId(pilotData.topics[0]?.id ?? null)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoadFailed(true)
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (activeTooltip === null) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveTooltip(null)
    }
    const closeOutside = (event: globalThis.PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('[data-gap-help-trigger]')) return
      setActiveTooltip(null)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutside)
    }
  }, [activeTooltip])

  const preset = useMemo(
    () => data?.presets.find((candidate) => candidate.id === 'capacity'),
    [data],
  )
  const selected = useMemo(
    () => data?.topics.find((topic) => topic.id === selectedId),
    [data, selectedId],
  )

  if (loadFailed) {
    return (
      <div className="tool-loading tool-loading-error" role="alert">
        Gap Matrix data could not be loaded.
      </div>
    )
  }

  if (!data || !preset || !selected) {
    return <div className="tool-loading" aria-live="polite" aria-busy="true" />
  }

  const showHelp = (helpId: HelpId) => setActiveTooltip(helpId)
  const hideHelp = (helpId: HelpId) =>
    setActiveTooltip((current) => (current === helpId ? null : current))
  const helpProps = (helpId: HelpId) => ({
    'aria-describedby': HELP_DOM_IDS[helpId],
    'data-gap-help-trigger': true,
    onFocus: () => showHelp(helpId),
    onBlur: () => hideHelp(helpId),
    onMouseEnter: () => showHelp(helpId),
    onMouseLeave: (event: ReactMouseEvent<Element>) => {
      if (document.activeElement !== event.currentTarget) hideHelp(helpId)
    },
    onPointerDown: (event: ReactPointerEvent<Element>) => {
      if (event.pointerType !== 'mouse') {
        touchStartedOpen.current = activeTooltip === helpId
      }
    },
    onPointerUp: (event: ReactPointerEvent<Element>) => {
      if (event.pointerType !== 'mouse') {
        setActiveTooltip(touchStartedOpen.current ? null : helpId)
      }
    },
  })

  const orderedTopics = [...data.topics].sort(
    (a, b) => Number(a.id === selectedId) - Number(b.id === selectedId),
  )

  const meters = [
    {
      label: preset.x.label,
      value: selected.knowledge,
    },
    {
      label: preset.y.label,
      value: selected.authority,
    },
    { label: 'Importance', value: selected.importance },
  ]

  return (
    <section
      ref={ref}
      className={`tool gap reveal${inView ? ' is-in' : ''}`}
      aria-label={copy.gapTitle}
    >
      <div
        className="constellation-meta instrument-meta"
        aria-label={copy.projectName}
      >
        <span>{copy.projectName}</span>
        <span className="constellation-meta-mark" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="tool-head">
        <div className="tool-heading">
          <h4 className="tool-title">{copy.gapTitle}</h4>
          <details className="tool-about">
            <summary>{copy.about}</summary>
            <div className="tool-about-body">
              These four points reproduce the original illustrative pilot
              visualization. Knowledge concentration and public authority place
              each field on the matrix, while circle size shows relative
              importance. The diagonal marks equal index values; points below it
              have greater knowledge concentration than public authority. These
              values are not finalized or evidence-backed assessments.
            </div>
          </details>
        </div>
      </div>
      <p className="tool-subtitle">{copy.gapDescription}</p>

      <div className="gap-layout">
        <div className="gap-plot">
          <svg
            viewBox="-12 -5 116 117"
            role="img"
            aria-label={`${copy.gapTitle}: Knowledge concentration by Public authority`}
          >
            <defs>
              <WatercolorNodeDefs id="gap-node-watercolor" />
            </defs>
            <line className="quadrant-line" x1={50} y1={0} x2={50} y2={100} />
            <line className="quadrant-line" x1={0} y1={50} x2={100} y2={50} />
            <line
              className="gap-balance-line"
              x1={0}
              y1={100}
              x2={100}
              y2={0}
            />
            <line className="chart-axis" x1={0} y1={0} x2={0} y2={100} />
            <line className="chart-axis" x1={0} y1={100} x2={100} y2={100} />

            <text
              className="diagonal-label"
              x={72}
              y={26}
              transform="rotate(-45 72 26)"
            >
              Equal index scores
            </text>

            <text
              className="gap-axis-title gap-help-trigger"
              x={50}
              y={112}
              textAnchor="middle"
              role="button"
              tabIndex={0}
              {...helpProps('knowledge')}
            >
              Knowledge concentration
            </text>
            <text className="gap-axis-end" x={0} y={108} textAnchor="middle">
              Low
            </text>
            <text className="gap-axis-end" x={100} y={108} textAnchor="middle">
              High
            </text>
            <text
              className="gap-axis-title gap-help-trigger"
              x={-8}
              y={50}
              textAnchor="middle"
              transform="rotate(-90 -8 50)"
              role="button"
              tabIndex={0}
              {...helpProps('authority')}
            >
              Public authority
            </text>

            {orderedTopics.map((topic) => {
              const isSelected = selectedId === topic.id
              const radius = rFor(topic.importance)
              const x = sx(topic.knowledge)
              const y = sy(topic.authority)

              return (
                <g
                  key={topic.id}
                  className={`bubble${isSelected ? ' is-selected is-labeled' : ''}`}
                  style={
                    {
                      '--sc': colorFor(topic),
                      transform: `translate(${x}px, ${y}px)`,
                    } as CSSProperties
                  }
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${topic.label}: illustrative Knowledge concentration ${topic.knowledge}, Public authority ${topic.authority}, Importance ${topic.importance}`}
                  onClick={() => setSelectedId(topic.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedId(topic.id)
                    }
                  }}
                >
                  <WatercolorNode
                    cx={0}
                    cy={0}
                    radius={radius}
                    filterId="gap-node-watercolor"
                    selected={isSelected}
                    hitRadius={radius + 2.7}
                  />
                  <text x={0} y={-radius - 1.4}>
                    {topic.label}
                  </text>
                </g>
              )
            })}
          </svg>

          <HelpTooltip
            active={activeTooltip === 'knowledge'}
            className="is-knowledge"
            helpId="knowledge"
          />
          <HelpTooltip
            active={activeTooltip === 'authority'}
            className="is-authority"
            helpId="authority"
          />
        </div>

        <aside
          className="gap-panel"
          style={{ '--sc': colorFor(selected) } as CSSProperties}
          aria-live="polite"
        >
          <h5>{selected.label}</h5>
          <p className="gap-panel-quadrant">
            <button
              type="button"
              className="gap-help-button"
              {...helpProps('gap')}
            >
              {selected.gapType}
            </button>
          </p>
          <HelpTooltip
            active={activeTooltip === 'gap'}
            className="is-gap"
            helpId="gap"
          />

          <div className="gap-meters">
            {meters.map((meter) => (
              <div className="gap-meter-row" key={meter.label}>
                <div className="gap-meter-head">
                  <span>{meter.label}</span>
                  <span className="val">{Math.round(meter.value)} / 100</span>
                </div>
                <div
                  className="meter"
                  role="meter"
                  aria-label={`${meter.label}, illustrative pilot value`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(meter.value)}
                >
                  <span style={{ width: `${meter.value}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="gap-insight">{selected.gap}</p>
          <p className="gap-scope-note">
            Pilot values for this visual only. Not finalized or evidence-backed.
          </p>
        </aside>
      </div>
    </section>
  )
}
