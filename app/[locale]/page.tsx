import type { Metadata } from 'next'
import { LandingWatercolor } from '../components/landing-watercolor'
import { isLocale } from '../lib/i18n'
import { notFound } from 'next/navigation'

const title = 'Cepheus'
const description = 'Bridging the gap between policy and technology.'
const image = '/brand/cepheus-brand-home.png'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
    type: 'website',
    images: [{ url: image, width: 1731, height: 909, alt: 'Cepheus' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
  },
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <LandingWatercolor locale={locale} />
}
