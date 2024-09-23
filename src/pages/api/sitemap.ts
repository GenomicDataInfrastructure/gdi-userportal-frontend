import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const baseUrl = `https://${req.headers.host}`
    const staticSitemap = fs.readFileSync(path.join(process.cwd(), 'src', 'public', 'sitemap.xml'), 'utf8')
    const dynamicSitemap = staticSitemap.replace(/{{ BASE_URL }}/g, baseUrl)

    res.setHeader('Content-Type', 'text/xml')
    res.write(dynamicSitemap)
    res.end()
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.status(500).json({ error: 'Unable to generate sitemap' })
  }
}
