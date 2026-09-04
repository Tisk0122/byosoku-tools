import type { MetadataRoute } from 'next'
import { categories } from '@/data/categories'
import { tools } from '@/data/tools'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const toolEntries = tools.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  })) as MetadataRoute.Sitemap
  const categoryEntries = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  })) as MetadataRoute.Sitemap
  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/terms`, lastModified: now, priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${base}/contact`, lastModified: now, priority: 0.3 },
  ]
  return [...staticEntries, ...categoryEntries, ...toolEntries]
}
