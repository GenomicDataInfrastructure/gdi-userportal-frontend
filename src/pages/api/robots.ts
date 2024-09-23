import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const robotsTxt = fs.readFileSync(
      path.join(process.cwd(), "src", "public", "robots.txt"),
      "utf8"
    );
    res.setHeader("Content-Type", "text/plain");
    res.send(robotsTxt);
  } catch (error) {
    console.error("Error serving robots.txt:", error);
    res.status(500).json({ error: "Unable to serve robots.txt" });
  }
}
