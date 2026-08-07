'use client'

import type { MouseEvent, ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import sourcesData from '../../public/data/sources.json'
import { scrollToEssayTarget } from './essay-scroll'

type FootnoteSegment = {
  type: 'text' | 'source'
  text: string
  sourceId?: number
  italic?: boolean
}

type Footnote = {
  id: number
  readMore: boolean
  preview?: FootnoteSegment[]
  body: FootnoteSegment[]
}

type FootnoteContextValue = {
  openId: number | null
  setOpenId: (id: number | null) => void
  closeAll: () => void
}

const FootnoteContext = createContext<FootnoteContextValue | null>(null)
const footnotes = sourcesData.footnotes as Footnote[]

function blurActiveFootnote() {
  const active = document.activeElement
  if (
    active instanceof HTMLElement &&
    active.closest('[data-footnote-control]')
  ) {
    active.blur()
  }
}

export function EssayFootnoteProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<number | null>(null)

  const closeAll = useCallback(() => {
    setOpenId(null)
    blurActiveFootnote()
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        target.closest('[data-footnote-control]')
      ) {
        return
      }
      setOpenId(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      closeAll()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeAll])

  return (
    <FootnoteContext.Provider value={{ openId, setOpenId, closeAll }}>
      {children}
    </FootnoteContext.Provider>
  )
}

function useFootnotes() {
  const context = useContext(FootnoteContext)
  if (!context) {
    throw new Error('Footnotes must be rendered inside EssayFootnoteProvider')
  }
  return context
}

function FootnoteContent({ segments }: { segments: FootnoteSegment[] }) {
  return segments.map((segment, index) => {
    if (segment.type === 'text') {
      return <span key={`text-${index}`}>{segment.text}</span>
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

export function FootnoteRef({ number }: { number: number }) {
  const { openId, setOpenId } = useFootnotes()
  const note = footnotes.find((item) => item.id === number)

  if (!note) return <sup>{number}</sup>

  const isTouchOpen = openId === number
  const panelId = `footnote-popover-${number}`

  const handleTrigger = () => {
    if (!window.matchMedia('(hover: none)').matches) return
    setOpenId(isTouchOpen ? null : number)
  }

  return (
    <span
      className={`footnote-control${isTouchOpen ? ' is-touch-open' : ''}`}
      data-footnote-control
    >
      <button
        type="button"
        className="footnote-ref"
        id={`footnote-ref-${number}`}
        aria-controls={panelId}
        aria-describedby={panelId}
        aria-label={`Footnote ${number}`}
        onClick={handleTrigger}
      >
        {number}
      </button>
      <span
        className="footnote-popover"
        id={panelId}
        role="note"
        aria-label={`Footnote ${number}`}
      >
        <FootnoteContent segments={note.body} />
      </span>
    </span>
  )
}

export function EssayEndnotes() {
  const handleBackToText = (
    event: MouseEvent<HTMLAnchorElement>,
    number: number,
  ) => {
    event.preventDefault()
    scrollToEssayTarget(`footnote-ref-${number}`, true)
  }

  return (
    <section className="essay-endnotes" aria-labelledby="essay-notes-title">
      <h3 id="essay-notes-title">Notes</h3>
      <ol>
        {footnotes.map((note) => (
          <li id={`footnote-${note.id}`} key={note.id}>
            <FootnoteContent segments={note.body} />{' '}
            <a
              className="footnote-back"
              href={`#footnote-ref-${note.id}`}
              onClick={(event) => handleBackToText(event, note.id)}
            >
              Back to text
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
