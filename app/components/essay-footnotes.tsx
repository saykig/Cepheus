'use client'
import type { MouseEvent, ReactNode } from 'react'
import sourcesData from '../../public/data/sources.json'
import { scrollToEssayTarget } from './essay-scroll'
import styles from './essay-footnotes.module.css'
type FootnoteSegment = {type:'text'|'source';text:string;sourceId?:number;italic?:boolean}|{type:'link';text:string;href:string}|{type:'list';items:string[]}
const footnotes=sourcesData.footnotes
export function EssayFootnoteProvider({children}:{children:ReactNode}) {return children}
function jump(event:MouseEvent<HTMLAnchorElement>,id:string){
 if(event.metaKey||event.ctrlKey||event.altKey||event.shiftKey||event.button!==0)return
 event.preventDefault();scrollToEssayTarget(id,true)
}
function FootnoteContent({ segments }: { segments: FootnoteSegment[] }) {
  return segments.map((segment, index) => {
    if (segment.type === 'text') {
      return <span key={`text-${index}`}>{segment.text}</span>
    }

    if (segment.type === 'link') {
      return (
        <a className="citation-link" href={segment.href} key={`link-${index}`}>
          {segment.text}
        </a>
      )
    }

    if (segment.type === 'list') {
      return (
        <span className="footnote-list" key={`list-${index}`}>
          <br />
          {segment.items.map((item, itemIndex) => (
            <span key={`list-item-${itemIndex}`}>
              {itemIndex + 1}. {item}
              {itemIndex < segment.items.length - 1 && <br />}
            </span>
          ))}
        </span>
      )
    }

    const source = sourcesData.sources.find(
      (item) => item.id === segment.sourceId,
    )
    const label = segment.italic ? <em>{segment.text}</em> : segment.text

    if (!source) return <span key={`source-${index}`}>{label}</span>

    return (
      <a
        className="citation-link"
        href={source.url}
        key={`source-${segment.sourceId}-${index}`}
        rel="noreferrer"
        target="_blank"
      >
        {label}
      </a>
    )
  })
}


export function FootnoteRef({number}:{number:number}){
 return <sup className={styles.reference}><a id={`footnote-ref-${number}`} href={`#footnote-${number}`} aria-label={`Footnote ${number}`} onClick={e=>jump(e,`footnote-${number}`)}>{number}</a></sup>
}
export function EssayEndnotes(){return <section className="essay-endnotes" aria-labelledby="essay-notes-title"><h3 id="essay-notes-title">Notes</h3><ol>{footnotes.map(note=><li tabIndex={-1} id={`footnote-${note.id}`} key={note.id}><FootnoteContent segments={note.body as FootnoteSegment[]}/>{' '}<a className={styles.back} href={`#footnote-ref-${note.id}`} onClick={e=>jump(e,`footnote-ref-${note.id}`)}>Back to text<span className={styles.sr}> {note.id}</span></a></li>)}</ol></section>}
