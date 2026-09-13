'use client'
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
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


// Read: borrow the personal site's interactive tooltip card, anchored to the note.
// Cepheus paper/ink stay intact; hover previews, click pins, Notes remain addressable.
export function FootnoteRef({number}:{number:number}) {
 const [open,setOpen]=useState(false)
 const [position,setPosition]=useState({left:12,top:12})
 const anchor=useRef<HTMLAnchorElement>(null)
 const card=useRef<HTMLDivElement>(null)
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
 const pinned=useRef(false)
 const returning=useRef(false)
 const note=footnotes.find(note=>note.id===number)
 const cancelHide=()=>{if(timer.current)clearTimeout(timer.current)}
 const close=(restore=false)=>{cancelHide();pinned.current=false;setOpen(false);if(restore){returning.current=true;anchor.current?.focus({preventScroll:true});returning.current=false}}
 const show=()=>{cancelHide();window.dispatchEvent(new CustomEvent('cepheus-note-preview',{detail:number}));setOpen(true)}
 const scheduleHide=()=>{cancelHide();timer.current=setTimeout(()=>{if(!pinned.current&&!card.current?.contains(document.activeElement)&&document.activeElement!==anchor.current)setOpen(false)},160)}
 useEffect(()=>{
  const other=(event:Event)=>{if((event as CustomEvent<number>).detail!==number){pinned.current=false;setOpen(false)}}
  window.addEventListener('cepheus-note-preview',other)
  return()=>{cancelHide();window.removeEventListener('cepheus-note-preview',other)}
 },[number])
 useLayoutEffect(()=>{
  if(!open)return
  const place=()=>{
   if(!anchor.current||!card.current)return
   const rect=anchor.current.getBoundingClientRect(),box=card.current.getBoundingClientRect()
   const top=rect.bottom+12+box.height>innerHeight-12?rect.top-box.height-12:rect.bottom+12
   setPosition({left:Math.max(12,Math.min(rect.left,innerWidth-box.width-12)),top:Math.max(12,Math.min(top,innerHeight-box.height-12))})
  }
  place()
  const resize=new ResizeObserver(place);if(card.current)resize.observe(card.current)
  window.addEventListener('resize',place);window.addEventListener('scroll',place,true)
  const outside=(event:PointerEvent)=>{if(!card.current?.contains(event.target as Node)&&!anchor.current?.contains(event.target as Node))close()}
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();close(true)}}
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape)
  return()=>{resize.disconnect();window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true);document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}
 },[open])
 if(!note)return null
 return <>
  <sup className={styles.reference}><a ref={anchor} id={`footnote-ref-${number}`} href={`#footnote-${number}`} aria-label={`Footnote ${number}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open?`note-preview-${number}`:undefined}
   onPointerEnter={e=>{if(e.pointerType==='mouse')show()}} onPointerLeave={scheduleHide}
   onFocus={()=>{if(!returning.current)show()}} onBlur={scheduleHide}
   onKeyDown={e=>{if(open&&e.key==='Tab'&&!e.shiftKey){e.preventDefault();card.current?.querySelector<HTMLElement>('button,a')?.focus()} }}
   onClick={e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey||e.button!==0)return;e.preventDefault();pinned.current=true;show()}}>{number}</a></sup>
  {open&&createPortal(<div ref={card} id={`note-preview-${number}`} className={styles.preview} role="dialog" aria-label={`Note ${number}`} style={position} onPointerEnter={cancelHide} onPointerLeave={scheduleHide} onFocus={cancelHide} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node)&&e.relatedTarget!==anchor.current)close()}}
   onKeyDown={e=>{
    if(e.key!=='Tab')return
    const controls=Array.from(card.current?.querySelectorAll<HTMLElement>('button,a[href]')??[])
    if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();close(true)}
    if(!e.shiftKey&&document.activeElement===controls.at(-1)){
     e.preventDefault()
     const following=Array.from(document.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex="0"]')).find(el=>!card.current?.contains(el)&&el.getClientRects().length&&!!(anchor.current!.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING))
     close(true);following?.focus({preventScroll:true})
    }
   }}>
   <div className={styles.previewHeader}><span>Note {number}</span><button type="button" onClick={()=>close(true)} aria-label={`Close note ${number}`}>×</button></div>
   <div className={styles.previewBody}><FootnoteContent segments={note.body as FootnoteSegment[]}/></div>
   <a className={styles.previewNotes} href={`#footnote-${number}`} onClick={e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey||e.button!==0)return;close();jump(e,`footnote-${number}`)}}>View in Notes →</a>
  </div>,document.body)}
 </>
}
export function EssayEndnotes(){return <section className="essay-endnotes" aria-labelledby="essay-notes-title"><h3 id="essay-notes-title">Notes</h3><ol>{footnotes.map(note=><li tabIndex={-1} id={`footnote-${note.id}`} key={note.id}><FootnoteContent segments={note.body as FootnoteSegment[]}/>{' '}<a className={styles.back} href={`#footnote-ref-${note.id}`} onClick={e=>jump(e,`footnote-ref-${note.id}`)}>Back to text<span className={styles.sr}> {note.id}</span></a></li>)}</ol></section>}
