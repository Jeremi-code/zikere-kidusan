import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const targetFile = path.resolve(__dirname, '../public/sitemap.xml')
const baseUrl = 'https://zikere-kidusan.vercel.app'

const months = [
  { id: 1, days: 30 },
  { id: 2, days: 30 },
  { id: 3, days: 30 },
  { id: 4, days: 30 },
  { id: 5, days: 30 },
  { id: 6, days: 30 },
  { id: 7, days: 30 },
  { id: 8, days: 30 },
  { id: 9, days: 30 },
  { id: 10, days: 30 },
  { id: 11, days: 30 },
  { id: 12, days: 30 },
  { id: 13, days: 6 },
]

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <xhtml:link rel="alternate" hreflang="am" href="${baseUrl}/?lang=am" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`

for (const m of months) {
  for (let d = 1; d <= m.days; d++) {
    const loc = `${baseUrl}/?month=${m.id}&amp;day=${d}`
    const amLoc = `${baseUrl}/?month=${m.id}&amp;day=${d}&amp;lang=am`
    const enLoc = `${baseUrl}/?month=${m.id}&amp;day=${d}&amp;lang=en`
    xml += `
  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="am" href="${amLoc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  }
}

xml += `
</urlset>
`

fs.writeFileSync(targetFile, xml.trim(), 'utf-8')
