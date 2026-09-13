'use client'

/* THESIS: A reader follows one documented connection and opens its evidence.
 * OWN-WORLD: Cepheus paper, ink and olive; equal nodes and fine connecting lines.
 * STORY: See institutions, choose a domain, inspect the mechanism and its limits.
 * FIRST VIEWPORT: A compact network with direct labels, four filters and no profile.
 * FORM: A local simplification of the established essay instrument, not a new visual identity.
 */
import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Locale } from 'app/lib/i18n'
import institutions from '../../public/data/institutional-map/institutions.json'
import relationships from '../../public/data/institutional-map/relationships.json'
import evidence from '../../public/data/institutional-map/evidence.json'
import sources from '../../public/data/institutional-map/sources.json'
import instruments from '../../public/data/institutional-map/instruments.json'
import layout from '../../public/data/institutional-map/layout.json'
import styles from './institutional-link-map.module.css'

const domainLabels = {
  all: 'All domains',
  biosecurity: 'Biosecurity',
  cybersecurity: 'Cybersecurity',
  'cross-domain-ai': 'Cross-domain AI',
}
const methodologyUrl = 'https://github.com/saykig/cepheus/blob/main/research/institutional-map/METHODOLOGY.md'
const institutionById = new Map(institutions.map((item) => [item.id, item]))
const evidenceById = new Map(evidence.map((item) => [item.id, item]))
const sourceById = new Map(sources.map((item) => [item.id, item]))
const instrumentById = new Map(instruments.map((item) => [item.id, item]))
type Relationship = (typeof relationships)[number]
type Selection = { type: 'institution' | 'relationship'; id: string } | null

function date(value: string | null) {
  if (!value) return 'Date not established'
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}
function relationshipLabel(item: Relationship) {
  return `${institutionById.get(item.source)!.label} ${item.directed ? '→' : '↔'} ${institutionById.get(item.target)!.label}: ${item.kind.toLowerCase()}`
}
function point(id: string) { return layout[id as keyof typeof layout] }

// Layout geometry has no substantive meaning. Parallel mechanisms keep separate curves.
function curve(item: Relationship) {
  const a = point(item.source), b = point(item.target)
  const ax = a.x * 7, ay = a.y * 4, bx = b.x * 7, by = b.y * 4
  const dx = bx - ax, dy = by - ay, distance = Math.hypot(dx, dy)
  const nx = dx / distance, ny = dy / distance
  const parallel = item.id === 'anthropic-us-access' || item.id === 'us-anthropic-evaluation'
  const bend = parallel ? 30 : 0
  return `M ${ax + nx * 14} ${ay + ny * 14} Q ${(ax + bx) / 2 - ny * bend} ${(ay + by) / 2 + nx * bend} ${bx - nx * 19} ${by - ny * 19}`
}

export function InstitutionalLinkMap({ locale = 'en' }: { locale?: Locale }) {
  const uid = useId().replace(/:/g, '')
  const [domain, setDomain] = useState<keyof typeof domainLabels>('all')
  const [selection, setSelection] = useState<Selection>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const trigger = useRef<HTMLElement | SVGElement | null>(null)
  const detailHeading = useRef<HTMLHeadingElement>(null)
  const transferFocus = useRef(false)
  useEffect(() => {
    if (transferFocus.current) {
      detailHeading.current?.focus({ preventScroll: true })
      transferFocus.current = false
    }
  }, [selection])
  const visible = relationships.filter((item) => domain === 'all' || item.domains.includes(domain))
  const visibleIds = new Set(visible.flatMap((item) => [item.source, item.target]))
  const selectedRelationship = selection?.type === 'relationship' ? visible.find((item) => item.id === selection.id) : undefined
  const selectedInstitution = selection?.type === 'institution' && visibleIds.has(selection.id) ? institutionById.get(selection.id) : undefined
  const activeRelationship = visible.find((item) => item.id === hovered) ?? selectedRelationship
  const incident = selectedInstitution ? visible.filter((item) => item.source === selectedInstitution.id || item.target === selectedInstitution.id) : []
  const instrument = selectedRelationship ? instrumentById.get(selectedRelationship.instrumentId)! : null
  const open = Boolean(selectedInstitution || selectedRelationship)
  const close = () => { setSelection(null); trigger.current?.focus() }
  const select = (next: NonNullable<Selection>, target: HTMLElement | SVGElement) => { trigger.current = target; setSelection(next) }

  return (
    <section className={styles.map} lang="en" aria-labelledby={`${uid}-title`} onKeyDown={(event) => { if (event.key === 'Escape' && open) { event.preventDefault(); close() } }}>
      <header className={styles.header}>
        <h4 id={`${uid}-title`}>Institutional links</h4>
        <span>Research pilot · 2024–25 records</span>
      </header>
      {locale !== 'en' ? <p className={styles.localeNote}>Research records are currently available in English.</p> : null}
      <div className={styles.domains} role="group" aria-label="Filter relationships by domain">
        {Object.entries(domainLabels).map(([id, label]) => (
          <button type="button" key={id} aria-pressed={id === domain} onClick={() => { setDomain(id as keyof typeof domainLabels); setSelection(null); setHovered(null) }}>{label}</button>
        ))}
      </div>
      <div className={styles.stage}>
        <svg className={styles.connections} viewBox="0 0 700 400" aria-label="Documented institutional relationships" role="group">
          <defs><marker id={`${uid}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 1 1 L 7 4 L 1 7" fill="none" stroke="context-stroke" strokeWidth="1.2" /></marker></defs>
          {visible.map((item) => {
            const emphasized = activeRelationship?.id === item.id || incident.some((link) => link.id === item.id)
            return (
              <g key={item.id} role="button" tabIndex={0} className={`${styles.edge} ${emphasized ? styles.emphasized : ''}`} aria-label={relationshipLabel(item)} aria-expanded={selectedRelationship?.id === item.id} aria-controls={`${uid}-detail`} onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(item.id)} onBlur={() => setHovered(null)} onClick={(event) => select({ type: 'relationship', id: item.id }, event.currentTarget)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select({ type: 'relationship', id: item.id }, event.currentTarget) } }}>
                <title>{relationshipLabel(item)}</title>
                <path className={styles.edgeLine} d={curve(item)} strokeDasharray={item.kind === 'Model access' ? '5 5' : undefined} markerEnd={item.directed ? `url(#${uid}-arrow)` : undefined} />
                <path className={styles.edgeHit} d={curve(item)} />
              </g>
            )
          })}
        </svg>
        {institutions.filter((item) => visibleIds.has(item.id)).map((item) => (
          <button key={item.id} type="button" data-label-position={item.id.includes('aisi') ? 'above' : 'below'} className={`${styles.node} ${selectedInstitution?.id === item.id ? styles.selectedNode : ''}`} style={{ '--x': `${point(item.id).x}%`, '--y': `${point(item.id).y}%` } as CSSProperties} aria-label={`${item.name}: inspect relationships`} aria-expanded={selectedInstitution?.id === item.id} aria-controls={`${uid}-detail`} onClick={(event) => select({ type: 'institution', id: item.id }, event.currentTarget)}>
            <span className={styles.nodeMark} aria-hidden="true" />
            <span className={styles.nodeLabel}>{item.label}</span>
            {item.id.includes('aisi') ? <span className={styles.nodePeriod}>{item.id === 'us-aisi' ? 'NIST · 2024' : '2024 name'}</span> : null}
          </button>
        ))}
      </div>
      <p className={styles.hint} aria-live="polite">{activeRelationship ? relationshipLabel(activeRelationship) : 'Choose an institution or a line to follow its evidence.'}</p>
      <div className={styles.meta}><span>{visibleIds.size} institutions · {visible.length} relationships · US / UK</span><span>Size and distance do not measure power.</span></div>
      <div id={`${uid}-detail`}>
        {open ? <section className={styles.detail} aria-label="Selected record">
          <button type="button" className={styles.close} onClick={close} aria-label="Close selected record">Close ×</button>
          {selectedInstitution ? <>
            <p className={styles.recordType}>{selectedInstitution.kind} · {selectedInstitution.jurisdiction}</p>
            <h5>{selectedInstitution.name}</h5>
            <p>{selectedInstitution.note}</p>
            <ul className={styles.linkList}>{incident.map((item) => <li key={item.id}><button type="button" onClick={() => { transferFocus.current = true; setSelection({ type: 'relationship', id: item.id }) }}>{relationshipLabel(item)}<span aria-hidden="true">↗</span></button></li>)}</ul>
          </> : null}
          {selectedRelationship && instrument ? <>
            <p className={styles.recordType}>{selectedRelationship.kind} · Provisional record</p>
            <h5 ref={detailHeading} tabIndex={-1}>{relationshipLabel(selectedRelationship).split(':')[0]}</h5>
            <p>{instrument.label}</p>
            <p className={styles.status}>{selectedRelationship.eventStatus} · by {date(selectedRelationship.observedBy)}<br />Present status has not been verified.</p>
            <details className={styles.evidence}><summary>Evidence and limits</summary>
              <p>{selectedRelationship.rationale}</p>
              <dl><dt>Context</dt><dd>{selectedRelationship.contexts.join(' / ')}</dd><dt>Jurisdictions</dt><dd>{selectedRelationship.jurisdictions.join(' / ')}</dd><dt>Terms</dt><dd>{instrument.bindingness}</dd><dt>Effective period</dt><dd>Not established from these sources</dd></dl>
              {selectedRelationship.evidenceIds.map((id) => {
                const record = evidenceById.get(id)!, source = sourceById.get(record.sourceId)!
                return <div className={styles.source} key={id}>
                  <p>{record.claim}</p>
                  <a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>
                  <p className={styles.locator}>{source.publisher} · {date(source.publishedOn)} · {source.basis}<br />{record.locator}</p>
                  <p className={styles.limitation}>{record.limitation}</p>
                </div>
              })}
              <p className={styles.locator}>No counterevidence recorded. This is not a finding that none exists. Record: {selectedRelationship.id}.</p>
            </details>
          </> : null}
        </section> : null}
      </div>
      <details className={styles.methodology}><summary>How to read this map</summary>
        <p>These are six provisional relationship records from three primary sources, selected to test the research method. They document past announcements and activities, not a complete or current network.</p>
        <p>Arrows read from provider to access recipient, or evaluator to model provider. The undirected line is a joint exercise. Dashed lines show access agreements. Several lines can connect the same institutions through different mechanisms.</p>
        <p>Domains overlap. Defence is a use context, not a replacement for biosecurity or cybersecurity. An absent link means it is not documented in this sample.</p>
        <p><a href={methodologyUrl} target="_blank" rel="noreferrer">Methodology and research plan ↗</a>{' · '}<a href="https://github.com/saykig/cepheus/tree/main/public/data/institutional-map" target="_blank" rel="noreferrer">Source records ↗</a></p>
        <details><summary>Read relationships as a list</summary><ul className={styles.linkList}>{visible.map((item) => <li key={item.id}><button type="button" onClick={(event) => select({ type: 'relationship', id: item.id }, event.currentTarget)}>{relationshipLabel(item)}</button></li>)}</ul></details>
      </details>
    </section>
  )
}
