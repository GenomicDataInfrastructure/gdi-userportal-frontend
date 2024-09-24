import { NextApiRequest, NextApiResponse } from "next";

const Robots = (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const robots = `
    User-agent: *
    Allow: /

    Sitemap: ${baseUrl}/sitemap.xml
  `;

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(robots);
};

export default Robots;
