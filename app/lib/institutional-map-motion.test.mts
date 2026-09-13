import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createInstitutionMotion, institutionViewport, institutionPresence } from './institutional-map-motion.ts'

const targets=[{id:'a',position:{x:0,y:93}},...Array.from({length:4},(_,i)=>({id:`b${i}`,position:{x:190,y:i*62}}))]
const edges=targets.slice(1).map(n=>({source:'a',target:n.id}))
test('scroll direction controls the entry boundary without altering source data',()=>{
  const before=JSON.stringify({targets,edges})
  for(const direction of [1,-1]){
    const {nodes,simulation}=createInstitutionMotion(targets,edges,new Map(),direction,300)
    assert.equal(Math.sign(nodes[0].y-targets[0].position.y),direction)
    simulation.tick(100);simulation.stop()
  }
  assert.equal(JSON.stringify({targets,edges}),before)
})
test('physics settles deterministically with separated labels and finite coordinates',()=>{
  const run=()=>{const result=createInstitutionMotion(targets,edges,new Map(),1,300);result.simulation.tick(100);result.simulation.stop();return result.nodes}
  const first=run();const second=run()
  assert.deepEqual(first,second)
  for(const n of first){
    assert.ok(Number.isFinite(n.x)&&Number.isFinite(n.y))
    assert.ok(Math.abs(n.x-n.targetX)<30&&Math.abs(n.y-n.targetY)<30)
    assert.ok(Math.hypot(n.vx??0,n.vy??0)<.2)
  }
  for(let i=0;i<first.length;i++)for(let j=i+1;j<first.length;j++){
    assert.ok(Math.abs(first[i].x-first[j].x)>138||Math.abs(first[i].y-first[j].y)>44)
  }
})
test('interrupted transitions reuse existing node positions',()=>{
  const previous=new Map([['a',{x:32,y:74}]])
  const {nodes,simulation}=createInstitutionMotion(targets,edges,previous,-1,300)
  assert.equal(nodes[0].x,32);assert.equal(nodes[0].y,74)
  simulation.stop()
})
test('new nodes visibly travel across several animation frames before settling',()=>{
  const {nodes,simulation}=createInstitutionMotion(targets,edges,new Map(),1,300)
  const start=nodes.map(n=>({x:n.x,y:n.y}))
  simulation.tick(4) // 100ms at the presentation's 40Hz simulation clock
  const early=nodes.map(n=>({x:n.x,y:n.y}))
  simulation.tick(12) // 400ms
  assert.ok(nodes.some((n,i)=>Math.hypot(n.x-early[i].x,n.y-early[i].y)>10))
  assert.ok(nodes.every((n,i)=>Math.hypot(n.x-start[i].x,n.y-start[i].y)>100))
  simulation.stop()
})

test('hidden or invalid canvas sizes cannot corrupt the graph camera',()=>{
  const graph={width:328,height:62,focusX:0}
  for(const size of [{width:0,height:0},{width:440,height:0},{width:0,height:270},{width:NaN,height:270}]){
    assert.equal(institutionViewport(size,graph),null)
  }
  for(const size of [{width:320,height:180},{width:440,height:460}]){
    const viewport=institutionViewport(size,graph)!
    assert.ok(viewport.zoom>0&&viewport.zoom<=1.1)
    assert.ok(viewport.x>=0&&viewport.y>=0)
    assert.ok(viewport.x+graph.width*viewport.zoom<=size.width)
    assert.ok(viewport.y+graph.height*viewport.zoom<=size.height)
  }
})
test('presence completes from elapsed time even after a suspended animation frame',()=>{
  assert.equal(institutionPresence(0),0)
  assert.ok(institutionPresence(350)>0&&institutionPresence(350)<1)
  assert.equal(institutionPresence(700),1)
  assert.equal(institutionPresence(60000),1)
})
