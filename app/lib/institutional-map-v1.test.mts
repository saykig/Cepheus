import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { materialCollections, reviewedCollections, validateResearch, researchHash } from './institutional-map-validation.ts'
import { resolveStoryStep, storyStates } from './institutional-map-story.ts'
import type { Bundle } from './institutional-map-types.ts'
const load=()=>Object.fromEntries([...materialCollections,'reviews','release'].map(k=>[k,JSON.parse(readFileSync(new URL(`../../research/data/${k}.json`,import.meta.url),'utf8'))])) as Bundle
const fresh=()=>{const d=load();for(const k of reviewedCollections)for(const r of d[k])r.publicationStatus='provisional';d.reviews=[];return d}
const rejects=(mutate:(d:Bundle)=>void,pattern:RegExp)=>{const d=fresh();mutate(d);assert.match(validateResearch(d).join('\n'),pattern)}
test('canonical research passes semantic validation',()=>assert.deepEqual(validateResearch(load()),[]))
test('duplicate IDs fail',()=>rejects(d=>d.evidence.push(d.evidence[0]),/duplicate/))
test('dangling endpoints fail',()=>rejects(d=>d.relationships[0].target='missing',/dangling/))
test('unlocated atomic evidence fails',()=>rejects(d=>d.evidence[0].locator='',/unlocated/))
test('unversioned evidence fails',()=>rejects(d=>d.evidence[0].sourceVersion='old',/source version mismatch/))
test('unsupported observed relation fails',()=>rejects(d=>d.relationships[0].evidenceIds=[],/unsupported/))
test('co-mention cannot stand as direct evidence',()=>rejects(d=>d.relationships[0].basis='co-mention',/co-mention/))
test('programme membership cannot become pairwise collaboration',()=>rejects(d=>d.relationships[0].basis='programme-membership',/programme inference/))
test('no active status from missing end date',()=>rejects(d=>{const r=d.relationships[0];r.currentStatus='active/current';r.effectiveTo=null;d['status-checks'].find(c=>c.id===r.statusCheckId)!.result='active/current'},/active inferred/))
test('procurement does not automatically imply dependence',()=>rejects(d=>{d.relationships[0].type='procurement';d.relationships[0].dependence=true},/procurement is not dependence/))
test('evaluation does not automatically imply authority',()=>rejects(d=>{d.relationships[0].type='evaluation';d.relationships[0].authority=true},/evaluation is not authority/))
test('code participation is not compliance',()=>rejects(d=>{d.relationships[0].type='code-participation';d.relationships[0].compliance=true},/signature is not compliance/))
test('rubric anchor needs evidence',()=>rejects(d=>d['institution-attributes'][0].evidenceIds=[],/unsupported/))
test('analytical result needs derivation',()=>rejects(d=>d['analytical-relations'][0].derivation='',/analytical derivation missing/))
test('unestablished dependency cannot be asserted',()=>rejects(d=>{const a=d['analytical-relations'].find(a=>a.type==='operational-dependence')!;a.conditions[0].met=false;a.necessityMet=false;a.sufficiencyMet=false;a.outcome='established'},/unmet conditions asserted/))
test('unknown is permissible without finding independence',()=>{const d=fresh();const a=d['analytical-relations'].find(a=>a.type==='operational-dependence')!;a.conditions[0].met=false;a.necessityMet=false;a.sufficiencyMet=false;a.outcome='unresolved';assert.deepEqual(validateResearch(d),[])})
test('successors cannot automatically inherit agreements',()=>rejects(d=>d.succession.push({id:'bad-transfer',predecessorId:'us-aisi',successorId:'caisi',transferRelationshipIds:['openai-us-access'],transferEvidenceIds:[]}),/automatic successor inheritance/))
test('material change invalidates a review',()=>{const d=fresh();const r=d.evidence[0];r.publicationStatus='reviewed';d.reviews=[{id:'fixture-review',recordKey:`evidence/${r.id}`,decision:'approved',researchHash:researchHash(d),reviewer:'independent-fixture',reviewerType:'agent',checkedOn:'2026-09-12',disposition:'Test fixture only'}];assert.deepEqual(validateResearch(d),[]);r.claim+=' changed';assert.match(validateResearch(d).join('\n'),/review hash mismatch/)})
test('coder cannot self-review',()=>rejects(d=>{const r=d.evidence[0];r.publicationStatus='reviewed';d.reviews=[{id:'fixture',recordKey:`evidence/${r.id}`,decision:'approved',researchHash:researchHash(d),reviewer:r.coder,reviewerType:'agent',checkedOn:'2026-09-12',disposition:'fixture'}]},/self review/))
test('production excludes provisional research',()=>rejects(d=>{assert.match(validateResearch(d,true).join('\n'),/provisional production/);d.relationships[0].basis='test'},/co-mention/))
test('layout cannot encode relation-count hierarchy',()=>rejects(d=>d.layout={nodes:{},width:600,height:600,radius:30,basis:'degree'},/layout quantity encoding/))
test('synthetic scores forbidden',()=>rejects(d=>d.institutions[0].score=100,/synthetic measure forbidden/))
test('owner signoff is required for v1.0',()=>rejects(d=>{d.release.version='1.0.0';d.release.editorialSignoff=null},/editorial signoff/))
test('scroll state supports reverse scrolling and reload at depth',()=>{assert.equal(resolveStoryStep([-2000,-1500,-1000,-500,100,700],300),4);assert.equal(resolveStoryStep([-500,100,500,900,1300,1700],300),1);assert.equal(resolveStoryStep([500,900,1300],300),0)})
test('six explicit states, overview has no edge',()=>{assert.equal(storyStates.length,6);assert.equal(storyStates[5].relationshipId,null);assert.equal(storyStates[0].relationshipId,'dod-anthropic-contested')})

test('all thirty developer-family cells are required',()=>rejects(d=>d.coverage.cells.pop(),/incomplete mandatory coverage/))
test('both parties and publication indexes must be searched',()=>rejects(d=>d.coverage.cells[0].searchParties=['developer'],/unreproducible coverage/))
