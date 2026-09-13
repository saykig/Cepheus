'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ReactFlow, ReactFlowProvider, Handle, Position, BaseEdge, getBezierPath, useReactFlow, type NodeProps, type EdgeProps, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import bundle from '../../public/data/institutional-map/constellation.json'
import type { Bundle } from '../lib/institutional-map-types'
import styles from './editorial-map-preview.module.css'

const data = bundle as unknown as Bundle
const institution = (id: string) => data.institutions.find(i => i.id === id)!
const neighbors = (id: string) => Array.from(new Set(data.relationships.filter(r => r.source === id || r.target === id).map(r => r.source === id ? r.target : r.source))).sort((a,b) => institution(a).label.localeCompare(institution(b).label))
type EditorialNode = Node<{ label: string; name: string; expanded: boolean; canExpand: boolean; active: boolean; toggle: () => void; inspect: () => void }, 'editorial'>
function InstitutionNode({ data: n }: NodeProps<EditorialNode>) {
  return <div className={styles.institution} data-active={n.active}>
    <Handle type="target" position={Position.Left} className={styles.handle} />
    <button className={`${styles.nodeButton} nodrag nopan`} onClick={n.inspect} aria-label={`Inspect ${n.name}`}><span className={styles.mark}/><span>{n.label}</span></button>
    {n.canExpand && <button className={`${styles.expand} nodrag nopan`} onClick={n.toggle} aria-label={`${n.expanded ? 'Collapse' : 'Expand'} ${n.label}`} aria-expanded={n.expanded}>{n.expanded ? '−' : '+'}</button>}
    <Handle type="source" position={Position.Right} className={styles.handle} />
  </div>
}
function InkEdge(props: EdgeProps) {
  const [path] = getBezierPath(props)
  return <BaseEdge id={props.id} path={path} className={styles.inkEdge} style={props.style} interactionWidth={20} />
}
const nodeTypes = { editorial: InstitutionNode }
const edgeTypes = { ink: InkEdge }

function MapStudy() {
  const [origin, setOrigin] = useState('anthropic')
  const [expanded, setExpanded] = useState(new Set(['anthropic']))
  const [selected, setSelected] = useState('anthropic')
  const [reduced, setReduced] = useState(false)
  const { fitView } = useReactFlow()
  useEffect(() => { const q = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(q.matches); update(); q.addEventListener('change', update); return () => q.removeEventListener('change', update) }, [])
  const graph = useMemo(() => {
    const seen = new Set<string>([origin])
    const children = new Map<string,string[]>()
    const parent = new Map<string,string>()
    const visit = (id:string) => {
      const next = expanded.has(id) ? neighbors(id).filter(n => !seen.has(n)) : []
      next.forEach(n => { seen.add(n); parent.set(n,id) })
      children.set(id,next); next.forEach(visit)
    }
    visit(origin)
    const nodes: EditorialNode[] = []; const edges: Edge[] = []; let row = 0
    const place = (id: string, depth: number): number => {
      const next = children.get(id) ?? []
      const positions = next.map(n => place(n, depth + 1))
      const y = positions.length ? (positions[0] + positions[positions.length-1])/2 : row++ * 82
      nodes.push({ id, type:'editorial', position:{x:depth*250,y}, data:{ label:institution(id).label,name:institution(id).name,expanded:expanded.has(id),canExpand:next.length>0 || neighbors(id).some(n=>!seen.has(n)),active:id===selected,
        inspect:()=>setSelected(id), toggle:()=>setExpanded(previous=>{const result=new Set(previous); if(result.has(id))result.delete(id);else result.add(id);return result}) } })
      const source=parent.get(id)
      if(source)edges.push({id:`${source}--${id}`,source,target:id,type:'ink',style:{stroke:source===selected||id===selected?'var(--olive-deep)':'var(--rule-strong)',strokeWidth:1.2}})
      return y
    }
    place(origin,0)
    return {nodes,edges}
  },[origin,expanded,selected])
  const [animatedNodes, setAnimatedNodes] = useState<EditorialNode[]>(graph.nodes)
  const positions = useRef(new Map(graph.nodes.map(n => [n.id, n.position])))
  useEffect(() => {
    const start = performance.now()
    const from = new Map(graph.nodes.map(n => {
      const parentId = graph.edges.find(e => e.target === n.id)?.source
      return [n.id, positions.current.get(n.id) ?? positions.current.get(parentId ?? '') ?? n.position]
    }))
    let frame = 0
    const animate = (now: number) => {
      const t = reduced ? 1 : Math.min(1, (now - start) / 650)
      const ease = 1 - Math.pow(1 - t, 4)
      const current = graph.nodes.map(n => { const p = from.get(n.id)!; return {...n, position: {x:p.x+(n.position.x-p.x)*ease,y:p.y+(n.position.y-p.y)*ease}} })
      positions.current = new Map(current.map(n => [n.id,n.position]))
      setAnimatedNodes(current)
      if(t < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [graph, reduced])
  const geometry = graph.nodes.map(n=>`${n.id}:${n.position.x}:${n.position.y}`).join('|')
  useEffect(()=>{const frame=requestAnimationFrame(()=>{void fitView({nodes:graph.nodes,padding:.18,duration:reduced?0:650,minZoom:.65,maxZoom:1.1})});return()=>cancelAnimationFrame(frame)},[geometry,fitView,reduced])
  const records = data.relationships.filter(r=>r.source===selected||r.target===selected)
  const changeOrigin=(id:string)=>{setOrigin(id);setSelected(id);setExpanded(new Set([id]))}
  return <section className={styles.study}>
    <header className={styles.header}><div><p className={styles.kicker}>Cepheus · Local design study</p><h1>Institutional links</h1><p className={styles.intro}>Follow the institutions. Unfold their connections.</p></div><a href="/essays/what-we-owe-to-each-other">Return to the essay ↗</a></header>
    <div className={styles.toolbar}><label>Begin with <select value={origin} onChange={e=>changeOrigin(e.target.value)}>{data.institutions.map(i=><option key={i.id} value={i.id}>{i.label}</option>)}</select></label><div><button onClick={()=>setExpanded(new Set([origin]))}>Reset branches</button><button onClick={()=>void fitView({padding:.18,duration:reduced?0:650,minZoom:.2,maxZoom:1.1})}>Fit map</button></div></div>
    <div className={styles.canvas}>
      <ReactFlow nodes={animatedNodes} edges={graph.edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false} minZoom={.2} maxZoom={1.5} fitView fitViewOptions={{padding:.18,maxZoom:1.1}} panOnScroll={false} zoomOnScroll={false} zoomOnDoubleClick={false} preventScrolling={false} onPaneClick={()=>setSelected(origin)} aria-label="Expandable institutional link map" />
    </div>
    <div className={styles.mapCaption}><span>Use + to unfold a branch. Select a name to read its evidence.</span><span>Drag to explore · pinch to zoom</span></div>
    <section className={styles.evidence} aria-label="Selected institution evidence"><div className={styles.evidenceTitle}><p>In focus</p><h2>{institution(selected).name}</h2><p>{institution(selected).kind}</p>{selected!==origin&&<button onClick={()=>changeOrigin(selected)}>Begin here →</button>}</div><div className={styles.records}>{records.map(r=>{
      const counterpart=institution(r.source===selected?r.target:r.source)
      const relation=data['relation-types'].find(t=>t.id===r.type)
      return <a key={r.id} href={`/institutional-links/${r.id}`} className={styles.record}><span><strong>{counterpart.label}</strong><span>{relation?.label}</span></span><span className={styles.recordMeta}>{r.announcedOn??r.observedBy??'Date in evidence'} · {r.currentStatus}<span aria-hidden="true"> ↗</span></span></a>
    })}</div></section>
    <footer className={styles.note}><p>Connections come from the repository’s existing research release, {data.release.version}. Each line joins institutions with a documented interface; several records may share one line. The evidence list includes all records for the selected institution.</p><p>Branches organise exploration, not authority, chronology or causation. Cross-connections are omitted from this tree view; position and node size measure no quantity. <a href="/institutional-links">Read evidence & methodology →</a></p></footer>
  </section>
}
export function EditorialMapPreview(){return <ReactFlowProvider><MapStudy /></ReactFlowProvider>}
