'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ReactFlow, ReactFlowProvider, Handle, Position, BaseEdge, getBezierPath, useReactFlow, type NodeProps, type EdgeProps, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import bundle from '../../public/data/institutional-map/constellation.json'
import { storyStates, resolveStoryStep } from '../lib/institutional-map-story'
import type { Bundle } from '../lib/institutional-map-types'
import styles from './editorial-map-preview.module.css'

const data = bundle as unknown as Bundle
const institution = (id: string) => data.institutions.find(i => i.id === id)!
const neighbors = (id: string) => Array.from(new Set(data.relationships.filter(r => r.source === id || r.target === id).map(r => r.source === id ? r.target : r.source))).sort((a,b) => institution(a).label.localeCompare(institution(b).label))
type EditorialNode = Node<{ label: string; name: string; active: boolean; exiting?: boolean; follow: () => void }, 'editorial'>
function InstitutionNode({ data: n }: NodeProps<EditorialNode>) {
  const [open,setOpen]=useState(false)
  const [reading,setReading]=useState(false)
  const [position,setPosition]=useState({left:0,top:0})
  const trigger=useRef<HTMLButtonElement>(null)
  const panel=useRef<HTMLDivElement>(null)
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
  const pointer=useRef('mouse')
  const uid=useId()
  const cancel=()=>{if(timer.current)clearTimeout(timer.current)}
  const close=()=>{cancel();setOpen(false)}
  const deferClose=()=>{cancel();timer.current=setTimeout(close,180)}
  const show=()=>{if(n.exiting)return;cancel();setOpen(true)}
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[])
  useEffect(()=>{if(n.exiting)close()},[n.exiting])
  useLayoutEffect(()=>{
    if(!open||!trigger.current||!panel.current)return
    const box=trigger.current.getBoundingClientRect()
    const height=panel.current.offsetHeight
    const width=panel.current.offsetWidth
    setPosition({left:Math.max(12,Math.min(box.left,innerWidth-width-12)),top:box.bottom+height+8<innerHeight?box.bottom+6:Math.max(12,box.top-height-6)})
  },[open,reading])
  useEffect(()=>{if(!open)return;window.addEventListener('resize',close);window.addEventListener('scroll',close);return()=>{window.removeEventListener('resize',close);window.removeEventListener('scroll',close)}},[open])
  const id=data.institutions.find(i=>i.name===n.name)!.id
  const records=data.relationships.filter(r=>r.source===id||r.target===id)
  const follow=()=>{close();n.follow()}
  const blur=(target:EventTarget|null)=>{if(target instanceof globalThis.Node&&(panel.current?.contains(target)||trigger.current?.contains(target)))return;deferClose()}
  return <div className={styles.institution} data-active={n.active} data-peek={open} onPointerEnter={e=>{if(e.pointerType==='mouse')show()}} onPointerLeave={e=>{if(e.pointerType==='mouse')deferClose()}}>
    <Handle type="target" position={Position.Left} className={styles.handle} />
    <button ref={trigger} className={`${styles.nodeButton} nodrag nopan`} disabled={n.exiting} tabIndex={n.exiting?-1:0}
      onPointerDown={e=>{pointer.current=e.pointerType}}
      onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))show()}}
      onBlur={e=>blur(e.relatedTarget)}
      onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();close()}if(e.key==='ArrowDown'){e.preventDefault();show();requestAnimationFrame(()=>panel.current?.querySelector('button')?.focus())}}}
      onClick={e=>{if(n.active||pointer.current==='touch'&&e.detail!==0){show();if(n.active)setReading(true)}else follow()}}
      aria-expanded={open} aria-controls={open?uid:undefined} aria-haspopup="dialog" aria-label={n.active?`Read about ${n.name}`:`Follow ${n.name}`}>
      <span className={styles.mark}/><span>{n.label}</span>
    </button>
    <Handle type="source" position={Position.Right} className={styles.handle} />
    {open&&createPortal(<div ref={panel} id={uid} role="dialog" aria-label={`About ${n.label}`} className={styles.hoverPanel} style={position}
      onPointerEnter={cancel} onPointerLeave={deferClose} onFocusCapture={cancel} onBlur={e=>blur(e.relatedTarget)} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();trigger.current?.focus({preventScroll:true});close()}}}>
      <div className={styles.tabHeading}><button onClick={()=>setReading(v=>!v)} aria-expanded={reading}>Read about {n.label} <span aria-hidden="true">{reading?'−':'+'}</span></button><button aria-label="Close institution details" onClick={()=>{trigger.current?.focus({preventScroll:true});close()}}>×</button></div>
      {reading&&<div className={styles.evidence}><h3>{n.name}</h3><p>{institution(id).kind}</p>{records.map(r=>{
        const counterpart=institution(r.source===id?r.target:r.source)
        return <a key={r.id} className={styles.record} href={`/institutional-links/${r.id}`}><strong>{counterpart.label} ↗</strong><span>{data['relation-types'].find(t=>t.id===r.type)?.label}</span><small>{r.announcedOn??r.observedBy??'Date in evidence'} · {r.currentStatus}</small></a>
      })}<a className={styles.method} href="/institutional-links">Evidence & methodology →</a></div>}
      {!n.active&&<button className={styles.followAction} onClick={follow}>Follow connections →</button>}
    </div>,document.body)}
  </div>
}
function InkEdge(props: EdgeProps) {
  const [path] = getBezierPath(props)
  return <BaseEdge id={props.id} path={path} className={styles.inkEdge} interactionWidth={20} />
}
const nodeTypes = { editorial: InstitutionNode }
const edgeTypes = { ink: InkEdge }
const enableNodePointerEvents = () => {}

function MapStudy({ initialInstitution, story, initialStep }: { initialInstitution: string; story: boolean; initialStep: number }) {
  const [trail, setTrail] = useState([initialInstitution])
  const [step,setStep]=useState(initialStep)
  const [guided,setGuided]=useState(true)
  const [reduced, setReduced] = useState(false)
  const [size,setSize] = useState({width:440,height:460})
  const canvas=useRef<HTMLDivElement>(null)
  const origin = trail[trail.length-1]
  const { setViewport } = useReactFlow()
  useEffect(() => { const q = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(q.matches); update(); q.addEventListener('change', update); return () => q.removeEventListener('change', update) }, [])
  useEffect(()=>{if(!canvas.current)return;const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(canvas.current);return()=>observer.disconnect()},[])
  useEffect(()=>{
    if(!story)return
    const media=matchMedia('(min-width: 700px) and (min-height: 700px)')
    let detach=()=>{}
    const attach=()=>{
      detach();if(!media.matches)return
      const markers=Array.from(document.querySelectorAll<HTMLElement>('[data-institutional-step]'))
      let frame=0
      const update=()=>{frame=0;setStep(resolveStoryStep(markers.map(m=>m.getBoundingClientRect().top),innerWidth<1000?Math.min(innerHeight*.62,innerHeight-180):innerHeight*.4))}
      const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
      const observer=new ResizeObserver(schedule)
      const body=document.querySelector('.essay-body');if(body)observer.observe(body)
      for(const event of ['scroll','resize','hashchange','popstate','pageshow'])window.addEventListener(event,schedule,{passive:true})
      update()
      detach=()=>{observer.disconnect();cancelAnimationFrame(frame);for(const event of ['scroll','resize','hashchange','popstate','pageshow'])window.removeEventListener(event,schedule)}
    }
    attach();media.addEventListener('change',attach)
    return()=>{detach();media.removeEventListener('change',attach)}
  },[story])
  useEffect(()=>{
    if(!story)return
    const relation=data.relationships.find(r=>r.id===storyStates[step].relationshipId)
    setTrail([relation?.source??(step===1?'dod':'anthropic')]);setGuided(true)
  },[step,story])
  const follow=useCallback((id:string)=>{
    setGuided(false)
    setTrail(previous=>previous.includes(id)?previous.slice(0,previous.indexOf(id)+1):[...previous,id])
    requestAnimationFrame(()=>canvas.current?.focus({preventScroll:true}))
  },[])
  const showReading=useCallback(()=>{},[])
  const graph = useMemo(() => {
    // This is an exploration trail, not a hierarchy inferred from the research.
    const allowed=guided?storyStates[step].institutions:null
    const next=neighbors(origin).filter(id=>!trail.includes(id)&&(!allowed||allowed.some(allowedId=>allowedId===id)))
    const middle=Math.max(0,next.length-1)*62/2
    const nodes:EditorialNode[]=trail.map((id,index)=>({id,type:'editorial',position:{x:index*190,y:middle},data:{label:institution(id).label,name:institution(id).name,active:id===origin,follow:id===origin?showReading:()=>follow(id)}}))
    const edges:Edge[]=trail.slice(1).map((id,index)=>({id:`${trail[index]}--${id}`,source:trail[index],target:id,type:'ink'}))
    const focusX=(trail.length-1)*190
    next.forEach((id,index)=>{
      nodes.push({id,type:'editorial',position:{x:focusX+190,y:index*62},data:{label:institution(id).label,name:institution(id).name,active:false,follow:()=>follow(id)}})
      edges.push({id:`${origin}--${id}`,source:origin,target:id,type:'ink'})
    })
    return {nodes,edges,height:Math.max(44,next.length*62),width:next.length?328:138,focusX}
  },[trail,origin,follow,showReading,guided,step])
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
      const next=graph.nodes.map(n=>{const p=from.get(n.id)!;return {...n,style:{opacity:previous.has(n.id)?1:ease,pointerEvents:'all' as const},position:{x:p.x+(n.position.x-p.x)*ease,y:p.y+(n.position.y-p.y)*ease}}})
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
  return <section className={styles.study} aria-label="Institutional links" data-story-state={storyStates[step].id} onKeyDown={e=>{if(e.key==='Escape'&&trail.length>1){e.preventDefault();setGuided(false);setTrail(t=>t.slice(0,-1));canvas.current?.focus({preventScroll:true})}}}>
    <div ref={canvas} className={styles.canvas} tabIndex={-1}>
      <ReactFlow proOptions={{hideAttribution:true}} onNodeClick={enableNodePointerEvents} nodes={animatedNodes} edges={graph.edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false} minZoom={.1} maxZoom={1.5} panOnDrag={true} panOnScroll={false} zoomOnScroll={false} zoomOnPinch={true} zoomOnDoubleClick={false} preventScrolling={false} aria-label="Follow an institution to reveal its connections" />
      <span className={styles.gestureHint}>Drag to explore · Pinch to zoom<br />Zoom out to retrace your path</span>
    </div>

  </section>
}
export function EditorialMapPreview({initialInstitution='anthropic',story=false,initialStep=5}:{initialInstitution?:string;story?:boolean;initialStep?:number}){return <ReactFlowProvider><MapStudy initialInstitution={initialInstitution} story={story} initialStep={initialStep} /></ReactFlowProvider>}
