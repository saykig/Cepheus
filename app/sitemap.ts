import bundle from '../public/data/institutional-map/bundle.json'
import { getBlogPosts } from 'app/blog/utils'

export const baseUrl = 'https://cepheus-pons.org'

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let routes = ['', '/essays/what-we-owe-to-each-other', '/institutional-links', ...bundle.relationships.map(r=>`/institutional-links/${r.id}`)].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
