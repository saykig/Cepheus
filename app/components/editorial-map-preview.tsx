 'use client'

/* THESIS: One stable institutional world revealed as the argument expands.
   OWN-WORLD: Cepheus paper, brown ink, olive, editorial labels and a restrained grid.
   STORY: DoD–Anthropic first; public decisions, interfaces, evaluation, provenance, exploration.
   FIRST VIEWPORT: Wide opposing institutions inside the existing sticky essay frame.
   FORM: Preview-only staged reveal; fixed identities, damped nearby settling, traced SVG ink. */
import { createContext, useContext, type CSSProperties, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ReactFlow, ReactFlowProvider, Handle, Position, useReactFlow, useUpdateNodeInternals, useViewport, type NodeProps, type EdgeProps, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import bundle from '../../public/data/institutional-map/constellation.json'
import { storyStates, resolveStoryStep } from '../lib/institutional-map-story'
import { institutionalScene, worldBounds, routedInstitutionPath, settledFraction, timing, worldProjection, emptyRevealRegistry, advanceReveal } from '../lib/institutional-map-world'
import { institutionViewport } from '../lib/institutional-map-motion'
import type { Bundle } from '../lib/institutional-map-types'
import type { Locale } from '../lib/i18n'
import styles from './editorial-map-preview.module.css'
const data=bundle as unknown as Bundle
const institution=(id:string)=>data.institutions.find(i=>i.id===id)!
const EvidenceSession=createContext<{owner:string|null;setOwner:(id:string|null)=>void}|null>(null)
const labels={
  en:{read:'Read about',close:'Close institution details',follow:'Follow connections',method:'Evidence & methodology',how:'How to read',explore:'Explore institutions'},
  ru:{read:'Об институте',close:'Закрыть',follow:'Исследовать связи',method:'Источники и методология',how:'Как читать',explore:'Исследовать институты'},
  ko:{read:'기관 소개',close:'닫기',follow:'연결 탐색',method:'근거 및 방법론',how:'읽는 방법',explore:'기관 살펴보기'},
  fr:{read:'À propos de',close:'Fermer',follow:'Explorer les liens',method:'Sources et méthodologie',how:'Comment lire',explore:'Explorer les institutions'},
  'zh-CN':{read:'了解',close:'关闭',follow:'探索连接',method:'证据与方法',how:'如何阅读',explore:'探索机构'},
}
type EditorialNode = Node<{ label: string; name: string; locale: Locale; active: boolean; markerSide: 'left' | 'right'; visible: boolean; revealed: boolean; arriving: boolean; follow: (relationshipId: string) => void }, 'editorial'>
function InstitutionNode({ id, data: n }: NodeProps<EditorialNode>) {
  const updateNodeInternals=useUpdateNodeInternals()
  const {zoom}=useViewport()
  useLayoutEffect(()=>{updateNodeInternals(id)},[id,n.markerSide,updateNodeInternals])
  const reduceMotion=useReducedMotion()
  const session=useContext(EvidenceSession)
  const c=labels[n.locale]
  const prefix=n.locale==='en'?'':`/${n.locale}`
  const [open,setOpen]=useState(false)
  const [reading,setReading]=useState(false)
  const [chosen,setChosen]=useState('')
  const [position,setPosition]=useState({left:0,top:0})
  const trigger=useRef<HTMLButtonElement>(null)
  const panel=useRef<HTMLDivElement>(null)
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
    const uid=useId()
  const cancel=()=>{if(timer.current)clearTimeout(timer.current)}
  const close=()=>{cancel();setOpen(false)}
  const deferClose=()=>{cancel();timer.current=setTimeout(()=>{if(!panel.current?.contains(document.activeElement)&&document.activeElement!==trigger.current)close()},180)}
  const show=()=>{if(!n.visible)return;cancel();session?.setOwner(uid);setOpen(true)}
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[])
  useEffect(()=>{if(!n.visible)close()},[n.visible])
  useEffect(()=>{if(session?.owner!==uid)setOpen(false)},[session?.owner,uid])
  useLayoutEffect(()=>{
    if(!open||!trigger.current||!panel.current)return
    const box=trigger.current.getBoundingClientRect()
    const height=panel.current.offsetHeight
    const width=panel.current.offsetWidth
    setPosition({left:Math.max(12,Math.min(box.left,innerWidth-width-12)),top:box.bottom+height+8<innerHeight?box.bottom+6:Math.max(12,box.top-height-6)})
  },[open,reading])
  useEffect(()=>{
    if(!open)return
    const outside=(e:PointerEvent)=>{if(e.target instanceof globalThis.Node&&!panel.current?.contains(e.target)&&!trigger.current?.contains(e.target))close()}
    window.addEventListener('resize',close);window.addEventListener('scroll',deferClose);document.addEventListener('pointerdown',outside)
    return()=>{window.removeEventListener('resize',close);window.removeEventListener('scroll',deferClose);document.removeEventListener('pointerdown',outside)}
  },[open])
  const records=data.relationships.filter(r=>r.source===id||r.target===id)
  const follow=()=>{const relationshipId=chosen||records[0]?.id;if(relationshipId){close();n.follow(relationshipId)}}
  const blur=(target:EventTarget|null)=>{if(target instanceof globalThis.Node&&(panel.current?.contains(target)||trigger.current?.contains(target)))return;deferClose()}
  return <motion.div initial={{opacity:0,y:14}} animate={{opacity:n.visible?(n.active?1:.85):0,y:n.revealed?0:14}} onUpdate={()=>updateNodeInternals(id)} transition={reduceMotion?{duration:0}:{opacity:{duration:n.visible?1.1:.9},y:{duration:timing.settle/1000,ease:(t:number)=>settledFraction(t*timing.settle)}}} aria-hidden={!n.visible} className={styles.institution} style={{'--graph-zoom':zoom} as CSSProperties} data-active={n.active} data-peek={open} data-marker-side={n.markerSide} onPointerEnter={e=>{if(e.pointerType==='mouse')show()}} onPointerLeave={e=>{if(e.pointerType==='mouse')deferClose()}}>
    <span className={styles.port} data-circle-port>
      <motion.span className={styles.mark} animate={{backgroundColor:n.active?'var(--olive)':'var(--paper)'}} transition={reduceMotion?{duration:0}:{duration:.45,delay:n.arriving?1.5:0}}/>
      <Handle type="target" position={Position.Left} className={styles.handle}/>
      <Handle type="source" position={Position.Right} className={styles.handle}/>
    </span>
    <span className={styles.labelSlot} data-institution-label><span className={styles.movingLabel}>{n.label}</span></span>
    <motion.button ref={trigger} className={`${styles.nodeButton} nodrag nopan`} data-institution={id} disabled={!n.visible} tabIndex={!n.visible?-1:0}
      onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))show()}}
      onBlur={e=>blur(e.relatedTarget)}
      onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();show();setReading(true)}if(e.key==='Escape'){e.stopPropagation();close()}if(e.key==='Tab'&&!e.shiftKey&&open){e.preventDefault();panel.current?.querySelector('button')?.focus({preventScroll:true})}if(e.altKey&&e.key==='ArrowDown'){e.stopPropagation();e.preventDefault();show();requestAnimationFrame(()=>panel.current?.querySelector('button')?.focus({preventScroll:true}))}}}
      onClick={()=>{show();setReading(true)}}
      aria-expanded={open} aria-controls={open?uid:undefined} aria-haspopup="dialog" aria-label={`${c.read} ${n.name}`}>
    </motion.button>
    {open&&createPortal(<div ref={panel} id={uid} role="dialog" aria-label={`${n.label} evidence`} className={styles.hoverPanel} style={position}
      onPointerEnter={cancel} onPointerLeave={deferClose} onFocusCapture={cancel} onBlur={e=>blur(e.relatedTarget)} onKeyDown={e=>{
        if(e.key==='Escape'){e.stopPropagation();trigger.current?.focus({preventScroll:true});close()}
        if(e.key==='Tab'){
          const controls=Array.from(panel.current?.querySelectorAll<HTMLElement>('button,a[href],select,summary')??[]).filter(el=>el.getClientRects().length>0)
          if(e.shiftKey&&e.target===controls[0]){e.preventDefault();trigger.current?.focus({preventScroll:true})}
          if(!e.shiftKey&&e.target===controls[controls.length-1]){
            e.preventDefault();close()
            const siblings=Array.from(trigger.current?.closest('[data-constellation-study]')?.querySelectorAll<HTMLButtonElement>('[data-institution]:not(:disabled)')??[])
            const next=siblings[siblings.indexOf(trigger.current!)+1]
            if(next)next.focus({preventScroll:true});else {trigger.current?.focus({preventScroll:true});close()}
          }
        }
      }}>

      <div className={styles.tabHeading}><button onClick={()=>setReading(v=>!v)} aria-expanded={reading}>{c.read} {n.label} <span aria-hidden="true">{reading?'−':'+'}</span></button><button aria-label={c.close} onClick={()=>{trigger.current?.focus({preventScroll:true});close()}}>×</button></div>
      {reading&&<div className={styles.evidence}><h3>{n.name}</h3><p>{institution(id).kind}</p>{records.map(r=>{
        const counterpart=institution(r.source===id?r.target:r.source)
        return <a key={r.id} className={styles.record} href={`${prefix}/institutional-links/${r.id}`}><strong>{counterpart.label} ↗</strong><span>{data['relation-types'].find(t=>t.id===r.type)?.label}</span><small>Directly documented · {r.announcedOn??r.observedBy??'Date in evidence'} · {r.eventStatus}<br />{r.currentStatus} · checked {r.currentStatusCheckedOn??'not established'}</small>
          {data['analytical-relations'].filter(a=>a.relationshipIds.includes(r.id)).map(a=><small key={a.id}><strong>Reviewed analytical assessment</strong><br />{a.shortLabel}</small>)}</a>
      })}
        <details className={styles.methodDetails}><summary>{c.how}</summary><p>Circles are named institutions; connecting lines represent documented interfaces. Grouping is categorical. Faint lines are directly documented interfaces; selected paths can be traced without changing the institutional world. Position, distance and motion measure no quantity. Missing links are not evidence of absence. Evidence cutoff: 12 Sep 2026.</p><p>Source → evidence → instrument → interface → separately reviewed analysis.</p></details>
        <a className={styles.method} href={`${prefix}/institutional-links`}>{c.method} →</a>
        {n.locale!=='en'&&<p>Research records and analytical assessments are in their original English.</p>}
      </div>}
      <label className={styles.choose}>Documented connection<select value={chosen||records[0]?.id||''} onChange={e=>setChosen(e.target.value)}>{records.map(r=><option key={r.id} value={r.id}>{institution(r.source===id?r.target:r.source).label} · {data['relation-types'].find(t=>t.id===r.type)?.label}</option>)}</select></label>
      {<button className={styles.followAction} onClick={follow}>{c.follow} →</button>}
    </div>,document.body)}
  </motion.div>
}

type InkData={visible:boolean;revealed:boolean;highlighted:boolean;incident:boolean;retained:boolean;lane:number;followVersion:number;label:string;reverse:boolean}
function InkEdge(props:EdgeProps<Edge<InkData>>) {
 const reduced=useReducedMotion()
 const e=props.data!
 const path=routedInstitutionPath(props.sourceX,props.sourceY,props.targetX,props.targetY,e.lane)
 const visible=e.visible
 const [drawn,setDrawn]=useState(false)
 const trace=e.reverse?routedInstitutionPath(props.sourceX,props.sourceY,props.targetX,props.targetY,e.lane,true):path
 return <g aria-hidden="true" data-world-edge={props.id} data-source-institution={props.source} data-target-institution={props.target} data-revealed={visible}>
  <motion.path data-base-edge={props.id} d={path} fill="none" className={styles.worldInk} initial={false}
   animate={{pathLength:1,opacity:visible&&(drawn||reduced)?(e.incident||e.retained ? .45 : .18):0}}
   transition={reduced?{duration:0}:{opacity:{duration:.6}}}/>
  <motion.path d={path} fill="none" className={styles.worldTrace} initial={false}
   animate={{pathLength:1,opacity:visible&&e.highlighted&&(drawn||reduced)?1:0}}
   transition={reduced?{duration:0}:{opacity:{duration:.6}}}
   data-traced-interface={visible&&e.highlighted?props.id:undefined}/>
  <motion.path d={path} fill="none" className={styles.worldTrace} data-first-reveal={visible&&!drawn?props.id:undefined}
   initial={false} animate={{pathLength:e.revealed?1:0,opacity:visible&&!drawn?1:0}}
   transition={reduced?{duration:0}:{pathLength:{duration:1.05,delay:drawn?0:.55,ease:'easeInOut'},opacity:{duration:.6}}}
   onAnimationComplete={()=>{if(e.revealed&&!drawn)setDrawn(true)}}/>
  {e.followVersion>0&&visible&&<motion.path key={e.followVersion} d={trace} fill="none" className={styles.worldTrace}
   initial={{pathLength:reduced?1:0,opacity:1}} animate={{pathLength:1,opacity:0}}
   transition={reduced?{duration:0}:{pathLength:{duration:1.05,delay:.55,ease:'easeInOut'},opacity:{duration:.4,delay:1.6}}}/>}
 </g>
}
const nodeTypes={editorial:InstitutionNode}
const edgeTypes={ink:InkEdge}
function MapStudy({story,initialStep,locale}:{story:boolean;initialStep:number;locale:Locale}) {
 const reduced=useReducedMotion()
 const [step,setStep]=useState(initialStep)
 const [followed,setFollowed]=useState<string[]>([])
 const [focus,setFocus]=useState<string|null>(null)
 const [selected,setSelected]=useState<string|null>(null)
 const [traceVersion,setTraceVersion]=useState(0)
 const [owner,setOwner]=useState<string|null>(null)
 const [activated,setActivated]=useState(false)
 const [size,setSize]=useState({width:0,height:0})
 const projection=useMemo(()=>worldProjection(size),[size])
 const [cameraReady,setCameraReady]=useState(false)
 const fittedFrame=useRef('')
 const canvas=useRef<HTMLDivElement>(null)
 const {setViewport,viewportInitialized,zoomIn,zoomOut}=useReactFlow()
 const scene=useMemo(()=>institutionalScene(data,step,followed,focus,selected),[step,followed,focus,selected])
 const [reveal,setReveal]=useState(()=>emptyRevealRegistry(initialStep))
 useEffect(()=>{if(activated&&cameraReady)setReveal(previous=>advanceReveal(previous,scene,step))},[activated,cameraReady,scene,step])
 const [hover,setHover]=useState<string|null>(null)
 useEffect(()=>{
  if(!canvas.current)return
  const io=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setActivated(true);io.disconnect()}},{threshold:.05})
  io.observe(canvas.current)
  let resizeFrame=0
  const ro=new ResizeObserver(([entry])=>{
   const next={width:entry.contentRect.width,height:entry.contentRect.height}
   cancelAnimationFrame(resizeFrame)
   resizeFrame=requestAnimationFrame(()=>setSize(old=>old.width===next.width&&old.height===next.height?old:next))
  })
  ro.observe(canvas.current)
  return()=>{io.disconnect();ro.disconnect();cancelAnimationFrame(resizeFrame)}
 },[])
 useEffect(()=>{
  if(!story)return
  const media=matchMedia('(min-width:700px) and (min-height:700px)')
  let cleanup=()=>{}
  const attach=()=>{
   cleanup();if(!media.matches)return
   const markers=Array.from(document.querySelectorAll<HTMLElement>('[data-institutional-step]'))
   let frame=0
   const update=()=>{frame=0;const next=resolveStoryStep(markers.map(m=>m.getBoundingClientRect().top),innerWidth<1000?innerHeight*.62:innerHeight*.4);setStep(previous=>previous===next?previous:next)}
   const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
   const observer=new IntersectionObserver(schedule,{rootMargin:'-40% 0px -59% 0px'})
   markers.forEach(m=>observer.observe(m))
   const resize=new ResizeObserver(schedule);const body=document.querySelector('.essay-body');if(body)resize.observe(body)
   for(const event of ['scroll','resize','hashchange','popstate','pageshow'])window.addEventListener(event,schedule,{passive:true})
   update();cleanup=()=>{observer.disconnect();resize.disconnect();cancelAnimationFrame(frame);for(const event of ['scroll','resize','hashchange','popstate','pageshow'])window.removeEventListener(event,schedule)}
  }
  attach();media.addEventListener('change',attach);return()=>{cleanup();media.removeEventListener('change',attach)}
 },[story])
 useEffect(()=>{setSelected(null);setFocus(null)},[step])
 const follow=useCallback((institutionId:string,relationshipId:string)=>{
  setFocus(institutionId);setSelected(relationshipId);setFollowed(ids=>ids.includes(relationshipId)?ids:[...ids,relationshipId]);setTraceVersion(n=>n+1)
  canvas.current?.focus({preventScroll:true})
 },[])
 // Screen-space padding also protects labels that remain readable at low zoom.
 const fit=useCallback(async()=>{
  const viewport=institutionViewport(size,projection.bounds,{horizontal:64,vertical:32})
  if(!viewport)return
  await setViewport(viewport,{duration:0})
  setCameraReady(true)
 },[size,projection,setViewport])
 // Initialize the complete world once per actual frame size, never per story/focus.
 // Keep the default React Flow 1x viewport hidden until this fit has completed.
 useEffect(()=>{
  if(!viewportInitialized||size.width<=20||size.height<=32)return
  const frame=`${Math.round(size.width)}:${Math.round(size.height)}:${projection.bounds.height}`
  if(fittedFrame.current===frame)return
  fittedFrame.current=frame
  void fit()
 },[fit,viewportInitialized,size.width,size.height,projection.bounds.height])
 const nodes=useMemo<EditorialNode[]>(()=>scene.nodes.map(n=>({id:n.id,type:'editorial',width:138,height:44,position:{x:n.position.x,y:n.position.y*projection.yScale},
  data:{label:institution(n.id).label,name:institution(n.id).name,locale,active:n.foreground,visible:reveal.nodes.has(n.id),revealed:reveal.seenNodes.has(n.id),arriving:!!selected&&n.id!==focus&&n.foreground,markerSide:n.side,follow:(id:string)=>follow(n.id,id)},style:{pointerEvents:reveal.nodes.has(n.id)?'all':'none'},
 })),[scene.nodes,locale,reveal,follow,projection])
 const edges=useMemo<Edge<InkData>[]>(()=>scene.edges.map(e=>({id:e.id,source:e.source,target:e.target,type:'ink',data:{...e,visible:reveal.edges.has(e.id),revealed:reveal.seenEdges.has(e.id),incident:e.incident||!!hover&&(e.source===hover||e.target===hover),followVersion:selected===e.id?traceVersion:0,reverse:!!focus&&e.target===focus,label:data['relation-types'].find(t=>t.id===data.relationships.find(r=>r.id===e.id)?.type)?.label??''}})),[scene.edges,reveal,selected,traceVersion,hover,focus])
 const prefix=locale==='en'?'':`/${locale}`
 return <EvidenceSession.Provider value={useMemo(()=>({owner,setOwner}),[owner])}>
 <section className={styles.study} data-constellation-study data-story={story} data-story-state={storyStates[step].id} aria-label={`Institutional constellation study — ${story ? 'essay companion' : storyStates[initialStep].title}`}>
  <div ref={canvas} className={styles.canvas} tabIndex={0} role="group" aria-label="Institutional field. Drag to pan, pinch to zoom. Plus and minus zoom; zero fits the world."
   onKeyDown={e=>{
    if(e.target===canvas.current){if(e.key==='Escape'){setSelected(null);setFocus(null);setFollowed([]);setHover(null)}if(['+','=','-','0'].includes(e.key)){e.preventDefault();if(e.key==='0'){fit();setSelected(null);setFocus(null);setFollowed([]);setHover(null)}else if(e.key==='-')void zoomOut({duration:reduced?0:200});else void zoomIn({duration:reduced?0:200})}}
    if(e.target instanceof HTMLElement&&e.target.hasAttribute('data-institution')&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&!e.altKey){e.preventDefault();const buttons=Array.from(canvas.current?.querySelectorAll<HTMLButtonElement>('[data-institution]:not(:disabled)')??[]);const index=buttons.indexOf(e.target as HTMLButtonElement);buttons[(index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+buttons.length)%buttons.length]?.focus({preventScroll:true})}
   }}>
   <ReactFlow proOptions={{hideAttribution:true}} nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
    autoPanOnNodeFocus={false} nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false}
    minZoom={.1} maxZoom={2} panOnDrag panOnScroll={false} zoomOnScroll={false} zoomOnPinch zoomOnDoubleClick={false} preventScrolling={false}
    onNodeMouseEnter={(_,n)=>setHover(n.id)} onNodeMouseLeave={()=>setHover(null)} onNodeClick={()=>{}}/>
  </div>
  <div className={styles.captionRow}>
  <details className={styles.legend}><summary>How to read</summary><p>Groups are presentation categories. Position, distance, circle size and motion measure no power or dependence. Faint lines are directly documented interfaces; analytical assessments are labeled separately.</p><a href={`${prefix}/institutional-links`}>Evidence & methodology →</a></details>
  <span className={styles.gestureHint}>Drag to explore · Pinch to zoom</span>
  </div>
  <noscript><p><a href={`${prefix}/institutional-links`}>Read the institutional evidence index.</a></p></noscript>
 </section></EvidenceSession.Provider>
}
export function EditorialMapPreview({story=false,initialStep=5,locale='en'}:{initialInstitution?:string;story?:boolean;initialStep?:number;locale?:Locale}) {
 return <ReactFlowProvider><MapStudy story={story} initialStep={initialStep} locale={locale}/></ReactFlowProvider>
}
