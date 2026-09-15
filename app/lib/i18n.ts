const contentLocales = ['en', 'ru', 'ko', 'fr', 'zh-CN'] as const
export type Locale = (typeof contentLocales)[number]

// English is the only locale currently exposed by the site. The translated
// copy remains available in the codebase so it can be restored later.
export const locales: readonly Locale[] = ['en']

export const defaultLocale: Locale = 'en'
export const localeCookie = 'cepheus-locale'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  ko: '한국어',
  fr: 'Français',
  'zh-CN': '简体中文',
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function localizeHref(href: string, locale: Locale) {
  if (!href.startsWith('/') || locale === defaultLocale) return href
  return `/${locale}${href === '/' ? '' : href}`
}

export function stripLocale(pathname: string) {
  const parts = pathname.split('/')
  return isLocale(parts[1] ?? '') ? `/${parts.slice(2).join('/')}` : pathname
}

// Keep the language control hidden while English is the sole public locale.
export const selectableLocales: readonly Locale[] = locales
