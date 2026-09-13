import type { Bundle } from './institutional-map-types.ts'
import { storyStates } from './institutional-map-story.ts'

// Presentation categories, never research quantities. Positions do not depend on degree or story state.
const places: Record<string, [number, number, number]> = {
 dod:[26,70,0], anthropic:[610,70,0],
 dsit:[26,210,1], 'eu-ai-office':[26,350,1], gsa:[26,490,1], openai:[610,205,1],
 gds:[26,630,2], google:[610,340,2], microsoft:[610,475,2], xai:[610,610,2],
 caisi:[306,190,3], 'uk-aisi':[306,320,3], 'us-aisi':[306,450,3], llnl:[306,580,3],
 openmined:[306,710,5],
}
export const worldBounds={width:780,height:820,focusX:0}
export const timing={emphasis:450,settle:1100,edge:1050,edgeDelay:550,labelDelay:1600,recede:900}
export function institutionalWorld(data:Bundle) {
 return data.institutions.map(i=>{
  const p=places[i.id]
  if(!p)throw new Error(`Missing reviewed presentation position for ${i.id}`)
  return {id:i.id,position:{x:p[0],y:p[1]},introduced:p[2],side:i.group==='public'?'right' as const:'left' as const}
 })
}
export function institutionalScene(data:Bundle,step:number,followed:string[]=[],focus:string|null=null,selected:string|null=null) {
 const world=institutionalWorld(data)
 const retained=new Set(data.relationships.filter(r=>followed.includes(r.id)).flatMap(r=>[r.source,r.target]))
 const visible=new Set(world.filter(n=>n.introduced<=step||retained.has(n.id)).map(n=>n.id))
 const storyId=storyStates[step].relationshipId
 const activeId=selected??storyId
 const active=data.relationships.find(r=>r.id===activeId)
 const foreground=new Set(active?[active.source,active.target]:[])
 if(step===1)data.institutions.filter(i=>i.group==='public'&&visible.has(i.id)).forEach(i=>foreground.add(i.id))
 if(focus)foreground.add(focus)
 return {
  nodes:world.map(n=>({...n,visible:visible.has(n.id),foreground:foreground.has(n.id)})),
  edges:data.relationships.map(r=>({id:r.id,source:r.source,target:r.target,
   visible:visible.has(r.source)&&visible.has(r.target),highlighted:r.id===activeId,
   incident:!!focus&&(r.source===focus||r.target===focus),retained:followed.includes(r.id),
   // Routing lanes are stable ID order, with no substantive meaning.
   lane: [...data.relationships].sort((a,b)=>a.id.localeCompare(b.id)).findIndex(e=>e.id===r.id)%7-3,
  })),
 }
}
// Critically damped settling from a nearby 14px offset; monotonic, bounded, deterministic.
export function settledFraction(milliseconds:number,duration=timing.settle) {
 const t=Math.max(0,Math.min(1,milliseconds/duration))
 const end=1-9*Math.exp(-8)
 return (1-(1+8*t)*Math.exp(-8*t))/end
}
export function routedInstitutionPath(sx:number,sy:number,tx:number,ty:number,lane:number,reverse=false) {
 const bend=lane*22
 const dx=tx-sx
 const outer=Math.max(sx,tx)+100+Math.abs(lane)*24
 const c1=[Math.abs(dx)<180?outer:sx+dx*.3,sy+bend]
 const c2=[Math.abs(dx)<180?outer:tx-dx*.3,ty-bend]
 // Reverse the same cubic, rather than calculating a different return route.
 return reverse
  ? `M ${tx} ${ty} C ${c2[0]} ${c2[1]}, ${c1[0]} ${c1[1]}, ${sx} ${sy}`
  : `M ${sx} ${sy} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${tx} ${ty}`
}

// Portrait-tablet top frames use width without shrinking a tall world into a thin strip.
// Only viewport geometry changes this projection; narrative state never does.
export function worldProjection(size:{width:number;height:number}) {
 const compact=size.width>=600&&size.height>0&&size.height<480
 return {bounds:{...worldBounds,height:compact?410:worldBounds.height},yScale:compact?.46:1}
}

export type RevealRegistry = {
 step:number; nodes:Set<string>; edges:Set<string>;
 seenNodes:Set<string>; seenEdges:Set<string>;
 newNodes:Set<string>; newEdges:Set<string>;
}
export function emptyRevealRegistry(step:number):RevealRegistry {
 return {step,nodes:new Set(),edges:new Set(),seenNodes:new Set(),seenEdges:new Set(),newNodes:new Set(),newEdges:new Set()}
}
export function advanceReveal(previous:RevealRegistry,scene:ReturnType<typeof institutionalScene>,step:number):RevealRegistry {
 const desiredNodes=scene.nodes.filter(n=>n.visible).map(n=>n.id)
 const desiredEdges=scene.edges.filter(e=>e.visible).map(e=>e.id)
 const nodes=new Set(step<previous.step?desiredNodes:[...Array.from(previous.nodes),...desiredNodes])
 const edges=new Set(step<previous.step?desiredEdges:[...Array.from(previous.edges),...desiredEdges])
 if(step===previous.step&&nodes.size===previous.nodes.size&&edges.size===previous.edges.size)return previous
 return {step,nodes,edges,
  newNodes:new Set([...Array.from(nodes)].filter(id=>!previous.seenNodes.has(id))),
  newEdges:new Set([...Array.from(edges)].filter(id=>!previous.seenEdges.has(id))),
  seenNodes:new Set([...Array.from(previous.seenNodes),...Array.from(nodes)]),seenEdges:new Set([...Array.from(previous.seenEdges),...Array.from(edges)])}
}
