import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import frictionData from '../../public/data/annual-scores.json' with { type: 'json' }

const expectedTopicIds = ['ai-governance', 'cybersecurity']
const expectedInstitutionIds = [
  'nist',
  'cisa',
  'dod',
  'openai',
  'anthropic',
  'universities',
]

describe('Friction Index data integrity', () => {
  it('contains only the retained fields and institutions', () => {
    assert.deepEqual(
      frictionData.topics.map((topic) => topic.id),
      expectedTopicIds,
    )
    assert.deepEqual(
      frictionData.institutions.map((institution) => institution.id),
      expectedInstitutionIds,
    )
    assert.equal(
      frictionData.note,
      'Illustrative capacity scores for six institutions across two fields.',
    )
  })

  it('has a complete score matrix for the retained data', () => {
    assert.deepEqual(Object.keys(frictionData.scores), expectedTopicIds)

    for (const topicId of expectedTopicIds) {
      assert.deepEqual(
        Object.keys(
          frictionData.scores[
            topicId as keyof typeof frictionData.scores
          ],
        ),
        expectedInstitutionIds,
      )
    }
  })

  it('contains no removed Friction Index entries', () => {
    const serialized = JSON.stringify(frictionData)

    assert.doesNotMatch(
      serialized,
      /nato-diana|NATO DIANA|military-ai|Military AI|biosecurity|Biosecurity/,
    )
  })

  it('keeps every visible series aligned to the year range', () => {
    for (const topicScores of Object.values(frictionData.scores)) {
      for (const score of Object.values(topicScores)) {
        assert.equal(score.series.knowledge.length, frictionData.years.length)
        assert.equal(score.series.authority.length, frictionData.years.length)
      }
    }
  })
})
