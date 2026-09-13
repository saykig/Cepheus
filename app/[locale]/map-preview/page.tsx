import { notFound } from 'next/navigation'
import CepheusEssay from '../essays/what-we-owe-to-each-other/page'
import { EditorialPreviewProvider } from '../../components/editorial-preview-context'
export const metadata = { title: 'Institutional map — local study', robots: { index: false, follow: false } }
export default function MapPreview({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <EditorialPreviewProvider><CepheusEssay params={params} /></EditorialPreviewProvider>
}
