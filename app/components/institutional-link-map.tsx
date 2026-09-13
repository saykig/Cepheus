'use client'

/* THESIS: An essay-side institutional constellation, inspected one interface at a time.
   OWN-WORLD: Cepheus paper, brown ink, olive selection, existing editorial type.
   STORY: Read the institutions assembling; distinguish documented facts from analysis; audit either.
   FIRST VIEWPORT: Prose at left, quiet equal marks at right; opening focuses DoD and Anthropic.
   FORM: User-specified clustered bubbles, deterministic build layout, explicit six-state story. */
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import bundle from '../../public/data/institutional-map/bundle.json'
import type { Bundle } from '../lib/institutional-map-types'
import { storyStates, resolveStoryStep, storyRelationship } from '../lib/institutional-map-story'
import type { Locale } from '../lib/i18n'
import styles from './institutional-link-map.module.css'

const data=bundle as unknown as Bundle
const publishedIds=new Set(data.relationships.map(r=>r.id))
const copy={
 en:{explore:'Explore institutions',close:'Close',evidence:'View evidence →',how:'How to read',method:'Evidence & methodology →'},
 ru:{explore:'Исследовать институты',close:'Закрыть',evidence:'Источники →',how:'Как читать',method:'Источники и методология →'},
 ko:{explore:'기관 살펴보기',close:'닫기',evidence:'근거 보기 →',how:'읽는 방법',method:'근거 및 방법론 →'},
 fr:{explore:'Explorer les institutions',close:'Fermer',evidence:'Voir les sources →',how:'Comment lire',method:'Sources et méthodologie →'},
 'zh-CN':{explore:'探索机构',close:'关闭',evidence:'查看证据 →',how:'如何阅读',method:'证据与方法 →'},
}
const SelectionContext=createContext<ReturnType<typeof useSelection>|null>(null)
function useSelection(){const [selected,setSelected]=useState<string|null>(null);const [chosen,setChosen]=useState<string|null>(null);const [owner,setOwner]=useState<string|null>(null);return {selected,setSelected,chosen,setChosen,owner,setOwner}}
export function ConstellationSession({children}:{children:ReactNode}){const value=useSelection();return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>}
export function InstitutionalLinkMap({locale='en',story=false,initialStep=5}:{locale?:Locale;story?:boolean;initialStep?:number}) {
 const [plotSize,setPlotSize]=useState({width:600,height:600})
 const uid=useId();const root=useRef<HTMLElement>(null);const trigger=useRef<HTMLButtonElement|null>(null)
 const [step,setStep]=useState(initialStep);const [hover,setHover]=useState<string|null>(null)
 const localSelection=useSelection();const {selected:sharedSelected,setSelected,chosen,setChosen,owner,setOwner}=useContext(SelectionContext)??localSelection
 const selected=owner===uid?sharedSelected:null
 const c=copy[locale];const state=storyStates[step]
 useEffect(()=>{
  if(!story)return
  const media=matchMedia('(min-width: 700px) and (min-height: 700px)')
  let cleanup=()=>{}
  const attach=()=>{
   cleanup();if(!media.matches){setStep(5);return}
   const markers=Array.from(document.querySelectorAll<HTMLElement>('[data-institutional-step]'))
   let frame=0
   const update=()=>{frame=0;setStep(resolveStoryStep(markers.map(m=>m.getBoundingClientRect().top),(innerWidth<1000?Math.min(innerHeight*.62,innerHeight-180):innerHeight*.4)))}
   const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
   const observer=new IntersectionObserver(schedule,{rootMargin:'-40% 0px -59% 0px'})
   markers.forEach(m=>observer.observe(m))
   const resize=new ResizeObserver(schedule);const body=document.querySelector('.essay-body');if(body)resize.observe(body)
   for(const event of ['scroll','resize','hashchange','popstate','pageshow'])window.addEventListener(event,schedule,{passive:true})
   update()
   cleanup=()=>{observer.disconnect();resize.disconnect();cancelAnimationFrame(frame);for(const event of ['scroll','resize','hashchange','popstate','pageshow'])window.removeEventListener(event,schedule)}
  }
  attach();media.addEventListener('change',attach);return()=>{cleanup();media.removeEventListener('change',attach)}
 },[story])
 useEffect(()=>{const plot=root.current?.querySelector('[data-plot]');if(!plot)return;const observer=new ResizeObserver(([entry])=>{if(entry.contentRect.width)setPlotSize({width:entry.contentRect.width,height:entry.contentRect.height})});observer.observe(plot);return()=>observer.disconnect()},[])
 const focusId=selected??hover
 const incident=data.relationships.filter(r=>r.source===focusId||r.target===focusId)
 const narrative=storyRelationship(step,publishedIds)
 const relationship=data.relationships.find(r=>r.id===(selected?(chosen??incident[0]?.id):hover?incident[0]?.id:narrative))
 const institution=data.institutions.find(i=>i.id===selected)
 const mechanism=data['relation-types'].find(t=>t.id===relationship?.type)
 const assessments=relationship?data['analytical-relations'].filter(a=>a.relationshipIds.includes(relationship.id)):[]
 const visible=new Set<string>(state.institutions??data.institutions.map(i=>i.id))
 if(focusId&&relationship){visible.clear()}
 if(focusId)visible.add(focusId)
 if(relationship){visible.add(relationship.source);visible.add(relationship.target)}
 const point=(id:string)=>data.layout!.nodes[id]
 const middle=relationship?{x:(point(relationship.source).x+point(relationship.target).x)/2,y:(point(relationship.source).y+point(relationship.target).y)/2}:null
 const candidates=middle?[middle,...[.25,.4,.55,.7].flatMap(y=>[.3,.5,.7].map(x=>({x:x*600,y:y*600})))]:[]
 const clear=(p:{x:number;y:number})=>Array.from(visible).every(id=>{const n=point(id);return !n||Math.abs(n.x-p.x)*plotSize.width/600>110||Math.abs(n.y-p.y)*plotSize.height/600>64})
 const token=candidates.filter(clear).sort((a,b)=>Math.hypot(a.x-middle!.x,a.y-middle!.y)-Math.hypot(b.x-middle!.x,b.y-middle!.y))[0]??middle
 const close=()=>{setSelected(null);setChosen(null);setHover(null);trigger.current?.focus()}
 const prefix=locale==='en'?'':`/${locale}`
 return <figure ref={root} className={styles.figure} data-constellation data-story={story} data-selected={!!selected} data-story-state={state.id} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close()}
    if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)&&document.activeElement?.hasAttribute('data-institution')){e.preventDefault();const ids=state.institutions??data.institutions.map(i=>i.id);const index=ids.indexOf(document.activeElement.getAttribute('data-institution')! as never);const next=ids[(index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+ids.length)%ids.length];setSelected(null);setHover(next);requestAnimationFrame(()=>root.current?.querySelector<HTMLButtonElement>(`[data-institution="${next}"]`)?.focus())}}}>
   <div className={styles.heading}><span>{state.title}</span><span className={styles.version}>{data.release.version}</span></div>
   <div className={styles.plot} data-plot role="group" aria-label={c.explore}>
    <svg className={styles.lines} viewBox="0 0 600 600" preserveAspectRatio="none" aria-hidden="true">
     {relationship&&point(relationship.source)&&point(relationship.target)?<path data-relationship-path d={`M ${point(relationship.source).x} ${point(relationship.source).y} L ${token?.x} ${token?.y} L ${point(relationship.target).x} ${point(relationship.target).y}`} />:null}
    </svg>
    <span className={`${styles.group} ${styles.publicGroup}`}>Public decisions</span>
    <span className={`${styles.group} ${styles.developerGroup}`}>Model developers</span>
    <span className={`${styles.group} ${styles.evaluationGroup}`}>Evaluation / research</span>
    {data.institutions.map(i=>{
     const p=point(i.id);if(!p)return null
     const active=visible.has(i.id);const incidentHighlight=relationship&&(i.id===relationship.source||i.id===relationship.target)
     return <button key={i.id} type="button" className={styles.node} data-institution={i.id} data-emphasis={incidentHighlight||focusId===i.id?'true':'false'} data-visible={active?'true':'false'} style={{left:`${p.x/6}%`,top:`${p.y/6}%`}} tabIndex={active?0:-1} aria-hidden={!active} aria-label={`${i.name}. ${i.kind}`} aria-expanded={selected===i.id} aria-controls={`${uid}-card`} onPointerEnter={e=>{if(e.pointerType==='mouse')setHover(i.id)}} onPointerLeave={e=>{if(document.activeElement!==e.currentTarget)setHover(null)}} onFocus={()=>setHover(i.id)} onBlur={()=>setHover(null)} onClick={e=>{trigger.current=e.currentTarget;setOwner(uid);setSelected(i.id);setChosen(null)}}>
       <span className={styles.mark}/><span className={styles.nodeLabel}>{i.label}</span>
     </button>
    })}
    {relationship?<div className={styles.mechanism} data-mechanism style={token?{left:`${token.x/6}%`,top:`${token.y/6}%`}:undefined}><span>{mechanism?.label}</span><small>Directly documented</small></div>:null}
   </div>
   <div className={styles.readout}>
    {step===4&&relationship?<a className={styles.lineage} href={`${prefix}/institutional-links/${relationship.id}`}>Source → evidence → instrument → interface{assessments.length?' → analysis':''}</a>:assessments[0]?<span className={styles.analysis}><span>Reviewed analysis</span>{assessments.find(a=>a.type==='transitional-operational-dependence')?.shortLabel??assessments[0].shortLabel}</span>:<span className={styles.hint}>Select an institution to follow one interface.</span>}
   </div>
   {institution?<section id={`${uid}-card`} className={styles.card} aria-label={`${institution.label} evidence`}>
    <div className={styles.cardHeading}><h3>{institution.name}</h3><button type="button" onClick={close}>{c.close}</button></div>
    <p>{institution.kind}</p>
    <label className={styles.selectLabel}>Documented interface<select value={relationship?.id??''} onChange={e=>setChosen(e.target.value)}>{incident.map(r=><option key={r.id} value={r.id}>{data['relation-types'].find(t=>t.id===r.type)?.label} · {data.institutions.find(i=>i.id===(r.source===selected?r.target:r.source))?.label}</option>)}</select></label>
    {relationship?<><p className={styles.status}>Directly documented · {relationship.eventStatus}<br/>{relationship.currentStatus} · checked {relationship.currentStatusCheckedOn}</p>{assessments.map(a=><p className={styles.assessment} key={a.id}><strong>Reviewed analytical assessment</strong>{a.shortLabel}</p>)}<a href={`${prefix}/institutional-links/${relationship.id}`}>{c.evidence}</a></>:<p>No published interface in this release.</p>}
   </section>:null}
   <figcaption className={styles.caption}><span>Named institutions · documented interfaces · reviewed analysis</span><details><summary>{c.how}</summary><p>Circles are named institutions. Mechanism labels are documented interfaces; analytical findings are marked separately. Clusters are categorical: position and distance measure no quantity. Missing links are not evidence of absence. Evidence cutoff: 12 Sep 2026.</p><a href={`${prefix}/institutional-links`}>{c.method}</a></details></figcaption>
   {locale!=='en'?<p className={styles.languageNote}>Research records and analytical assessments are in their original English.</p>:null}
   <noscript><p>Interactive selection requires JavaScript. <a href={`${prefix}/institutional-links`}>Read the complete evidence index.</a></p></noscript>
 </figure>
}
