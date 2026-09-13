'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { createInstitutionMotion, institutionViewport, institutionPresence } from '../lib/institutional-map-motion'
import { ReactFlow, ReactFlowProvider, Handle, Position, BaseEdge, getBezierPath, useReactFlow, type NodeProps, type EdgeProps, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import bundle from '../../public/data/institutional-map/constellation.json'
import { storyStates, resolveStoryStep } from '../lib/institutional-map-story'
import type { Bundle } from '../lib/institutional-map-types'
import styles from './editorial-map-preview.module.css'

const data = bundle as unknown as Bundle
const institution = (id: string) => data.institutions.find(i => i.id === id)!
const neighbors = (id: string) => Array.from(new Set(data.relationships.filter(r => r.source === id || r.target === id).map(r => r.source === id ? r.target : r.source))).sort((a,b) => institution(a).label.localeCompare(institution(b).label))
type EditorialNode = Node<{ label: string; name: string; active: boolean; direction?: number; exiting?: boolean; follow: () => void }, 'editorial'>
function InstitutionNode({ data: n }: NodeProps<EditorialNode>) {
  const reduceMotion=useReducedMotion()
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
      <motion.span className={styles.mark} animate={{scale:n.exiting ? .65 : 1,opacity:n.exiting?0:1}} transition={{duration:reduceMotion?0:.22}}/>
      <span className={styles.labelSlot}><AnimatePresence initial={false} mode="popLayout">{!n.exiting&&<motion.span key={n.label} className={styles.movingLabel} initial={{opacity:0,y:(n.direction??1)*9}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-(n.direction??1)*8}} transition={reduceMotion?{duration:0}:{type:'spring',stiffness:210,damping:25}}>{n.label}</motion.span>}</AnimatePresence></span>
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
  const direction=useRef(1)
  const previousStep=useRef(initialStep)
  const [reduced, setReduced] = useState(false)
  const [onScreen,setOnScreen]=useState(false)
  const [size,setSize] = useState({width:440,height:460})
  const canvas=useRef<HTMLDivElement>(null)
  const origin = trail[trail.length-1]
  const { setViewport, viewportInitialized } = useReactFlow()
  useEffect(() => { const q = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(q.matches); update(); q.addEventListener('change', update); return () => q.removeEventListener('change', update) }, [])
  useEffect(()=>{
    if(!canvas.current)return
    const observer=new IntersectionObserver(([entry])=>{
      setOnScreen(entry.isIntersecting&&entry.intersectionRatio>=.12)
    },{threshold:[0,.12]})
    observer.observe(canvas.current)
    return()=>observer.disconnect()
  },[])
  useEffect(()=>{if(!canvas.current)return;const observer=new ResizeObserver(([entry])=>setSize({width:entry.contentRect.width,height:entry.contentRect.height}));observer.observe(canvas.current);return()=>observer.disconnect()},[])
  useEffect(()=>{
    if(!story)return
    const media=matchMedia('(min-width: 700px) and (min-height: 480px)')
    let detach=()=>{}
    const attach=()=>{
      detach();if(!media.matches)return
      const markers=Array.from(document.querySelectorAll<HTMLElement>('[data-institutional-step]'))
      let frame=0
      const update=()=>{frame=0;setStep(resolveStoryStep(markers.map(m=>m.getBoundingClientRect().top),innerHeight*.4))}
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
    direction.current=step>=previousStep.current?1:-1
    previousStep.current=step
    const relation=data.relationships.find(r=>r.id===storyStates[step].relationshipId)
    setTrail([relation?.source??(step===1?'dod':'anthropic')]);setGuided(true)
  },[step,story])
  const follow=useCallback((id:string)=>{
    direction.current=trail.includes(id)?-1:1
    setGuided(false)
    setTrail(previous=>previous.includes(id)?previous.slice(0,previous.indexOf(id)+1):[...previous,id])
    requestAnimationFrame(()=>canvas.current?.focus({preventScroll:true}))
  },[trail])
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
  const currentNodes = useRef<EditorialNode[]>(graph.nodes)
  useEffect(() => {
    const prior=new Map(currentNodes.current.map(n=>[n.id,n]))
    const outgoing=currentNodes.current.filter(n=>!graph.nodes.some(target=>target.id===n.id))
    const travel=direction.current
    if(reduced||!onScreen){
      currentNodes.current=graph.nodes
      setAnimatedNodes(graph.nodes)
      return
    }
    const {nodes:particles,simulation}=createInstitutionMotion(graph.nodes,graph.edges,
      new Map(currentNodes.current.map(n=>[n.id,n.position])),travel,graph.height)
    const started=performance.now()
    let frame=0;let ticks=0
    const draw=(now:number)=>{
      const progress=institutionPresence(now-started)
      const wanted=Math.min(100,Math.floor((now-started)/(1000/40)))
      if(wanted>ticks){simulation.tick(wanted-ticks);ticks=wanted}
      const current:EditorialNode[]=graph.nodes.map((n,index)=>({...n,
        data:{...n.data,direction:travel},
        style:{opacity:prior.has(n.id)?1:.35+.65*progress,pointerEvents:'all'},
        position:{x:particles[index].x,y:particles[index].y}}))
      const exiting:EditorialNode[]=progress<.995?outgoing.map(n=>({...n,
        data:{...n.data,exiting:true,direction:travel},
        style:{opacity:(1-progress)*Number(n.style?.opacity??1),pointerEvents:'none'},
        position:{x:n.position.x+Math.sin(progress*Math.PI)*24,y:n.position.y-travel*220*progress}})):[]
      currentNodes.current=[...current,...exiting]
      setAnimatedNodes(currentNodes.current)
      if((ticks<100&&simulation.alpha()>.003)||progress<.995)frame=requestAnimationFrame(draw)
    }
    frame=requestAnimationFrame(draw)
    return()=>{cancelAnimationFrame(frame);simulation.stop()}
  },[graph,reduced,onScreen])
  useEffect(()=>{
    if(!viewportInitialized)return
    const viewport=institutionViewport(size,graph)
    if(!viewport)return
    void setViewport(viewport,{duration:reduced?0:620})
  },[size,graph.width,graph.height,graph.focusX,setViewport,viewportInitialized,reduced])
  return <section className={styles.study} aria-label="Institutional links" data-story-state={storyStates[step].id} data-motion={reduced?'reduced':onScreen?'visible':'waiting'} onKeyDown={e=>{if(e.key==='Escape'&&trail.length>1){e.preventDefault();setGuided(false);setTrail(t=>t.slice(0,-1));canvas.current?.focus({preventScroll:true})}}}>
    <div ref={canvas} className={styles.canvas} tabIndex={-1}>
      <ReactFlow proOptions={{hideAttribution:true}} onNodeClick={enableNodePointerEvents} nodes={animatedNodes} edges={graph.edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false} minZoom={.1} maxZoom={1.5} panOnDrag={true} panOnScroll={false} zoomOnScroll={false} zoomOnPinch={true} zoomOnDoubleClick={false} preventScrolling={false} aria-label="Follow an institution to reveal its connections" />
      <span className={styles.gestureHint}>Drag to explore · Pinch to zoom<br />Zoom out to retrace your path</span>
    </div>

  </section>
}
export function EditorialMapPreview({initialInstitution='anthropic',story=false,initialStep=5}:{initialInstitution?:string;story?:boolean;initialStep?:number}){return <ReactFlowProvider><MapStudy initialInstitution={initialInstitution} story={story} initialStep={initialStep} /></ReactFlowProvider>}
