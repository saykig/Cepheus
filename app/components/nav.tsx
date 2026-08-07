'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  defaultLocale,
  localeCookie,
  localeNames,
  localizeHref,
  stripLocale,
  type Locale,
} from 'app/lib/i18n'
import { siteCopy } from 'app/lib/site-copy'

export function Navbar({
  locale,
  localeOptions,
}: {
  locale: Locale
  localeOptions: readonly Locale[]
}) {
  const pathname = usePathname()
  const unprefixedPath = stripLocale(pathname)
  const showHome = unprefixedPath !== '/'
  const isEssayRoute = unprefixedPath.startsWith('/essays')
  const [darkMode, setDarkMode] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const projectsNavRef = useRef<HTMLElement>(null)
  const copy = siteCopy[locale]

  useEffect(() => {
    const closeProjectsOnOutsidePress = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Node &&
        !projectsNavRef.current?.contains(target)
      ) {
        setProjectsOpen(false)
      }
    }

    const closeProjectsOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProjectsOpen(false)
    }

    document.addEventListener('pointerdown', closeProjectsOnOutsidePress)
    document.addEventListener('keydown', closeProjectsOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeProjectsOnOutsidePress)
      document.removeEventListener('keydown', closeProjectsOnEscape)
    }
  }, [])

  const toggleTheme = () => {
    const nextDarkMode = !darkMode
    document.documentElement.dataset.theme = nextDarkMode ? 'dark' : 'light'
    setDarkMode(nextDarkMode)
  }

  const themeLabel = darkMode ? copy.light : copy.dark

  const changeLocale = (nextLocale: Locale) => {
    document.cookie = `${localeCookie}=${nextLocale}; max-age=31536000; path=/; samesite=lax`
    const nextPath =
      nextLocale === defaultLocale
        ? unprefixedPath
        : localizeHref(unprefixedPath, nextLocale)
    window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`)
  }

  const closeProjectsAfterFocusChange = () => {
    queueMicrotask(() => {
      if (!projectsNavRef.current?.contains(document.activeElement)) {
        setProjectsOpen(false)
      }
    })
  }

  return (
    <header className={showHome ? 'site-header has-home' : 'site-header'}>
      {showHome ? (
        <Link href={localizeHref('/', locale)} className="home-mark" aria-label={`Cepheus ${copy.home}`}>
          cepheus
        </Link>
      ) : null}
      <div className="header-actions">
        <div className="header-navigation">
          <nav
            aria-label={copy.essays}
            className={`essay-nav${isEssayRoute ? ' is-current' : ''}`}
          >
            <button
              aria-current={isEssayRoute ? 'page' : undefined}
              className="essay-trigger"
              type="button"
            >
              {copy.essays}
            </button>
            <div className="essay-menu">
              <Link href={localizeHref('/essays/what-we-owe-to-each-other', locale)}>
                {copy.essayMenuTitle}
              </Link>
            </div>
          </nav>
          <nav
            aria-label={copy.projects}
            className={`essay-nav project-nav${projectsOpen ? ' is-open' : ''}`}
            onBlur={closeProjectsAfterFocusChange}
            onFocus={() => setProjectsOpen(true)}
            onMouseEnter={() => setProjectsOpen(true)}
            onMouseLeave={() => setProjectsOpen(false)}
            ref={projectsNavRef}
          >
            <button
              aria-controls="projects-menu"
              aria-expanded={projectsOpen}
              aria-haspopup="true"
              className="essay-trigger project-trigger"
              onClick={() => setProjectsOpen((open) => !open)}
              type="button"
            >
              {copy.projects}
            </button>
            <div className="essay-menu project-menu" id="projects-menu">
              <a
                href="https://writewrit.vercel.app/"
                rel="noreferrer"
                target="_blank"
              >
                <span>Writ</span>
                <span className="project-menu-description">
                  {copy.writDescription}
                </span>
              </a>
            </div>
          </nav>
        </div>
        {localeOptions.length > 1 ? (
          <label className="language-picker">
            <span className="visually-hidden">{copy.language}</span>
            <select
              aria-label={copy.language}
              value={locale}
              onChange={(event) => changeLocale(event.target.value as Locale)}
            >
              {localeOptions.map((option) => (
                <option key={option} value={option}>
                  {localeNames[option]}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <button
          type="button"
          className="theme-toggle"
          role="switch"
          aria-checked={darkMode}
          aria-label={themeLabel}
          title={themeLabel}
          onClick={toggleTheme}
        >
          <span className="visually-hidden">{themeLabel}</span>
        </button>
      </div>
    </header>
  )
}
