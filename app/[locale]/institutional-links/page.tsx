import bundle from '../../../public/data/institutional-map/bundle.json'
import type { Bundle } from '../../lib/institutional-map-types'
import styles from '../../components/institutional-evidence.module.css'
const data=bundle as unknown as Bundle
export const metadata={title:'Institutional links — evidence and methodology',description:'A bounded, inspectable institutional research object. Documented interfaces, qualitative coding and separately reviewed analysis.'}
export default async function EvidenceIndex({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;const prefix=locale==='en'?'':`/${locale}`
 return <article className={styles.page}>
 <a href={`${prefix}/essays/what-we-owe-to-each-other#cepheus-map`}>← Return to the essay</a>
 <h1>Institutional links</h1><p className={styles.meta}>{data.release.version} · Evidence through 12 September 2026 · Editorial release sign-off pending</p>
 <p>How do technical control, public authority, evaluation capacity, information access and operational reliance meet? This research separates directly documented interfaces, coded institutional attributes, and reviewed analytical assessments.</p>
 <h2>Scope and interpretation</h2><p>United States, United Kingdom and European Union, 1 January 2024–12 September 2026. Five developers form a systematic search floor across six research families. Named institutions may be admitted when a relevant source establishes their participation. This is a bounded account, not a complete global network. A missing relationship is not evidence that none exists.</p>
 <p>Observation is not analysis. Analysis is permitted. Analysis must be traceable. Ordinal attributes are context-specific judgments under disclosed rubrics; they are not scores. Positions, distances, circle sizes and relationship counts measure neither authority nor dependence.</p>
 <h2>Published analytical assessments</h2>{data['analytical-relations'].map(a=><section className={styles.record} key={a.id}><p className={styles.badge}>Reviewed analytical assessment</p><h3>{data['analytical-rubrics'].find(r=>r.id===a.type)?.label}</h3><p>{a.assessment}</p><a href={`${prefix}/institutional-links/${a.relationshipIds[0]}#analysis`}>Inspect derivation →</a></section>)}
 <h2>Coded institutional attributes</h2>{data['institution-attributes'].map(a=><section className={styles.record} key={a.id}><h3>{data.institutions.find(i=>i.id===a.institutionId)?.label} · {data['attribute-rubrics'].find(r=>r.id===a.rubricId)?.label}</h3><p>{a.value} · {a.assessedOn}</p><p>{a.reasoning}</p><p>{a.limitations}</p><a href="/data/institutional-map/bundle.json">Inspect evidence and rubric in the publication bundle →</a></section>)}
 <h2>Documented interfaces</h2>{data.relationships.map(r=><div className={styles.record} key={r.id}><a href={`${prefix}/institutional-links/${r.id}`}>{data.institutions.find(i=>i.id===r.source)?.label} {r.directed?'→':'↔'} {data.institutions.find(i=>i.id===r.target)?.label} · {data['relation-types'].find(t=>t.id===r.type)?.label}</a><p className={styles.meta}>{r.eventStatus} · {r.currentStatus}</p></div>)}
 <h2>Institutions</h2><dl>{data.institutions.map(i=><div key={i.id}><dt>{i.label}</dt><dd>{i.name}. {i.kind}. {i.note}</dd></div>)}</dl>
 <h2>Coverage</h2><p>“Searched—unsupported” means an inspected search did not establish an admissible interface. “Blocked” means research could not be completed. Neither establishes absence.</p>
 <div className={styles.tableWrap}><table><caption>Developer × research family search floor</caption><thead><tr><th>Developer</th><th>Family</th><th>Result</th></tr></thead><tbody>{data.coverage?.cells?.map((c:any)=><tr key={c.id}><td>{c.developer}</td><td>{c.family}</td><td>{c.result}<br/>{c.limitations}</td></tr>)}</tbody></table></div>
 <h2>Review and release</h2><p>Substantive checking is performed by a separately identified agent. This is not external expert review. Approval hashes bind the research inputs; material changes invalidate approval. The owner’s editorial sign-off is required for final v1.0.</p>
 <p><a href={`https://github.com/saykig/Cepheus/blob/${data.release.methodologyCommit}/research/institutional-map/METHODOLOGY.md`}>Release-pinned methodology →</a></p><p><a href="/data/institutional-map/bundle.json">Download the publication bundle</a></p>
 <p className={styles.hash}>Research fingerprint: {data.release.researchHash??'Publication review pending'}</p>
 </article>
}
