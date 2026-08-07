import type { Metadata } from 'next'
import { LandingWatercolor } from '../components/landing-watercolor'
import { isLocale } from '../lib/i18n'
import { notFound } from 'next/navigation'

const title = 'Cepheus'
const description = 'Bridging the gap between policy and technology.'
const image =
  '/og?kind=home&title=Cepheus&description=Bridging%20the%20gap%20between%20policy%20and%20technology.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
    type: 'website',
    images: [{ url: image, width: 1200, height: 630, alt: 'Cepheus' }],
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
