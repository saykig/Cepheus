import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describe, it } from 'node:test'
import institutions from '../../research/releases/v0.1/institutions.json' with { type: 'json' }
import relationships from '../../research/releases/v0.1/relationships.json' with { type: 'json' }
import evidence from '../../research/releases/v0.1/evidence.json' with { type: 'json' }
import sources from '../../research/releases/v0.1/sources.json' with { type: 'json' }
import instruments from '../../research/releases/v0.1/instruments.json' with { type: 'json' }
import layout from '../../research/releases/v0.1/layout.json' with { type: 'json' }

const ids = (items: {id: string}[]) => new Set(items.map((item) => item.id))
const institutionIds = ids(institutions), sourceIds = ids(sources), evidenceIds = ids(evidence), instrumentIds = ids(instruments)
const validDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date))

describe('Institutional map evidence admission', () => {
  it('resolves every relationship through a mechanism and located evidence to primary sources', () => {
    for (const records of [institutions, relationships, evidence, sources, instruments]) assert.equal(ids(records).size, records.length)
    for (const record of [...institutions, ...instruments]) {
      assert.ok(record.sourceIds.length > 0)
      for (const id of record.sourceIds) assert.ok(sourceIds.has(id), `Unknown source ${id}`)
    }
    for (const record of evidence) {
      assert.ok(sourceIds.has(record.sourceId))
      assert.ok(record.claim.trim() && record.locator.trim() && record.limitation.trim())
      assert.ok(validDate(record.observedBy))
    }
    for (const link of relationships) {
      assert.ok(institutionIds.has(link.source) && institutionIds.has(link.target))
      assert.notEqual(link.source, link.target)
      assert.ok(instrumentIds.has(link.instrumentId))
      assert.ok(link.evidenceIds.length > 0)
      for (const id of [...link.evidenceIds, ...link.counterEvidenceIds]) assert.ok(evidenceIds.has(id))
      assert.ok(link.rationale.trim())
    }
    for (const source of sources) {
      assert.ok(new URL(source.url).protocol === 'https:')
      assert.ok(source.publishedOn === null || validDate(source.publishedOn))
      assert.ok(validDate(source.accessedOn))
      if (source.publishedOn) assert.ok(source.publishedOn <= source.accessedOn)
    }
  })
  it('keeps domains distinct from context, avoids power scores and preserves predicate direction', () => {
    const domains = new Set(['biosecurity', 'cybersecurity', 'cross-domain-ai'])
    const kinds = new Set(['Model access', 'Evaluation', 'Joint evaluation', 'Research deployment'])
    for (const link of relationships) {
      assert.ok(link.domains.length > 0 && link.domains.every((id) => domains.has(id)))
      assert.ok(kinds.has(link.kind))
      assert.equal(link.directed, link.kind !== 'Joint evaluation')
      for (const field of ['strength', 'weight', 'score', 'confidence']) assert.ok(!(field in link))
      const providerId = link.kind === 'Evaluation' ? link.target : link.source
      if (link.kind !== 'Joint evaluation') assert.equal(institutions.find((item) => item.id === providerId)?.kind, 'Model developer')
    }
    assert.deepEqual(Object.keys(layout).sort(), [...institutionIds].sort())
    for (const node of institutions) assert.ok(!['universities', 'military-ai', 'biosecurity', 'ai-governance'].includes(node.id))
  })
  it('does not turn historical announcements or company reports into verified current relationships', () => {
    for (const link of relationships) {
      assert.equal(link.reviewStatus, 'provisional')
      assert.equal(link.currentStatus, 'unverified')
      assert.equal(link.currentStatusCheckedOn, null)
      assert.equal(link.effectiveFrom, null)
      assert.equal(link.effectiveTo, null)
      assert.ok(validDate(link.observedBy))
      const linkSources = link.evidenceIds.map((id) => sources.find((source) => source.id === evidence.find((item) => item.id === id)?.sourceId)!)
      assert.ok(linkSources.some((source) => link.observedBy <= source.publishedOn))
      if (link.kind === 'Model access') assert.equal(link.eventStatus, 'Announced')
      if (linkSources.every((source) => source.basis === 'Company report')) assert.equal(link.eventStatus, 'Reported deployment')
    }
  })
  it('keeps paused visualizations out of English and localized essay rendering', async () => {
    const files = ['../[locale]/essays/what-we-owe-to-each-other/page.tsx', '../components/localized-essay-draft.tsx']
    for (const file of files) {
      const source = await readFile(new URL(file, import.meta.url), 'utf8')
      for (const component of ['GapMapMatrix', 'FrontierScoreExplorer', 'TechnicalCapacityFigure']) assert.ok(!source.includes(component), `${component} reintroduced into ${file}`)
      assert.ok(source.includes('InstitutionalLinkMap'))
    }
  })
})
