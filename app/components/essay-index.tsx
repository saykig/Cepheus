'use client'

import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getEssayTargetOffset } from './essay-scroll'
import type { Locale } from 'app/lib/i18n'
import { siteCopy } from 'app/lib/site-copy'

type Section = {
  id: string
  title: string
  children?: Section[]
}

export function EssayIndex({
  sections,
  updated,
  locale,
}: {
  sections: Section[]
  updated?: string
  locale: Locale
}) {
  const copy = siteCopy[locale]
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const [visibleChildId, setVisibleChildId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [noteOpacity, setNoteOpacity] = useState(1)
  const indexRef = useRef<HTMLElement>(null)
  const flatSections = useMemo(
    () => sections.flatMap((section) => [section, ...(section.children ?? [])]),
    [sections],
  )
  const childSections = useMemo(
    () => sections.flatMap((section) => section.children ?? []),
    [sections],
  )

  useEffect(() => {
    const update = () => {
      setNoteOpacity(Math.max(0.78, 1 - window.scrollY / 1800))

      const current = flatSections.reduce((active, section) => {
        const element = document.getElementById(section.id)
        if (!element) return active
        return element.getBoundingClientRect().top <=
          getEssayTargetOffset(section.id)
          ? section.id
          : active
      }, flatSections[0]?.id)
      setActiveId(current)

      const visibleChild = childSections.find((section) => {
        const element = document.getElementById(section.id)
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > 0
      })

      setVisibleChildId((previous) => {
        if (visibleChild) return visibleChild.id
        if (!previous) return null

        const previousElement = document.getElementById(previous)
        if (!previousElement) return null
        const rect = previousElement.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > -48
          ? previous
          : null
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [childSections, flatSections])

  useEffect(() => {
    const updateProgress = () => {
      const index = indexRef.current
      const activeItem = index?.querySelector<HTMLElement>(
        `[data-index-section="${activeId}"]`,
      )
      const dot = activeItem?.querySelector<HTMLElement>('.essay-index-dot')
      if (!index || !dot) return

      const lineInset =
        Number.parseFloat(
          getComputedStyle(index).getPropertyValue('--essay-index-line-inset'),
        ) || 32
      const indexRect = index.getBoundingClientRect()
      const dotRect = dot.getBoundingClientRect()
      const lineLength = Math.max(indexRect.height - lineInset * 2, 1)
      const next =
        (dotRect.top + dotRect.height / 2 - indexRect.top - lineInset) /
        lineLength

      setProgress(Math.min(1, Math.max(0, next)))
    }

    const frame = window.requestAnimationFrame(updateProgress)
    window.addEventListener('resize', updateProgress)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateProgress)
    }
  }, [activeId, visibleChildId])

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return

    let cancelled = false
    const cancel = () => {
      cancelled = true
    }
    const alignHashTarget = () => {
      if (cancelled) return
      const target = document.getElementById(id)
      if (!target) return

      const root = document.documentElement
      const previousBehavior = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      const offset = getEssayTargetOffset(id)
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - offset,
      })
      root.style.scrollBehavior = previousBehavior
    }

    const timers = [0, 350, 1000].map((delay) =>
      window.setTimeout(alignHashTarget, delay),
    )
    window.addEventListener('wheel', cancel, { passive: true, once: true })
    window.addEventListener('touchstart', cancel, { passive: true, once: true })
    window.addEventListener('pointerdown', cancel, { passive: true, once: true })

    return () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('pointerdown', cancel)
    }
  }, [])

  const activeIndex = flatSections.findIndex((section) => section.id === activeId)

  const renderIndexLink = (
    section: Section,
    { child = false, tabIndex }: { child?: boolean; tabIndex?: number } = {},
  ) => {
    const index = flatSections.findIndex((item) => item.id === section.id)
    const isReached = index >= 0 && index <= activeIndex
    const activeChildIsHidden =
      !child &&
      section.children?.some((item) => item.id === activeId) &&
      visibleChildId !== activeId
    const isActive = activeId === section.id || Boolean(activeChildIsHidden)

    return (
      <a
        className={[
          'essay-index-item',
          child ? 'is-child' : '',
          isActive ? 'is-active' : '',
          isReached ? 'is-reached' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        href={`#${section.id}`}
        key={section.id}
        data-index-section={section.id}
        aria-current={isActive ? 'true' : undefined}
        tabIndex={tabIndex}
      >
        <span className="essay-index-dot" aria-hidden="true" />
        <span>{section.title}</span>
      </a>
    )
  }

  return (
    <aside
      className="essay-side"
      aria-label={copy.contents}
      style={
        {
          '--note-opacity': noteOpacity,
          '--scroll-percent': `${progress * 100}%`,
        } as CSSProperties
      }
    >
      <p className="essay-side-note">
        {copy.sideNote}
      </p>

      <nav
        className="essay-scroll-index"
        aria-label={copy.sections}
        ref={indexRef}
      >
        {sections.map((section) => {
          const childIds = section.children?.map((child) => child.id) ?? []
          const branchOpen = childIds.includes(visibleChildId ?? '')

          return (
            <div className="essay-index-group" key={section.id}>
              {renderIndexLink(section)}
              {section.children ? (
                <div
                  className={`essay-index-branch${branchOpen ? ' is-open' : ''}`}
                  aria-hidden={!branchOpen}
                >
                  <div className="essay-index-branch-inner">
                    {section.children.map((child) =>
                      renderIndexLink(child, {
                        child: true,
                        tabIndex: branchOpen ? undefined : -1,
                      }),
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>

      <div className="essay-rail-actions">
        {updated ? <p className="rail-updated">{copy.lastUpdated} {updated}</p> : null}
      </div>
    </aside>
  )
}
