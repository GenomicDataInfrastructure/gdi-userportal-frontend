import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const robotsTxt = fs.readFileSync(
    path.join(process.cwd(), "src", "public", "robots.txt"),
    "utf8"
  );

  res.setHeader("Content-Type", "text/plain");
  res.write(robotsTxt);
  res.end();
}
