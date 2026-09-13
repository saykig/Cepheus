import { createHash } from 'node:crypto'
import type { Bundle, ResearchRecord } from './institutional-map-types.ts'
export const materialCollections = ['sources','evidence','institutions','instruments','relationships','relation-types','taxonomy','status-checks','succession','coverage','institution-attributes','attribute-rubrics','analytical-relations','analytical-rubrics','source-versions','search-log','status-search-log','dependency-investigation'] as const
export const reviewedCollections = ['evidence','institutions','instruments','relationships','institution-attributes','analytical-relations'] as const
function canonical(value: any): any {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).filter(k=>k!=='publicationStatus').sort().map(k=>[k,canonical(value[k])]))
  return value
}
export function researchHash(data: Bundle) {
  return createHash('sha256').update(JSON.stringify(canonical(Object.fromEntries(materialCollections.map(k=>[k,data[k]]))))).digest('hex')
}
export function validateResearch(data: Bundle, production = false): string[] {
  const errors: string[] = []; const fail=(message:string)=>errors.push(message)
  const ids: Record<string,Set<string>>={}
  for(const [name,items] of Object.entries(data)) if(Array.isArray(items)) {
    ids[name]=new Set(); for(const x of items) {if(ids[name].has(x.id)) fail(`duplicate ${name}/${x.id}`);ids[name].add(x.id)}
  }
  const ref=(collection:string,id:string,from:string)=>{if(!ids[collection]?.has(id))fail(`dangling ${collection}/${id} from ${from}`)}
  const refs=(collection:string,values:string[],from:string)=>values.forEach(id=>ref(collection,id,from))
  const evidence=(r:ResearchRecord)=>{
    if(!r.evidenceIds?.length)fail(`unsupported ${r.id}`)
    refs('evidence',r.evidenceIds??[],r.id);refs('evidence',r.counterEvidenceIds??[],r.id)
    if((r.counterEvidenceIds?.length??0)>0 && !r.conflictDisposition && !r.reasoning && !r.derivation)fail(`undisposed conflict ${r.id}`)
  }
  for(const e of data.evidence){ref('sources',e.sourceId,e.id);if(e.supportMode!=='direct'||!e.claim||!e.locator||!e.limitation)fail(`non-atomic or unlocated evidence ${e.id}`);if(data.sources.find(s=>s.id===e.sourceId)?.version!==e.sourceVersion)fail(`source version mismatch ${e.id}`)}
  for(const s of data.sources){if(!s.primary||!s.url?.startsWith('https://')||!s.version)fail(`primary source/version missing ${s.id}`);for(const d of [s.publishedOn,s.revisedOn])if(d&&d>data.release.evidenceCutoff)fail(`source after cutoff ${s.id}`)}
  for(const r of [...data.institutions,...data.instruments])refs('sources',r.sourceIds??[],r.id)
  for(const r of data.relationships){
    ref('institutions',r.source,r.id);ref('institutions',r.target,r.id);ref('instruments',r.instrumentId,r.id);ref('relation-types',r.type,r.id);ref('status-checks',r.statusCheckId,r.id);evidence(r)
    if(r.source===r.target)fail(`self relationship ${r.id}`)
    if(r.basis!=='direct')fail(`co-mention/programme inference ${r.id}`)
    const t=data['relation-types'].find(t=>t.id===r.type)
    if(t && r.directed!==(t.direction!=='undirected'))fail(`direction semantics ${r.id}`)
    const check=data['status-checks'].find(c=>c.id===r.statusCheckId)
    if(!check||check.result!==r.currentStatus||check.relationshipId!==r.id)fail(`status check mismatch ${r.id}`)
    if(r.currentStatus==='active/current'&&(!check?.affirmativeContinuityEvidenceIds?.length||check?.basis==='absence-of-termination'))fail(`active inferred from missing end ${r.id}`)
    if(r.effectiveFrom && r.effectiveTo && r.effectiveFrom>r.effectiveTo)fail(`reversed dates ${r.id}`)
    if(!r.limitations?.length||!r.datePrecision)fail(`missing limitations/date precision ${r.id}`)
    if(r.type==='procurement'&&r.dependence===true)fail(`procurement is not dependence ${r.id}`)
    if(r.type==='evaluation'&&r.authority===true)fail(`evaluation is not authority ${r.id}`)
    if(r.type==='code-participation'&&r.compliance===true)fail(`signature is not compliance ${r.id}`)
  }
  for(const a of data['institution-attributes']){
    ref('institutions',a.institutionId,a.id);ref('attribute-rubrics',a.rubricId,a.id);evidence(a)
    const rubric=data['attribute-rubrics'].find(r=>r.id===a.rubricId)
    if(a.value!=='unresolved'&&!rubric?.anchors.some((x:any)=>x.id===a.value))fail(`unknown rubric result ${a.id}`)
    if(!a.reasoning||!a.context||!a.assessedOn||!a.limitations?.length)fail(`rubric reasoning/context missing ${a.id}`)
  }
  for(const a of data['analytical-relations']){
    ref('analytical-rubrics',a.type,a.id);ref('institutions',a.source,a.id);ref('institutions',a.target,a.id);evidence(a)
    refs('relationships',a.relationshipIds??[],a.id);refs('institution-attributes',a.attributeIds??[],a.id)
    const rubric=data['analytical-rubrics'].find(r=>r.id===a.type)
    if(!a.derivation||!a.conditions?.length)fail(`analytical derivation missing ${a.id}`)
    for(const c of rubric?.requiredConditions??[])if(!a.conditions?.some((x:any)=>x.id===c))fail(`missing necessary condition ${a.id}/${c}`)
    const met=a.conditions?.every((c:any)=>c.met===true&&c.evidenceIds?.length>0)
    if(a.necessityMet!==met||a.sufficiencyMet!==met)fail(`unsupported analytical relation ${a.id}`)
    for(const c of a.conditions??[])refs('evidence',c.evidenceIds??[],a.id)
    for(const required of rubric?.requiredAttributeRubrics??[])if(!a.attributeIds.some((id:string)=>data['institution-attributes'].some(x=>x.id===id&&x.rubricId===required)))fail(`analytical attribute missing ${a.id}/${required}`)
    if(!['established','unresolved'].includes(a.outcome))fail(`missing analytical outcome ${a.id}`)
    if(!met&&a.outcome==='established')fail(`unmet conditions asserted ${a.id}`)
  }
  for(const s of data.succession){ref('institutions',s.predecessorId,s.id);ref('institutions',s.successorId,s.id);if(s.transferRelationshipIds?.length&&!s.transferEvidenceIds?.length)fail(`automatic successor inheritance ${s.id}`)}
  const hash=production?data.release.researchHash:researchHash(data)
  for(const k of reviewedCollections)for(const r of data[k]){
    if(production&&r.publicationStatus!=='published')fail(`provisional production ${k}/${r.id}`)
    if(['reviewed','published'].includes(r.publicationStatus??'')){
      const review=data.reviews.find(x=>x.recordKey===`${k}/${r.id}`&&x.decision==='approved')
      if(!review||review.researchHash!==hash)fail(`review hash mismatch ${k}/${r.id}`)
      if(review && (!['human','agent'].includes(review.reviewerType)||!review.checkedOn||!review.disposition))fail(`incomplete review provenance ${k}/${r.id}`)
      if(review?.reviewer===r.coder)fail(`self review ${k}/${r.id}`)
    }
  }
  for(const c of data['status-checks']) {
    refs('sources',c.sourceIds??[],c.id)
    refs('evidence',c.affirmativeContinuityEvidenceIds??[],c.id)
    if(!c.queries?.length||!c.queryExecution||!c.checks||!c.limitations?.length)fail(`incomplete status investigation ${c.id}`)
  }
  for(const v of data['source-versions']) {
    ref('sources',v.sourceId,v.id)
    if(v.status==='retrieved'&&!/^[a-f0-9]{64}$/.test(v.sha256??''))fail(`missing source fingerprint ${v.id}`)
    if(v.status==='blocked'&&!v.failure)fail(`undisclosed retrieval failure ${v.id}`)
  }
  if(production) {
    const pub=(k:string,id:string,from:string)=>{if(!data[k]?.some((r:any)=>r.id===id&&r.publicationStatus==='published'))fail(`unpublished dependency ${from} → ${k}/${id}`)}
    for(const r of data.relationships){pub('institutions',r.source,r.id);pub('institutions',r.target,r.id);pub('instruments',r.instrumentId,r.id);for(const e of [...r.evidenceIds,...(r.counterEvidenceIds??[])])pub('evidence',e,r.id)}
    for(const r of data['analytical-relations']){for(const id of r.relationshipIds)pub('relationships',id,r.id);for(const id of r.attributeIds)pub('institution-attributes',id,r.id)}
    for(const r of [...data['analytical-relations'],...data['institution-attributes']])for(const id of [...r.evidenceIds,...(r.counterEvidenceIds??[]),...(r.conditions??[]).flatMap((c:any)=>c.evidenceIds)])pub('evidence',id,r.id)
    const keys=reviewedCollections.flatMap(k=>data[k].map(r=>`${k}/${r.id}`)).sort()
    if(JSON.stringify(keys)!==JSON.stringify([...(data.release.publicationRecordKeys??[])].sort()))fail('publication manifest mismatch')
  }
  const banned=new Set(['score','strength','weight','centrality','importanceScore','dependencyStrength','confidenceScore'])
  const walk=(v:any)=>{if(!v||typeof v!=='object')return;for(const [k,x]of Object.entries(v)){if(banned.has(k))fail(`synthetic measure forbidden ${k}`);walk(x)}}
  for(const k of materialCollections)walk(data[k])
  if(data.layout&&(data.layout.radius!==12||data.layout.basis!=='categorical-only'))fail('layout quantity encoding')
  if(data.release.version==='1.0.0'&&(!data.release.editorialSignoff?.approvedBy||!data.release.editorialSignoff?.researchHash||data.release.editorialSignoff.researchHash!==hash))fail('v1.0 requires current owner editorial signoff')
  return errors
}
