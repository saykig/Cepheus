'use client'

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useInView } from './use-in-view'
import type { Locale } from 'app/lib/i18n'
import { visualCopy } from 'app/lib/visual-copy'

type Dim = { key: string; label: string }
type Layer = 'knowledge' | 'authority'
type Weights = Record<string, number>

type InstScore = {
  knowledge: Record<string, number>
  authority: Record<string, number>
  series: { knowledge: number[]; authority: number[] }
}
type Institution = { id: string; label: string; type: string; series: number }
type TopicMeta = { id: string; label: string; description: string }

type CapacityData = {
  title: string
  description: string
  note: string
  years: number[]
  layers: { id: Layer; label: string }[]
  dimensions: { knowledge: Dim[]; authority: Dim[] }
  defaultWeights: { knowledge: Weights; authority: Weights }
  topics: TopicMeta[]
  institutions: Institution[]
  scores: Record<string, Record<string, InstScore>>
}

const RANGES = [
  { id: '3Y', years: 3 },
  { id: '5Y', years: 5 },
  { id: 'All', years: 99 },
]

// chart plot geometry (viewBox units)
const VB_W = 300
const VB_H = 208
const PL = 30
const PR = 294
const PT = 12
const PB = 178
const GRID = [0, 25, 50, 75, 100]

const xFor = (i: number, n: number) =>
  n > 1 ? PL + ((PR - PL) * i) / (n - 1) : (PL + PR) / 2
const yFor = (v: number) => PB - (v / 100) * (PB - PT)
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

// The function name is kept so the essay page import stays valid; the tool is
// the Institutional Capacity Explorer.
export function FrontierScoreExplorer({ locale = 'en' }: { locale?: Locale }) {
  const copy = visualCopy[locale]
  const { ref, inView } = useInView<HTMLElement>()
  const [data, setData] = useState<CapacityData | null>(null)
  const [topic, setTopic] = useState<string | null>(null)
  const [layer, setLayer] = useState<Layer>('knowledge')
  const [weights, setWeights] = useState<Weights | null>(null)
  const [range, setRange] = useState('All')
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [hover, setHover] = useState<number | null>(null)
  const [focus, setFocus] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    fetch('/data/annual-scores.json')
      .then((r) => r.json())
      .then((d: CapacityData) => {
        setData(d)
        setTopic(d.topics[0]?.id ?? null)
        setWeights({ ...d.defaultWeights.knowledge })
      })
  }, [])

  const dims = data ? data.dimensions[layer] : []
  const colorOf = (inst: Institution) => `var(--series-${inst.series})`

  const changeLayer = useCallback(
    (next: Layer) => {
      if (!data) return
      setLayer(next)
      setWeights({ ...data.defaultWeights[next] })
      setHidden(new Set())
      setFocus(null)
      setHover(null)
    },
    [data],
  )

  const changeTopic = useCallback((id: string) => {
    setTopic(id)
    setHidden(new Set())
    setFocus(null)
    setHover(null)
  }, [])

  const totalWeight = weights
    ? Object.values(weights).reduce((a, b) => a + b, 0)
    : 0

  const ranked = useMemo(() => {
    if (!data || !weights || !topic) return []
    const topicScores = data.scores[topic]
    const denom = totalWeight || 1
    return data.institutions
      .map((inst) => {
        const dimScores = topicScores[inst.id][layer]
        let raw = 0
        for (const k in weights) raw += (dimScores[k] ?? 0) * weights[k]
        return { inst, live: Math.round((raw / denom) * 10) / 10 }
      })
      .sort((a, b) => b.live - a.live)
  }, [data, weights, topic, layer, totalWeight])

  // ---- FLIP reorder animation for the ranking ----
  const rowRefs = useRef(new Map<string, HTMLDivElement>())
  const prevTops = useRef(new Map<string, number>())
  useLayoutEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const rows = rowRefs.current
    rows.forEach((el) => {
      el.style.transition = 'none'
      el.style.transform = ''
    })
    const next = new Map<string, number>()
    rows.forEach((el, id) => next.set(id, el.getBoundingClientRect().top))
    if (!reduce) {
      let animated = false
      next.forEach((top, id) => {
        const prev = prevTops.current.get(id)
        const el = rows.get(id)
        if (prev != null && el && Math.abs(prev - top) > 0.5) {
          el.style.transform = `translateY(${prev - top}px)`
          animated = true
        }
      })
      if (animated) {
        void document.documentElement.offsetHeight
        requestAnimationFrame(() => {
          rows.forEach((el) => {
            el.style.transition = 'transform 460ms cubic-bezier(0.16,1,0.3,1)'
            el.style.transform = ''
          })
        })
      }
    }
    prevTops.current = next
  }, [ranked])

  const reset = useCallback(() => {
    if (data) setWeights({ ...data.defaultWeights[layer] })
  }, [data, layer])

  const onMove = useCallback(
    (e: ReactPointerEvent<SVGRectElement>) => {
      const svg = svgRef.current
      if (!svg || !data) return
      const rect = svg.getBoundingClientRect()
      const vx = ((e.clientX - rect.left) / rect.width) * VB_W
      const n = Math.min(
        data.years.length,
        RANGES.find((r) => r.id === range)?.years ?? data.years.length,
      )
      const t = (vx - PL) / (PR - PL)
      setHover(clamp(Math.round(t * (n - 1)), 0, n - 1))
    },
    [data, range],
  )

  if (!data || !weights || !topic) {
    return <div className="tool-loading" aria-live="polite" aria-busy="true" />
  }

  const topicMeta = data.topics.find((t) => t.id === topic)!
  const topicScores = data.scores[topic]
  const seriesFor = (id: string) => topicScores[id].series[layer]

  const isDefault = dims.every((d) => weights[d.key] === data.defaultWeights[layer][d.key])

  const nYears = Math.min(
    data.years.length,
    RANGES.find((r) => r.id === range)?.years ?? data.years.length,
  )
  const start = data.years.length - nYears
  const yearsSlice = data.years.slice(start).map(String)
  const activeIdx = hover ?? nYears - 1

  const xTicks = Array.from(
    new Set([0, Math.round((nYears - 1) / 3), Math.round((2 * (nYears - 1)) / 3), nYears - 1]),
  )

  return (
    <section
      ref={ref}
      className={`tool frontier reveal${inView ? ' is-in' : ''}`}
      aria-label={copy.frictionTitle}
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
          <h4 className="tool-title">{copy.frictionTitle}</h4>
          <details className="tool-about">
            <summary>{copy.about}</summary>
            <div className="tool-about-body">
              A capacity score is a weighted average of an institution&apos;s{' '}
              {layer} dimensions for the chosen field. Move the sliders to
              re-weight them; scores normalize to the slider total, so the ranking
              always reads from 0 to 100. {data.note}
            </div>
          </details>
        </div>
      </div>
      <p className="tool-subtitle">{copy.frictionDescription}</p>

      <div className="tool-controls">
        <div className="tool-control-group">
          <span className="tool-label">{copy.field}</span>
          <div className="chip-row" role="group" aria-label={copy.selectField}>
            {data.topics.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`chip${topic === t.id ? ' is-on' : ''}`}
                aria-pressed={topic === t.id}
                onClick={() => changeTopic(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="tool-control-group">
          <span className="tool-label">{copy.layer}</span>
          <div className="chip-row" role="group" aria-label={copy.selectLayer}>
            {data.layers.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`chip${layer === l.id ? ' is-on' : ''}`}
                aria-pressed={layer === l.id}
                onClick={() => changeLayer(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="frontier-grid">
        {/* ---- capacity-over-time chart ---- */}
        <div className="frontier-panel">
          <div className="frontier-panel-head">
            <span className="tool-label">{layer} {copy.overTime}</span>
            <div
              className="chip-row time-range-row"
              role="group"
              aria-label={copy.timeRange}
            >
              {RANGES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`chip${range === r.id ? ' is-on' : ''}`}
                  aria-pressed={range === r.id}
                  onClick={() => {
                    setRange(r.id)
                    setHover(null)
                  }}
                >
                  {r.id}
                </button>
              ))}
            </div>
          </div>

          <svg
            ref={svgRef}
            className="chart-svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label={`${layer} over time for ${data.institutions.map((n) => n.label).join(', ')} in ${topicMeta.label}`}
          >
            <g className="chart-grid">
              {GRID.filter((g) => g !== 0).map((g) => (
                <line key={g} x1={PL} x2={PR} y1={yFor(g)} y2={yFor(g)} />
              ))}
            </g>
            <line className="chart-axis" x1={PL} x2={PR} y1={yFor(0)} y2={yFor(0)} />
            {[0, 50, 100].map((g) => (
              <text key={g} className="chart-tick" x={PL - 5} y={yFor(g) + 2.6} textAnchor="end">
                {g}
              </text>
            ))}
            {xTicks.map((i) => (
              <text
                key={i}
                className="chart-tick"
                x={xFor(i, nYears)}
                y={PB + 12}
                textAnchor="middle"
              >
                {yearsSlice[i]}
              </text>
            ))}

            {data.institutions.map((inst) => {
              const s = seriesFor(inst.id)
              const pts = s.slice(start).map((v, i) => [xFor(i, nYears), yFor(v)])
              const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
              const off = hidden.has(inst.id)
              const isFocus = focus === inst.id
              const dim = focus != null && !isFocus
              return (
                <path
                  key={inst.id}
                  className="chart-line"
                  d={d}
                  stroke={colorOf(inst)}
                  style={{ strokeWidth: isFocus ? 2.4 : 1.6, opacity: off ? 0.1 : dim ? 0.22 : 1 }}
                />
              )
            })}

            {data.institutions
              .filter((inst) => !hidden.has(inst.id))
              .map((inst) => {
                const isFocus = focus === inst.id
                const dim = focus != null && !isFocus
                return (
                  <circle
                    key={`end-${inst.id}`}
                    className="chart-end-dot"
                    cx={xFor(nYears - 1, nYears)}
                    cy={yFor(seriesFor(inst.id)[start + nYears - 1])}
                    r={isFocus ? 2.3 : 1.7}
                    fill={colorOf(inst)}
                    style={{ opacity: dim ? 0.22 : 1 }}
                  />
                )
              })}

            {hover != null && (
              <line
                className="chart-crosshair"
                x1={xFor(hover, nYears)}
                x2={xFor(hover, nYears)}
                y1={PT}
                y2={PB}
              />
            )}
            {hover != null &&
              data.institutions
                .filter((inst) => !hidden.has(inst.id))
                .map((inst) => (
                  <circle
                    key={inst.id}
                    className="chart-dot"
                    cx={xFor(hover, nYears)}
                    cy={yFor(seriesFor(inst.id)[start + hover])}
                    r={1.9}
                    fill={colorOf(inst)}
                  />
                ))}

            <rect
              x={PL}
              y={PT}
              width={PR - PL}
              height={PB - PT}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onPointerMove={onMove}
              onPointerLeave={() => setHover(null)}
            />
          </svg>

          <div className="frontier-readout">
            {data.institutions.map((inst) => (
              <button
                key={inst.id}
                type="button"
                className={`frontier-legend-row${hidden.has(inst.id) ? ' is-off' : ''}`}
                aria-pressed={!hidden.has(inst.id)}
                aria-label={`${inst.label}, ${Math.round(
                  seriesFor(inst.id)[start + activeIdx],
                )} in ${yearsSlice[activeIdx]}. Toggle line.`}
                onMouseEnter={() => setFocus(inst.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(inst.id)}
                onBlur={() => setFocus(null)}
                onClick={() =>
                  setHidden((prev) => {
                    const next = new Set(prev)
                    next.has(inst.id) ? next.delete(inst.id) : next.add(inst.id)
                    return next
                  })
                }
              >
                <span className="frontier-legend-swatch" style={{ background: colorOf(inst) }} />
                <span>{inst.label}</span>
                <span className="frontier-legend-value">
                  {Math.round(seriesFor(inst.id)[start + activeIdx])}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ---- weighted institution ranking ---- */}
        <div className="frontier-panel">
          <div className="frontier-panel-head">
            <span className="tool-label">{copy.institutions}</span>
            <span className="tool-label">{yearsSlice[activeIdx]}</span>
          </div>
          <div className="rank-list">
            {ranked.map((row, i) => (
              <div
                className="rank-row"
                key={row.inst.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(row.inst.id, el)
                  else rowRefs.current.delete(row.inst.id)
                }}
              >
                <span className="rank-num">{i + 1}</span>
                <span className="rank-label">{row.inst.label}</span>
                <span className="rank-score">{row.live.toFixed(1)}</span>
                <div className="rank-track">
                  <span style={{ width: `${row.live}%`, background: colorOf(row.inst) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- weight controls ---- */}
        <div className="frontier-panel">
          <div className="frontier-panel-head">
            <span className="tool-label">{copy.weights}</span>
          </div>
          <div className="weight-list">
            {dims.map((d) => (
              <div className="weight-row" key={d.key}>
                <div className="weight-head">
                  <label htmlFor={`w-${d.key}`}>{d.label}</label>
                  <span className="weight-value">{weights[d.key].toFixed(2)}</span>
                </div>
                <input
                  id={`w-${d.key}`}
                  className="slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={weights[d.key]}
                  style={{ '--fill': weights[d.key] * 100 } as CSSProperties}
                  onChange={(e) =>
                    setWeights((prev) => ({ ...prev!, [d.key]: Number(e.target.value) }))
                  }
                  aria-valuetext={`${d.label} weight ${weights[d.key].toFixed(2)}`}
                />
              </div>
            ))}
          </div>
          <div className="weight-total">
            <span>{copy.totalWeight}</span>
            <strong>{totalWeight.toFixed(2)}</strong>
          </div>
          <button type="button" className="weight-reset" onClick={reset} disabled={isDefault}>
            {copy.reset}
          </button>
        </div>
      </div>
    </section>
  )
}
