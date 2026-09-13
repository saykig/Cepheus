import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import projection from '../../../public/data/institutional-map/constellation.json' with {type:'json'}
import type {Bundle} from '../../../app/lib/institutional-map-types.ts'
import {institutionalWorld,institutionalScene,worldBounds,settledFraction,routedInstitutionPath,worldProjection,emptyRevealRegistry,advanceReveal} from '../../../app/lib/institutional-map-world.ts'
const data=projection as unknown as Bundle

test('preview retains one fixed world through six stages and reverse scrolling',()=>{
 const original=JSON.stringify(data),world=institutionalWorld(data)
 for(const step of [0,1,2,3,4,5,4,3,2,1,0]){
  const scene=institutionalScene(data,step)
  assert.deepEqual(scene.nodes.map(n=>({id:n.id,position:n.position})),world.map(n=>({id:n.id,position:n.position})))
  assert.deepEqual(scene.edges.map(e=>e.id),data.relationships.map(r=>r.id))
  for(const edge of scene.edges.filter(e=>e.visible))assert.ok(scene.nodes.find(n=>n.id===edge.source)?.visible&&scene.nodes.find(n=>n.id===edge.target)?.visible)
 }
 assert.equal(JSON.stringify(data),original)
})
test('opening foreground is DoD–Anthropic; final exposes the complete published network',()=>{
 const opening=institutionalScene(data,0)
 assert.deepEqual(opening.nodes.filter(n=>n.visible).map(n=>n.id).sort(),['anthropic','dod'])
 assert.deepEqual(opening.edges.filter(e=>e.visible).map(e=>e.id),['dod-anthropic-contested'])
 const final=institutionalScene(data,5)
 assert.equal(final.nodes.filter(n=>n.visible).length,15)
 assert.equal(final.edges.filter(e=>e.visible).length,31)
 for(let step=1;step<6;step++)assert.ok(institutionalScene(data,step).nodes.filter(n=>n.visible).length>=institutionalScene(data,step-1).nodes.filter(n=>n.visible).length)
})
test('follow preserves context, geometry and exact evidence identity',()=>{
 const base=institutionalScene(data,2)
 const next=institutionalScene(data,2,['uk-anthropic-evaluation'],'anthropic','uk-anthropic-evaluation')
 for(const node of base.nodes){assert.deepEqual(next.nodes.find(n=>n.id===node.id)?.position,node.position);if(node.visible)assert.ok(next.nodes.find(n=>n.id===node.id)?.visible)}
 assert.ok(next.nodes.find(n=>n.id==='uk-aisi')?.visible)
 assert.equal(next.edges.filter(e=>e.highlighted).length,1)
 assert.equal(next.edges.find(e=>e.highlighted)?.id,'uk-anthropic-evaluation')
})
test('field spreads public and private institutions widely with stable nonquantitative lanes',()=>{
 const world=institutionalWorld(data)
 const publicX=world.filter(n=>data.institutions.find(i=>i.id===n.id)?.group==='public').map(n=>n.position.x)
 const privateX=world.filter(n=>data.institutions.find(i=>i.id===n.id)?.group==='developers').map(n=>n.position.x)
 assert.ok(Math.min(...privateX)-Math.max(...publicX)>worldBounds.width*.65)
 for(const n of world){assert.ok(n.position.x>=20&&n.position.x+138<worldBounds.width);assert.ok(n.position.y>=60&&n.position.y+44<worldBounds.height-40)}
 assert.notEqual(routedInstitutionPath(10,30,600,400,-3),routedInstitutionPath(10,30,600,400,3))
})
test('settling is monotonic, bounded and finishes without bouncing',()=>{
 let last=0
 for(let time=0;time<=1600;time+=10){const current=settledFraction(time);assert.ok(current>=last&&current>=0&&current<=1);last=current}
 assert.equal(settledFraction(0),0);assert.equal(settledFraction(1100),1)
})
test('canonical essay uses the approved editorial renderer in every environment',async()=>{
 const wrapper=await readFile(new URL('../../../app/components/institutional-link-map.tsx',import.meta.url),'utf8')
 assert.ok(wrapper.includes('return <Constellation {...props} />'))
 assert.ok(wrapper.includes('m.EditorialMapPreview'));assert.ok(!wrapper.includes('CurrentInstitutionalLinkMap'))
 assert.ok(!wrapper.includes("process.env.NODE_ENV==='development'"))
 const route=await readFile(new URL('../../../app/[locale]/map-preview/page.tsx',import.meta.url),'utf8')
 assert.ok(route.includes("process.env.NODE_ENV !== 'development'"));assert.ok(route.includes('EditorialPreviewProvider'))
})

test('wide short tablet projection uses field width with separated rows',()=>{
 const projection=worldProjection({width:756,height:400})
 assert.equal(projection.bounds.width,780);assert.equal(projection.bounds.height,410)
 const zoom=Math.min((756-20)/780,(400-32)/410)
 assert.ok(584*zoom>500)
 assert.ok(130*projection.yScale*zoom>44)
 assert.equal(worldProjection({width:350,height:540}).yScale,1)
})

test('following from either endpoint traces the identical cubic in reverse',()=>{
 for(const [sx,sy,tx,ty] of [[0,20,600,300],[300,20,310,500]]){
  const numbers=(path:string)=>path.match(/-?\d+(?:\.\d+)?/g)!.map(Number)
  const forward=numbers(routedInstitutionPath(sx,sy,tx,ty,2))
  const reverse=numbers(routedInstitutionPath(sx,sy,tx,ty,2,true))
  assert.deepEqual(reverse,[...forward.slice(6,8),...forward.slice(4,6),...forward.slice(2,4),...forward.slice(0,2)])
 }
})

test('forward reveal accumulates; reverse and revisits preserve first-reveal history',()=>{
 let registry=emptyRevealRegistry(0)
 for(let step=0;step<6;step++){
  const previous=registry
  registry=advanceReveal(registry,institutionalScene(data,step),step)
  for(const id of previous.edges)assert.ok(registry.edges.has(id))
  for(const id of previous.nodes)assert.ok(registry.nodes.has(id))
  for(const id of registry.newEdges)assert.ok(!previous.seenEdges.has(id))
  for(const id of registry.newNodes)assert.ok(!previous.seenNodes.has(id))
 }
 assert.equal(registry.edges.size,data.relationships.length)
 registry=advanceReveal(registry,institutionalScene(data,0),0)
 assert.equal(registry.edges.size,1)
 assert.equal(registry.seenEdges.size,data.relationships.length)
 registry=advanceReveal(registry,institutionalScene(data,3),3)
 assert.equal(registry.newEdges.size,0)
 assert.equal(registry.newNodes.size,0)
})
test('Follow and emphasis changes cannot clear the accumulated world',()=>{
 let registry=advanceReveal(emptyRevealRegistry(0),institutionalScene(data,0),0)
 registry=advanceReveal(registry,institutionalScene(data,0,['uk-anthropic-evaluation'],'anthropic','uk-anthropic-evaluation'),0)
 const ids=[...registry.edges]
 registry=advanceReveal(registry,institutionalScene(data,1),1)
 for(const id of ids)assert.ok(registry.edges.has(id))
 assert.ok(registry.nodes.has('uk-aisi'))
 const repeat=advanceReveal(registry,institutionalScene(data,1,[],null,null),1)
 assert.equal(repeat,registry)
})
