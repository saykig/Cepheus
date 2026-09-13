import { notFound } from 'next/navigation'
import { EditorialMapPreview } from '../../components/editorial-map-preview'
export const metadata = { title: 'Institutional map — local study', robots: { index: false, follow: false } }
export default function MapPreview() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <EditorialMapPreview />
}
