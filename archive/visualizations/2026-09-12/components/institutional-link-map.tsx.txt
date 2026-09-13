'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from './use-in-view'
import { WatercolorNode, WatercolorNodeDefs } from './watercolor-node'
import type { Locale } from 'app/lib/i18n'
import { visualCopy } from 'app/lib/visual-copy'

type Node = {
  id: string
  label: string
  kind: 'topic' | 'institution'
  type: string
  series: number
  x: number
  y: number
  size: number
  description: string
  gap: string
}

type EdgeKind = 'knowledge' | 'authority' | 'dependency' | 'interface'
type Edge = {
  source: string
  target: string
  kind: EdgeKind
  strength: number
  description: string
  directed: boolean
  interfaceType: string | null
}

type NetworkData = {
  title: string
  description: string
  selectionLabel: string
  note: string
  filters: { id: string; label: string }[]
  nodes: Node[]
  edges: Edge[]
}

const colorFor = (node: Node) => `var(--series-${node.series})`

function edgePresentation(edge: Edge, strengthEnabled: boolean) {
  if (edge.kind === 'authority') {
    return { width: strengthEnabled ? 0.7 + edge.strength * 0.9 : 1.1, dash: undefined, arrow: false }
  }
  if (edge.kind === 'interface') {
    return { width: strengthEnabled ? 0.3 + edge.strength * 0.45 : 0.4, dash: '1.8 1.6', arrow: false }
  }
  if (edge.kind === 'dependency') {
    return { width: strengthEnabled ? 0.3 + edge.strength * 0.55 : 0.45, dash: undefined, arrow: true }
  }
  return { width: strengthEnabled ? 0.3 + edge.strength * 0.55 : 0.45, dash: undefined, arrow: false }
}

function labelLines(label: string) {
  if (label === 'U.S. Department of Defense') return ['U.S. Department', 'of Defense']
  if (label === 'AI Governance') return ['AI', 'Governance']
  if (label.length < 16) return [label]

  const words = label.split(' ')
  const midpoint = label.length / 2
  let first = ''
  let second = ''
  for (const word of words) {
    if (!second && `${first} ${word}`.trim().length <= midpoint + 2) {
      first = `${first} ${word}`.trim()
    } else {
      second = `${second} ${word}`.trim()
    }
  }
  return second ? [first, second] : [first]
}

// The function name remains stable so the essay route and localized drafts keep
// their existing public interface.
export function InstitutionalLinkMap({ locale = 'en' }: { locale?: Locale }) {
  const copy = visualCopy[locale]
  const { ref, inView } = useInView<HTMLElement>()
  const [data, setData] = useState<NetworkData | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [strength, setStrength] = useState(true)
  const profileRef = useRef<HTMLElement>(null)
  const profileShellRef = useRef<HTMLDivElement>(null)
  const [profileScrollable, setProfileScrollable] = useState(false)

  useEffect(() => {
    fetch('/data/relationships.json')
      .then((response) => response.json())
      .then((network: NetworkData) => {
        setData(network)
        setSelectedId(network.nodes[0]?.id ?? null)
      })
  }, [])

  const nodesById = useMemo(
    () => new Map((data?.nodes ?? []).map((node) => [node.id, node])),
    [data],
  )

  const updateProfileScroll = useCallback(() => {
    const profile = profileRef.current
    const shell = profileShellRef.current
    if (!profile || !shell) return

    const available = profile.scrollHeight - profile.clientHeight
    const canScroll = available > 2
    const progress = canScroll ? profile.scrollTop / available : 0
    shell.style.setProperty(
      '--profile-scroll-position',
      `${8 + Math.min(1, Math.max(0, progress)) * 84}%`,
    )
    setProfileScrollable((current) => (current === canScroll ? current : canScroll))
  }, [])

  useEffect(() => {
    if (!data) return
    const profile = profileRef.current
    if (!profile) return

    profile.addEventListener('scroll', updateProfileScroll, { passive: true })
    const observer = new ResizeObserver(updateProfileScroll)
    observer.observe(profile)
    updateProfileScroll()

    return () => {
      profile.removeEventListener('scroll', updateProfileScroll)
      observer.disconnect()
    }
  }, [data, updateProfileScroll])

  useEffect(() => {
    const profile = profileRef.current
    if (!profile) return
    profile.scrollTop = 0
    requestAnimationFrame(updateProfileScroll)
  }, [selectedId, updateProfileScroll])

  const normalizedQuery = query.trim().toLowerCase()
  const matches = (node: Node) =>
    !normalizedQuery || node.label.toLowerCase().includes(normalizedQuery)

  const selected = selectedId ? nodesById.get(selectedId) : undefined

  const panel = useMemo(() => {
    if (!data || !selected) return null
    const incidentEdges = data.edges.filter(
      (edge) => edge.source === selected.id || edge.target === selected.id,
    )
    const other = (edge: Edge) =>
      nodesById.get(edge.source === selected.id ? edge.target : edge.source)!
    const unique = (nodes: Node[]) =>
      Array.from(new Map(nodes.map((node) => [node.id, node])).values())
    const byKind = (kind: EdgeKind) =>
      unique(incidentEdges.filter((edge) => edge.kind === kind).map(other))
    return {
      knowledge: byKind('knowledge'),
      authority: byKind('authority'),
    }
  }, [data, selected, nodesById])

  if (!data || !selected || !panel) {
    return <div className="tool-loading constellation-loading" aria-live="polite" aria-busy="true" />
  }

  const activeId = hoveredId ?? selected.id
  const activeNode = nodesById.get(activeId) ?? selected
  const edgeVisible = (edge: Edge) => filter === 'all' || edge.kind === filter
  const edgeElements = data.edges
    .map((edge, index) => ({
      edge,
      index,
      source: nodesById.get(edge.source),
      target: nodesById.get(edge.target),
    }))
    .filter((entry) => entry.source && entry.target)
    .map((entry) => ({
      ...entry,
      visible: edgeVisible(entry.edge),
      incident: entry.edge.source === activeId || entry.edge.target === activeId,
    }))
    .sort((a, b) => Number(a.incident) - Number(b.incident))

  const orderedNodes = [...data.nodes].sort(
    (a, b) => Number(a.id === selectedId) - Number(b.id === selectedId),
  )

  const renderTags = (items: Node[]) =>
    items.length ? (
      <div className="node-tags">
        {items.map((node) => (
          <button
            key={node.id}
            type="button"
            className="node-tag"
            onClick={() => setSelectedId(node.id)}
          >
            {node.label}
          </button>
        ))}
      </div>
    ) : (
      <p className="node-profile-empty">{copy.noMappedLinks}</p>
    )

  return (
    <section
      ref={ref}
      className={`tool constellation reveal${inView ? ' is-in' : ''}${strength ? '' : ' is-strength-uniform'}`}
      aria-label={copy.linkTitle}
      aria-describedby="link-map-instructions"
    >
      <header className="constellation-header">
        <div className="constellation-meta" aria-label={copy.projectName}>
          <span>{copy.projectName}</span>
          <span className="constellation-meta-mark" aria-hidden="true">✳</span>
        </div>
        <h4 className="constellation-title">{copy.linkTitle}</h4>
        <span className="constellation-title-rule" aria-hidden="true" />
      </header>

      <p className="constellation-intro">{copy.linkDescription}</p>

      <div className="constellation-toolbar">
        <div className="chip-row" role="group" aria-label={copy.filter}>
          {data.filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip${filter === item.id ? ' is-on' : ''}`}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="constellation-controls">
          <label className="toggle">
            <input
              type="checkbox"
              checked={strength}
              onChange={(event) => setStrength(event.target.checked)}
            />
            <span className="toggle-track" />
            {copy.lineStrength}
          </label>
          <div className="search-box">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="5" cy="5" r="3.4" stroke="currentColor" strokeWidth="1.1" />
              <path d="M7.6 7.6 10.5 10.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder={copy.search}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={copy.search}
            />
          </div>
          <details className="constellation-about">
            <summary>{copy.about}</summary>
            <p>{data.note}</p>
          </details>
        </div>
      </div>

      <div className="constellation-layout">
        <div className="constellation-canvas">
          <svg viewBox="2 15 100 86" role="img" aria-label={`${data.title}: ${data.nodes.length} nodes`}>
            <title>{data.title}</title>
            <desc>{data.description}</desc>
            <defs>
              <WatercolorNodeDefs id="constellation-node-watercolor" />
              <marker
                id="rel-arrow"
                viewBox="0 0 10 10"
                refX="8.5"
                refY="5"
                markerWidth="3.5"
                markerHeight="3.5"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 z" fill="context-stroke" />
              </marker>
            </defs>

            {edgeElements.map(({ edge, index, source, target, incident, visible }) => {
              const queryDimmed =
                !!normalizedQuery && !(matches(source!) || matches(target!))
              const presentation = edgePresentation(edge, strength)
              const dx = target!.x - source!.x
              const dy = target!.y - source!.y
              const length = Math.hypot(dx, dy) || 1
              const ux = dx / length
              const uy = dy / length
              const targetIsSelected = target!.id === selectedId
              const back = presentation.arrow
                ? target!.size * 0.74 + (targetIsSelected ? 1.6 : 1)
                : 0
              const targetX = target!.x - ux * back
              const targetY = target!.y - uy * back
              const controlX = (source!.x + targetX) / 2 + (-uy) * length * 0.08
              const controlY = (source!.y + targetY) / 2 + ux * length * 0.08
              return (
                <g
                  key={`${edge.source}-${edge.target}-${index}`}
                  className={`constellation-edge-group${incident ? ' is-highlighted' : ''}${queryDimmed ? ' is-dim' : ''}${visible ? '' : ' is-filtered'}`}
                  style={{ '--sc': incident ? colorFor(activeNode) : undefined } as CSSProperties}
                  aria-hidden={!visible || undefined}
                >
                  <path
                    className="constellation-edge-wash"
                    d={`M ${source!.x} ${source!.y} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${targetX.toFixed(2)} ${targetY.toFixed(2)}`}
                    strokeWidth={presentation.width * 3.1}
                    strokeDasharray={presentation.dash}
                  />
                  <path
                    className="constellation-edge-core"
                    d={`M ${source!.x} ${source!.y} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${targetX.toFixed(2)} ${targetY.toFixed(2)}`}
                    strokeWidth={presentation.width * 0.68}
                    strokeDasharray={presentation.dash}
                    markerEnd={presentation.arrow ? 'url(#rel-arrow)' : undefined}
                  >
                    <title>{edge.description}</title>
                  </path>
                </g>
              )
            })}

            {orderedNodes.map((node) => {
              const isSelected = selectedId === node.id
              const isDimmed = normalizedQuery ? !matches(node) : false
              const radius = node.size * 0.74
              const lines = labelLines(node.label)
              const labelY = node.y + radius + 2.9
              return (
                <g
                  key={node.id}
                  className={`constellation-node is-${node.kind}${isSelected ? ' is-selected' : ''}${isDimmed ? ' is-dim' : ''}`}
                  style={{ '--sc': colorFor(node) } as CSSProperties}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${node.label}, ${node.type}`}
                  onClick={() => setSelectedId(node.id)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(node.id)}
                  onBlur={() => setHoveredId(null)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedId(node.id)
                    }
                  }}
                >
                  <WatercolorNode
                    cx={node.x}
                    cy={node.y}
                    radius={radius}
                    filterId="constellation-node-watercolor"
                    kind={node.kind}
                    selected={isSelected}
                    hitRadius={Math.max(radius + 3.2, 7)}
                  />
                  <text x={node.x} y={labelY}>
                    {lines.map((line, index) => (
                      <tspan key={line} x={node.x} dy={index === 0 ? 0 : 2.7}>{line}</tspan>
                    ))}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div
          ref={profileShellRef}
          className={`node-profile-shell${profileScrollable ? ' is-scrollable' : ''}`}
        >
          <aside
            ref={profileRef}
            className="node-profile"
            style={{ '--sc': colorFor(selected) } as CSSProperties}
            aria-live="polite"
          >
            <section className="node-profile-section node-profile-field">
              <span className="tool-label">{copy.field}</span>
              <h5>{selected.label}</h5>
            </section>

            <section className="node-profile-section">
              <span className="tool-label">{copy.panelAbout}</span>
              <p className="node-profile-desc">{selected.description}</p>
            </section>

            <section className="node-profile-section">
              <span className="tool-label">{copy.mainGap}</span>
              <p className="node-gap">{selected.gap}</p>
            </section>

            <section className="node-profile-section">
              <span className="tool-label">{copy.expertise}</span>
              {renderTags(panel.knowledge)}
            </section>

            <section className="node-profile-section">
              <span className="tool-label">{copy.authorityOver}</span>
              {renderTags(panel.authority)}
            </section>
          </aside>
          <span className="node-scroll-rail" aria-hidden="true">
            <span className="node-scroll-thumb" />
          </span>
        </div>
      </div>

      <div className="constellation-instructions" id="link-map-instructions">
        <span className="constellation-info-mark" aria-hidden="true">i</span>
        <p><span>{copy.instructionOne}</span><span>{copy.instructionTwo}</span></p>
      </div>
    </section>
  )
}
