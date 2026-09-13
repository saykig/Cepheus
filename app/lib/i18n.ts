export const locales = ['en', 'ru', 'ko', 'fr', 'zh-CN'] as const
export type Locale = (typeof locales)[number]

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

// All supported languages are available in every deployment environment.
export const selectableLocales: readonly Locale[] = locales
