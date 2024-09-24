import { NextApiRequest, NextApiResponse } from "next";

const Sitemap = async (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}/</loc>
      <priority>1.00</priority>
    </url>
    <url>
      <loc>${baseUrl}/datasets</loc>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>${baseUrl}/themes</loc>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>${baseUrl}/publishers</loc>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>${baseUrl}/about</loc>
      <priority>0.80</priority>
    </url>
  </urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemap);
};

export default Sitemap;
