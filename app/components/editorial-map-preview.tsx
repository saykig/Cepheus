'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ReactFlow, ReactFlowProvider, Handle, Position, BaseEdge, getBezierPath, useReactFlow, type NodeProps, type EdgeProps, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import bundle from '../../public/data/institutional-map/constellation.json'
import type { Bundle } from '../lib/institutional-map-types'
import styles from './editorial-map-preview.module.css'

const data = bundle as unknown as Bundle
const institution = (id: string) => data.institutions.find(i => i.id === id)!
const neighbors = (id: string) => Array.from(new Set(data.relationships.filter(r => r.source === id || r.target === id).map(r => r.source === id ? r.target : r.source))).sort((a,b) => institution(a).label.localeCompare(institution(b).label))
type EditorialNode = Node<{ label: string; name: string; active: boolean; exiting?: boolean; follow: () => void }, 'editorial'>
function InstitutionNode({ data: n }: NodeProps<EditorialNode>) {
  return <div className={styles.institution} data-active={n.active}>
    <Handle type="target" position={Position.Left} className={styles.handle} />
    <button className={`${styles.nodeButton} nodrag nopan`} disabled={n.exiting} tabIndex={n.exiting?-1:0} onClick={n.follow} aria-label={n.active?`Read about ${n.name}`:`Follow ${n.name}`}><span className={styles.mark}/><span>{n.label}</span>{!n.active&&<span className={styles.forward} aria-hidden="true">›</span>}</button>
    <Handle type="source" position={Position.Right} className={styles.handle} />
  </div>
}
function InkEdge(props: EdgeProps) {
  const [path] = getBezierPath(props)
  return <BaseEdge id={props.id} path={path} className={styles.inkEdge} interactionWidth={20} />
}
const nodeTypes = { editorial: InstitutionNode }
const edgeTypes = { ink: InkEdge }

function MapStudy({ initialInstitution }: { initialInstitution: string }) {
  const [trail, setTrail] = useState([initialInstitution])
  const [reduced, setReduced] = useState(false)
  const [reading, setReading] = useState(false)
  const [size,setSize] = useState({width:440,height:460})
  const canvas=useRef<HTMLDivElement>(null)
  const back=useRef<HTMLButtonElement>(null)
  const disclosure=useRef<HTMLDetailsElement>(null)
  const origin = trail[trail.length-1]
  const { setViewport, fitView } = useReactFlow()
  useEffect(() => { const q = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(q.matches); update(); q.addEventListener('change', update); return () => q.removeEventListener('change', update) }, [])
  useEffect(()=>{if(!canvas.current)return;const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(canvas.current);return()=>observer.disconnect()},[])
  const follow=useCallback((id:string)=>{
    setReading(false)
    setTrail(previous=>previous.includes(id)?previous.slice(0,previous.indexOf(id)+1):[...previous,id])
    requestAnimationFrame(()=>back.current?.focus({preventScroll:true}))
  },[])
  const showReading=useCallback(()=>{setReading(true);requestAnimationFrame(()=>disclosure.current?.querySelector('summary')?.focus({preventScroll:true}))},[])
  const graph = useMemo(() => {
    // This is an exploration trail, not a hierarchy inferred from the research.
    const next=neighbors(origin).filter(id=>!trail.includes(id))
    const middle=Math.max(0,next.length-1)*62/2
    const nodes:EditorialNode[]=trail.map((id,index)=>({id,type:'editorial',position:{x:index*190,y:middle},data:{label:institution(id).label,name:institution(id).name,active:id===origin,follow:id===origin?showReading:()=>follow(id)}}))
    const edges:Edge[]=trail.slice(1).map((id,index)=>({id:`${trail[index]}--${id}`,source:trail[index],target:id,type:'ink'}))
    const focusX=(trail.length-1)*190
    next.forEach((id,index)=>{
      nodes.push({id,type:'editorial',position:{x:focusX+190,y:index*62},data:{label:institution(id).label,name:institution(id).name,active:false,follow:()=>follow(id)}})
      edges.push({id:`${origin}--${id}`,source:origin,target:id,type:'ink'})
    })
    return {nodes,edges,height:Math.max(44,next.length*62),width:next.length?328:138,focusX}
  },[trail,origin,follow,showReading])
  const [animatedNodes, setAnimatedNodes] = useState<EditorialNode[]>(graph.nodes)
  const currentNodes = useRef(graph.nodes)
  useEffect(() => {
    const start = performance.now()
    const previous=new Map(currentNodes.current.map(n=>[n.id,n]))
    const parentPosition=previous.get(origin)?.position??graph.nodes[0].position
    const from=new Map(graph.nodes.map(n=>[n.id,previous.get(n.id)?.position??parentPosition]))
    const outgoing=currentNodes.current.filter(n=>!graph.nodes.some(target=>target.id===n.id))
    let frame=0
    const animate=(now:number)=>{
      const t=reduced?1:Math.min(1,(now-start)/620)
      const ease=1-Math.pow(1-t,4)
      const next=graph.nodes.map(n=>{const p=from.get(n.id)!;return {...n,style:{opacity:previous.has(n.id)?1:ease},position:{x:p.x+(n.position.x-p.x)*ease,y:p.y+(n.position.y-p.y)*ease}}})
      const exiting:EditorialNode[]=t<1?outgoing.map(n=>({...n,data:{...n.data,exiting:true},style:{opacity:(1-ease)*Number(n.style?.opacity??1),pointerEvents:'none'},position:{x:n.position.x-80*ease,y:n.position.y}})):[]
      currentNodes.current=[...next,...exiting]
      setAnimatedNodes(currentNodes.current)
      if(t<1)frame=requestAnimationFrame(animate)
    }
    frame=requestAnimationFrame(animate)
    return()=>cancelAnimationFrame(frame)
  },[graph,origin,reduced])
  useEffect(()=>{
    const zoom=Math.min(1.1,(size.width-20)/graph.width,(size.height-32)/graph.height)
    void setViewport({x:(size.width-graph.width*zoom)/2-graph.focusX*zoom,y:(size.height-graph.height*zoom)/2,zoom},{duration:reduced?0:620})
  },[size,graph.width,graph.height,graph.focusX,setViewport,reduced])
  const records=data.relationships.filter(r=>r.source===origin||r.target===origin)
  return <section className={styles.study} aria-label="Institutional links" onKeyDown={e=>{if(e.key==='Escape'&&trail.length>1){e.preventDefault();setTrail(t=>t.slice(0,-1));setReading(false);back.current?.focus()}}}>
    <div className={styles.toolbar}><button ref={back} disabled={trail.length===1} onClick={()=>{setTrail(t=>t.slice(0,-1));setReading(false)}} aria-label={trail.length>1?`Back to ${institution(trail[trail.length-2]).label}`:'At the start'}>← {trail.length>1?institution(trail[trail.length-2]).label:'Institutional links'}</button><button onClick={()=>void fitView({padding:.15,duration:reduced?0:620,minZoom:.1,maxZoom:1.1})} aria-label="Show the whole explored trail">↔</button><button onClick={()=>{setTrail([initialInstitution]);setReading(false)}} aria-label="Reset exploration">↺</button></div>
    <div ref={canvas} className={styles.canvas}>
      <ReactFlow nodes={animatedNodes} edges={graph.edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false} minZoom={.1} maxZoom={1.5} panOnDrag={true} panOnScroll={false} zoomOnScroll={false} zoomOnPinch={true} zoomOnDoubleClick={false} preventScrolling={false} aria-label="Follow an institution to reveal its connections" />
    </div>
    {graph.nodes.length===trail.length&&<p className={styles.end}>This trail ends here. Go back to follow another connection.</p>}
    <details ref={disclosure} className={styles.disclosure} open={reading} onToggle={e=>setReading(e.currentTarget.open)}><summary>Read about {institution(origin).label}</summary>
      <div className={styles.evidence}><h3>{institution(origin).name}</h3><p>{institution(origin).kind}</p>
      {records.map(r=>{
        const counterpart=institution(r.source===origin?r.target:r.source)
        const relation=data['relation-types'].find(t=>t.id===r.type)
        return <a key={r.id} href={`/institutional-links/${r.id}`} className={styles.record}><span><strong>{counterpart.label}</strong><span>{relation?.label}</span></span><span className={styles.recordMeta}>{r.announcedOn??r.observedBy??'Date in evidence'} · {r.currentStatus} ↗</span></a>
      })}
      <p className={styles.note}>Each line joins institutions with a documented interface. The map shows the next connections along your chosen trail; earlier institutions stay on the canvas. Drag or pinch out to revisit them. Use ↔ to see the whole explored trail. Branches do not represent authority or causation. All records for this institution remain available here, including connections back along the trail.</p><a className={styles.method} href="/institutional-links">Evidence & methodology →</a></div>
    </details>
  </section>
}
export function EditorialMapPreview({initialInstitution='anthropic'}:{initialInstitution?:string}){return <ReactFlowProvider><MapStudy initialInstitution={initialInstitution} /></ReactFlowProvider>}
