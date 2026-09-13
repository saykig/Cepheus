import { readFile,writeFile,mkdir } from 'node:fs/promises'
import { forceSimulation,forceX,forceY,forceCollide } from 'd3-force'
import Ajv from 'ajv'
import { materialCollections,validateResearch,researchHash,reviewedCollections } from '../../app/lib/institutional-map-validation.ts'
import {storyStates} from '../../app/lib/institutional-map-story.ts'
import type { Bundle } from '../../app/lib/institutional-map-types.ts'
const dir=new URL('../../research/data/',import.meta.url)
const names=[...materialCollections,'reviews','release']
const data=Object.fromEntries(await Promise.all(names.map(async k=>[k,JSON.parse(await readFile(new URL(`${k}.json`,dir),'utf8'))]))) as Bundle
const schema=JSON.parse(await readFile(new URL('../../research/schema/dataset.schema.json',import.meta.url),'utf8'))
const ajv=new Ajv({allErrors:true,strict:false});const check=ajv.compile(schema)
if(!check(data))throw new Error(ajv.errorsText(check.errors))
const errors=validateResearch(data);if(errors.length)throw new Error(errors.join('\n'))
if(process.argv.includes('--hash')){console.log(researchHash(data));process.exit(0)}
if(!process.argv.includes('--export')){console.log('Research schema and semantic validation passed.');process.exit(0)}
// Publication uses the full research hash, retained in a compact audit envelope.
const approved=structuredClone(data)
for(const k of reviewedCollections)(approved[k] as any)=data[k].filter(x=>x.publicationStatus==='published')
const members=new Set(approved.relationships.flatMap(r=>[r.source,r.target]))
approved.institutions=approved.institutions.filter(i=>members.has(i.id))
const nodes=approved.institutions.slice().sort((a,b)=>a.id.localeCompare(b.id)).map(i=>({id:i.id,group:i.group}))
const centers={public:[150,170],developers:[425,290],evaluation:[180,440]}
// Fixed order, fixed phyllotaxis initialization, fixed tick count. No links/charge.
const simulation=forceSimulation(nodes as any).stop().force('x',forceX((n:any)=>centers[n.group][0]).strength(.15)).force('y',forceY((n:any)=>centers[n.group][1]).strength(.15)).force('collision',forceCollide(49).iterations(4))
simulation.tick(360)
approved.layout={width:600,height:600,radius:12,basis:'categorical-only',nodes:Object.fromEntries(nodes.map((n:any)=>[n.id,{x:Math.round(n.x*100)/100,y:Math.round(n.y*100)/100}]))}
approved.release={...approved.release,researchHash:researchHash(data),publicationRecordKeys:reviewedCollections.flatMap(k=>approved[k].map(r=>`${k}/${r.id}`))}
approved['status-checks']=approved['status-checks'].filter(c=>approved.relationships.some(r=>r.id===c.relationshipId))
for(const state of storyStates){
 if(state.relationshipId&&!approved.relationships.some(r=>r.id===state.relationshipId))throw new Error(`Story ${state.id} references unpublished relationship`)
 for(const id of state.institutions??[])if(!approved.institutions.some(i=>i.id===id))throw new Error(`Story ${state.id} references unpublished institution ${id}`)
}
const exportErrors=validateResearch(approved,true);if(exportErrors.length)throw new Error(exportErrors.join('\n'))
await mkdir(new URL('../../public/data/institutional-map/',import.meta.url),{recursive:true})
await writeFile(new URL('../../public/data/institutional-map/bundle.json',import.meta.url),JSON.stringify(approved,null,2)+'\n')
const view={institutions:approved.institutions.map(({id,label,name,kind,group})=>({id,label,name,kind,group})),relationships:approved.relationships.map(({id,source,target,type,announcedOn,observedBy,eventStatus,currentStatus,currentStatusCheckedOn})=>({id,source,target,type,announcedOn,observedBy,eventStatus,currentStatus,currentStatusCheckedOn})),'relation-types':approved['relation-types'].map(({id,label})=>({id,label})),'analytical-relations':approved['analytical-relations'].map(({id,type,relationshipIds,shortLabel})=>({id,type,relationshipIds,shortLabel})),release:approved.release,layout:approved.layout}
await writeFile(new URL('../../public/data/institutional-map/constellation.json',import.meta.url),JSON.stringify(view,null,2)+'\n')
console.log(`Exported ${approved.institutions.length} institutions, ${approved.relationships.length} documented interfaces, ${approved['analytical-relations'].length} assessments; ${data.release.version}.`)
