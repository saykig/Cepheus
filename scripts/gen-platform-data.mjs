import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Regenerate the platform data:  node scripts/gen-platform-data.mjs
// Deterministic (seeded). Five topics, seven institutions, five analytical
// layers: knowledge, authority, dependency, interface, gap.
const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data')

function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const r0 = (n) => Math.round(n)

// ---------------------------------------------------------------- topics
const TOPICS = [
  { id: 'ai-governance', label: 'AI Governance', series: 1, importance: 96,
    description: 'Rules, standards, and oversight for how AI systems are built and deployed.',
    gapType: 'Expertise without authority',
    gap: 'Frontier knowledge sits in private labs and universities while formal authority sits, thinly, in public agencies.',
    coords: { knowledge: 82, authority: 48, dependency: 86, oversight: 38 } },
  { id: 'cybersecurity', label: 'Cybersecurity', series: 3, importance: 82,
    description: 'Protection of digital systems and critical infrastructure from compromise.',
    gapType: 'Fragmented institutional responsibility',
    gap: 'Authority and expertise both exist, but responsibility is split across many agencies and firms.',
    coords: { knowledge: 80, authority: 70, dependency: 64, oversight: 58 } },
  { id: 'military-ai', label: 'Military AI', series: 2, importance: 88,
    description: 'Autonomy, decision support, and AI capability in defence settings.',
    gapType: 'Public dependency on private systems',
    gap: 'Defence holds the authority but depends on private labs for the underlying capability.',
    coords: { knowledge: 64, authority: 78, dependency: 84, oversight: 36 } },
  { id: 'data-governance', label: 'Data Governance', series: 4, importance: 74,
    description: 'Control over how data is collected, shared, protected, and used.',
    gapType: 'Weak oversight',
    gap: 'Broad public stakes with no clear owner and limited oversight of large private data systems.',
    coords: { knowledge: 66, authority: 44, dependency: 78, oversight: 34 } },
  { id: 'biosecurity', label: 'Biosecurity', series: 5, importance: 70,
    description: 'Managing risks from biological research, tools, and emerging capability.',
    gapType: 'Expertise without authority',
    gap: 'Expertise concentrated in universities and labs, with little standing authority to govern it.',
    coords: { knowledge: 78, authority: 40, dependency: 58, oversight: 32 } },
]

// ---------------------------------------------------------------- institutions
const INSTITUTIONS = [
  { id: 'nist', label: 'NIST', type: 'Government agency', series: 1,
    description: 'A U.S. standards body that turns technical practice into measurable frameworks.',
    gap: 'Deep technical and standards weight, but little direct regulatory or deployment authority.',
    k: { technical: 82, legal: 40, policy: 68, security: 66 },
    a: { regulatory: 32, procurement: 22, funding: 30, deployment: 16, standards: 92 } },
  { id: 'cisa', label: 'CISA', type: 'Government agency', series: 3,
    description: 'The U.S. civilian cybersecurity agency coordinating critical-infrastructure defence.',
    gap: 'Real operational authority in cyber, thinner reach into frontier AI expertise.',
    k: { technical: 70, legal: 48, policy: 60, security: 90 },
    a: { regulatory: 56, procurement: 40, funding: 44, deployment: 52, standards: 52 } },
  { id: 'dod', label: 'U.S. Department of Defense', type: 'Government agency', series: 2,
    description: 'The U.S. defence establishment, a dominant buyer and operator of technology.',
    gap: 'Enormous procurement and deployment authority that outruns in-house frontier expertise.',
    k: { technical: 60, legal: 56, policy: 62, security: 82 },
    a: { regulatory: 52, procurement: 94, funding: 86, deployment: 92, standards: 46 } },
  { id: 'nato-diana', label: 'NATO DIANA', type: 'International body', series: 6,
    description: 'A NATO accelerator connecting emerging technology to collective defence.',
    gap: 'Convening and funding power without formal regulatory authority.',
    k: { technical: 56, legal: 44, policy: 56, security: 66 },
    a: { regulatory: 28, procurement: 60, funding: 64, deployment: 46, standards: 40 } },
  { id: 'openai', label: 'OpenAI', type: 'Private lab', series: 4,
    description: 'A private AI lab building frontier models and deployment infrastructure.',
    gap: 'Frontier capability and deployment reach with almost no formal public authority.',
    k: { technical: 95, legal: 42, policy: 52, security: 64 },
    a: { regulatory: 10, procurement: 18, funding: 34, deployment: 74, standards: 36 } },
  { id: 'anthropic', label: 'Anthropic', type: 'Private lab', series: 5,
    description: 'A private AI lab focused on frontier models and safety research.',
    gap: 'Safety and model expertise that sits outside any formal accountability structure.',
    k: { technical: 93, legal: 48, policy: 60, security: 68 },
    a: { regulatory: 12, procurement: 16, funding: 30, deployment: 70, standards: 42 } },
  { id: 'universities', label: 'Universities', type: 'Academic', series: 7,
    description: 'The research base producing expertise, talent, and independent evaluation.',
    gap: 'The broadest knowledge base with the least authority to act on it.',
    k: { technical: 88, legal: 62, policy: 80, security: 60 },
    a: { regulatory: 14, procurement: 12, funding: 26, deployment: 10, standards: 46 } },
]

// how relevant each institution is to each topic (scales its capacity in-topic)
const REL = {
  'ai-governance': { nist: 0.95, cisa: 0.62, dod: 0.72, 'nato-diana': 0.55, openai: 0.96, anthropic: 0.96, universities: 0.92 },
  'cybersecurity': { nist: 0.82, cisa: 0.98, dod: 0.82, 'nato-diana': 0.6, openai: 0.5, anthropic: 0.55, universities: 0.78 },
  'military-ai': { nist: 0.5, cisa: 0.55, dod: 0.98, 'nato-diana': 0.92, openai: 0.52, anthropic: 0.56, universities: 0.66 },
  'data-governance': { nist: 0.82, cisa: 0.72, dod: 0.56, 'nato-diana': 0.4, openai: 0.72, anthropic: 0.74, universities: 0.84 },
  'biosecurity': { nist: 0.56, cisa: 0.5, dod: 0.6, 'nato-diana': 0.5, openai: 0.4, anthropic: 0.52, universities: 0.86 },
}

const K_DIMS = [
  { key: 'technical', label: 'Technical expertise' },
  { key: 'legal', label: 'Legal expertise' },
  { key: 'policy', label: 'Policy expertise' },
  { key: 'security', label: 'Security expertise' },
]
const A_DIMS = [
  { key: 'regulatory', label: 'Regulatory authority' },
  { key: 'procurement', label: 'Procurement authority' },
  { key: 'funding', label: 'Funding authority' },
  { key: 'deployment', label: 'Deployment authority' },
  { key: 'standards', label: 'Standards authority' },
]
const DEFAULT_WEIGHTS = {
  knowledge: { technical: 0.35, legal: 0.2, policy: 0.25, security: 0.2 },
  authority: { regulatory: 0.25, procurement: 0.2, funding: 0.2, deployment: 0.15, standards: 0.2 },
}
const YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

function scaled(base, rel, rand) {
  // keep some baseline capacity, lift toward full where relevant, small jitter
  const v = base * (0.55 + 0.45 * rel) + (rand() - 0.5) * 6
  return clamp(r0(v), 5, 99)
}
function weighted(dimScores, weights) {
  let num = 0, den = 0
  for (const k in weights) { num += dimScores[k] * weights[k]; den += weights[k] }
  return den ? num / den : 0
}
function series(current, rand) {
  // rising trend from ~0.62*current to current across the years
  const start = clamp(current * 0.62 + (rand() - 0.5) * 6, 4, 100)
  const out = []
  for (let i = 0; i < YEARS.length; i++) {
    const p = i / (YEARS.length - 1)
    const base = start + (current - start) * (1 - Math.pow(1 - p, 1.7))
    out.push(clamp(r0(base + (rand() - 0.5) * 5), 4, 100))
  }
  out[YEARS.length - 1] = r0(current)
  return out
}

const scores = {}
TOPICS.forEach((topic, ti) => {
  scores[topic.id] = {}
  INSTITUTIONS.forEach((inst, ii) => {
    const rand = mulberry32(7000 + ti * 131 + ii * 17)
    const rel = REL[topic.id][inst.id]
    const k = {}, a = {}
    K_DIMS.forEach((d) => (k[d.key] = scaled(inst.k[d.key], rel, rand)))
    A_DIMS.forEach((d) => (a[d.key] = scaled(inst.a[d.key], rel, rand)))
    const kAgg = weighted(k, DEFAULT_WEIGHTS.knowledge)
    const aAgg = weighted(a, DEFAULT_WEIGHTS.authority)
    scores[topic.id][inst.id] = {
      knowledge: k,
      authority: a,
      series: { knowledge: series(kAgg, mulberry32(9000 + ti * 131 + ii * 17)), authority: series(aAgg, mulberry32(9100 + ti * 131 + ii * 17)) },
    }
  })
})

const FRICTION_TOPIC_IDS = new Set(['ai-governance', 'cybersecurity'])
const FRICTION_INSTITUTION_IDS = new Set([
  'nist',
  'dod',
  'openai',
  'anthropic',
  'universities',
])
const frictionTopics = TOPICS.filter((topic) => FRICTION_TOPIC_IDS.has(topic.id))
const frictionInstitutions = INSTITUTIONS.filter((institution) =>
  FRICTION_INSTITUTION_IDS.has(institution.id),
)
const frictionScores = Object.fromEntries(
  frictionTopics.map((topic) => [
    topic.id,
    Object.fromEntries(
      frictionInstitutions.map((institution) => [
        institution.id,
        scores[topic.id][institution.id],
      ]),
    ),
  ]),
)

// ---------------------------------------------------------------- files
writeFileSync(`${DATA_DIR}/topics.json`, JSON.stringify(
  TOPICS.map(({ id, label, series, importance, description, gapType, gap, coords }) =>
    ({ id, label, series, importance, description, gapType, gap, coords })), null, 2) + '\n')

writeFileSync(`${DATA_DIR}/institutions.json`, JSON.stringify(
  INSTITUTIONS.map(({ id, label, type, series, description, gap }) =>
    ({ id, label, type, series, description, gap })), null, 2) + '\n')

// annual-scores.json  (Institutional Capacity Explorer)
const annual = {
  title: 'Friction Index',
  description: 'Weight knowledge, authority, dependency, and coordination to see where AI governance and cybersecurity are most misaligned.',
  note: 'Illustrative capacity scores for five institutions across two fields.',
  years: YEARS,
  layers: [
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'authority', label: 'Authority' },
  ],
  dimensions: { knowledge: K_DIMS, authority: A_DIMS },
  defaultWeights: DEFAULT_WEIGHTS,
  topics: frictionTopics.map(({ id, label, description }) => ({ id, label, description })),
  institutions: frictionInstitutions.map(({ id, label, type, series }) => ({ id, label, type, series })),
  scores: frictionScores,
}
writeFileSync(`${DATA_DIR}/annual-scores.json`, JSON.stringify(annual, null, 2) + '\n')

// relationships.json  (Institutional Relationship Map)
const NODE_POS = {
  'ai-governance': [50, 47], 'cybersecurity': [31, 63], 'military-ai': [69, 63],
  'data-governance': [39, 29], 'biosecurity': [61, 27],
  nist: [22, 33], universities: [13, 56], cisa: [24, 82], anthropic: [46, 90],
  openai: [69, 87], dod: [84, 68], 'nato-diana': [88, 43],
}
const K = 'knowledge', A = 'authority', D = 'dependency', I = 'interface'
const EDGES = [
  // knowledge: institution has expertise relevant to a topic
  ['nist', 'ai-governance', K, 0.8, 'NIST holds technical and standards expertise for AI systems.'],
  ['nist', 'cybersecurity', K, 0.78, 'NIST develops the frameworks that structure cyber practice.'],
  ['nist', 'data-governance', K, 0.66, 'NIST expertise extends to data protection and measurement.'],
  ['cisa', 'cybersecurity', K, 0.9, 'CISA carries deep operational security expertise.'],
  ['cisa', 'ai-governance', K, 0.5, 'CISA brings a security lens to AI deployment.'],
  ['dod', 'military-ai', K, 0.7, 'Defence expertise in autonomy, sensing, and operations.'],
  ['dod', 'cybersecurity', K, 0.6, 'Defence holds substantial cyber capability.'],
  ['nato-diana', 'military-ai', K, 0.6, 'DIANA scouts emerging defence technology.'],
  ['openai', 'ai-governance', K, 0.94, 'Frontier model expertise concentrated in the lab.'],
  ['openai', 'data-governance', K, 0.62, 'Model training makes data practice a core competence.'],
  ['anthropic', 'ai-governance', K, 0.92, 'Frontier model and safety expertise.'],
  ['anthropic', 'biosecurity', K, 0.5, 'Safety research reaches into biological risk.'],
  ['universities', 'ai-governance', K, 0.88, 'The research base behind most AI expertise.'],
  ['universities', 'biosecurity', K, 0.86, 'Biological research and evaluation live in universities.'],
  ['universities', 'data-governance', K, 0.7, 'Independent research on data and privacy.'],
  ['universities', 'cybersecurity', K, 0.66, 'Academic security research and talent.'],
  // authority: institution has formal power over a topic
  ['nist', 'ai-governance', A, 0.72, 'NIST sets the standards that shape AI governance.'],
  ['nist', 'cybersecurity', A, 0.7, 'NIST standards carry weight across cyber policy.'],
  ['cisa', 'cybersecurity', A, 0.82, 'CISA holds operational authority over civilian cyber defence.'],
  ['dod', 'military-ai', A, 0.9, 'Defence decides how military AI is procured and deployed.'],
  ['dod', 'ai-governance', A, 0.58, 'Procurement power gives defence leverage over AI practice.'],
  ['nato-diana', 'military-ai', A, 0.6, 'DIANA directs funding toward defence technology.'],
  // dependency: public institution relies on a private/technical actor (directed)
  ['dod', 'openai', D, 0.78, 'Defence relies on private frontier models it does not build.', true],
  ['dod', 'anthropic', D, 0.66, 'Defence draws on private safety and model expertise.', true],
  ['dod', 'universities', D, 0.6, 'Defence depends on the academic talent pipeline.', true],
  ['cisa', 'openai', D, 0.58, 'Cyber defence increasingly leans on private AI systems.', true],
  ['nist', 'universities', D, 0.62, 'Standards work depends on academic research.', true],
  ['nato-diana', 'openai', D, 0.5, 'Alliance technology scouting depends on private capability.', true],
  // interface: a formal mechanism connects public requirements to technical actors
  ['dod', 'openai', I, 0.7, 'Capability reaches defence through procurement.', false, 'Procurement contract'],
  ['nist', 'anthropic', I, 0.6, 'Model risk is assessed through evaluation.', false, 'Safety evaluation'],
  ['cisa', 'openai', I, 0.5, 'Incident and risk information flows through reporting.', false, 'Reporting requirement'],
  ['nist', 'ai-governance', I, 0.66, 'A technical standard connects practice to policy.', false, 'Technical standard'],
  ['universities', 'anthropic', I, 0.55, 'Expertise flows through joint research.', false, 'Research partnership'],
  ['nato-diana', 'openai', I, 0.52, 'Public and private capability meet through partnership.', false, 'Public-private partnership'],
]

const allNodes = [
  ...TOPICS.map((t) => ({ id: t.id, label: t.label, kind: 'topic', type: 'Field', series: t.series, description: t.description, gap: t.gap })),
  ...INSTITUTIONS.map((n) => ({ id: n.id, label: n.label, kind: 'institution', type: n.type, series: n.series, description: n.description, gap: n.gap })),
]
const degree = Object.fromEntries(allNodes.map((n) => [n.id, 0]))
EDGES.forEach(([s, t]) => { degree[s]++; degree[t]++ })
const maxDeg = Math.max(...Object.values(degree))
const nodes = allNodes.map((n) => ({
  ...n,
  x: NODE_POS[n.id][0],
  y: NODE_POS[n.id][1],
  size: Number((3.8 + (degree[n.id] / maxDeg) * 1.9).toFixed(2)),
}))
const edges = EDGES.map(([source, target, kind, strength, description, directed = false, interfaceType = null]) =>
  ({ source, target, kind, strength, description, directed, interfaceType }))

const relationships = {
  title: 'Institutional Constellation Map',
  description: 'See how governments, companies, universities, and standards bodies connect across expertise, power, funding, and dependence.',
  note: 'Solid lines are knowledge; thick lines are authority; arrows are dependency; dashed lines are interface mechanisms.',
  selectionLabel: 'Selected node',
  filters: [
    { id: 'all', label: 'All' },
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'authority', label: 'Authority' },
    { id: 'dependency', label: 'Dependency' },
    { id: 'interface', label: 'Interface' },
  ],
  nodes,
  edges,
}
writeFileSync(`${DATA_DIR}/relationships.json`, JSON.stringify(relationships, null, 2) + '\n')

// ---------------------------------------------------------------- report
console.log('topics:', TOPICS.length, '| institutions:', INSTITUTIONS.length)
console.log('relationship nodes:', nodes.length, '| edges:', edges.length,
  '(', EDGES.filter((e) => e[2] === K).length, 'knowledge,',
  EDGES.filter((e) => e[2] === A).length, 'authority,',
  EDGES.filter((e) => e[2] === D).length, 'dependency,',
  EDGES.filter((e) => e[2] === I).length, 'interface )')
const air = scores['ai-governance']
console.log('AI Governance knowledge (default-weighted), sample ranking:')
console.log(INSTITUTIONS.map((i) => `${i.label} ${r0(weighted(air[i.id].knowledge, DEFAULT_WEIGHTS.knowledge))}`).join(' · '))
console.log('AI Governance authority (default-weighted):')
console.log(INSTITUTIONS.map((i) => `${i.label} ${r0(weighted(air[i.id].authority, DEFAULT_WEIGHTS.authority))}`).join(' · '))
console.log('wrote topics.json, institutions.json, annual-scores.json, relationships.json')
