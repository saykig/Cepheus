import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describe, it } from 'node:test'
import pilotData from '../../public/data/gap-data.json' with { type: 'json' }

const expectedTopics = [
  {
    id: 'ai-governance',
    label: 'AI Governance',
    series: 1,
    importance: 96,
    gapType: 'Expertise without authority',
    gap: 'Frontier knowledge sits in private labs and universities while formal authority sits, thinly, in public agencies.',
    knowledge: 82,
    authority: 48,
    dependency: 86,
    oversight: 38,
  },
  {
    id: 'cybersecurity',
    label: 'Cybersecurity',
    series: 3,
    importance: 82,
    gapType: 'Fragmented institutional responsibility',
    gap: 'Authority and expertise both exist, but responsibility is split across many agencies and firms.',
    knowledge: 80,
    authority: 70,
    dependency: 64,
    oversight: 58,
  },
  {
    id: 'military-ai',
    label: 'Military AI',
    series: 2,
    importance: 88,
    gapType: 'Public dependency on private systems',
    gap: 'Defence holds the authority but depends on private labs for the underlying capability.',
    knowledge: 64,
    authority: 78,
    dependency: 84,
    oversight: 36,
  },
  {
    id: 'biosecurity',
    label: 'Biosecurity',
    series: 5,
    importance: 70,
    gapType: 'Expertise without authority',
    gap: 'Expertise concentrated in universities and labs, with little standing authority to govern it.',
    knowledge: 78,
    authority: 40,
    dependency: 58,
    oversight: 32,
  },
]

describe('Gap Matrix illustrative pilot data', () => {
  it('preserves the historical pilot values verbatim', () => {
    assert.equal(pilotData.note, 'Circle size is institutional importance. Illustrative values.')
    assert.deepEqual(pilotData.topics, expectedTopics)
  })

  it('keeps the fixed view on the original Knowledge × Authority preset', () => {
    assert.deepEqual(pilotData.presets[0], {
      id: 'capacity',
      label: 'Knowledge × Authority',
      x: { key: 'knowledge', label: 'Knowledge', low: 'Low', high: 'High' },
      y: { key: 'authority', label: 'Authority', low: 'Low', high: 'High' },
    })
  })

  it('contains no evidence-backed assessment state', () => {
    const serialized = JSON.stringify(pilotData)
    for (const forbiddenKey of [
      'assessment',
      'evidenceId',
      'reviewStatus',
      'derived',
      'confidence',
      'rubricVersion',
    ]) {
      assert.equal(serialized.includes(forbiddenKey), false)
    }
  })

  it('does not connect the visual component to the evidence dataset', async () => {
    const component = await readFile(
      new URL('../components/gap-map-matrix.tsx', import.meta.url),
      'utf8',
    )

    assert.doesNotMatch(component, /\/data\/gap-matrix\//)
    assert.doesNotMatch(component, /deriveAssessment|ComponentAssessment/)
    assert.match(component, /\/data\/gap-data\.json/)
  })

  it('uses the shared project marker without a separate node readout', async () => {
    const [gapComponent, frictionComponent] = await Promise.all([
      readFile(
        new URL('../components/gap-map-matrix.tsx', import.meta.url),
        'utf8',
      ),
      readFile(
        new URL('../components/frontier-score-explorer.tsx', import.meta.url),
        'utf8',
      ),
    ])

    for (const component of [gapComponent, frictionComponent]) {
      assert.match(component, /copy\.projectName/)
      assert.match(component, /constellation-meta-mark/)
      assert.match(component, /✳/)
    }

    assert.doesNotMatch(gapComponent, /gap-selected-node|Selected node:/)
    assert.doesNotMatch(gapComponent, /gap-toolbar/)
    assert.doesNotMatch(gapComponent, />\s*Illustrative importance\s*</)
    assert.doesNotMatch(gapComponent, />\s*Illustrative pilot\s*</)
  })
})
