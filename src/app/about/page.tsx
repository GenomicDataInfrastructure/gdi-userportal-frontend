/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";
import renderer from "./renderer";
import PageContainer from "@/components/PageContainer";
import DOMPurify from "isomorphic-dompurify";

async function getAboutContent() {
  const filePath = path.join(process.cwd(), "public", "about.md");
  const markdown = await fs.readFile(filePath, "utf8");

  marked.use({ renderer });
  const rawHtml = await marked.parse(markdown);

  // Ensure rawHtml is a string
  const htmlString = typeof rawHtml === "string" ? rawHtml : "";

  // Sanitize the HTML
  return DOMPurify.sanitize(htmlString, {
    ADD_ATTR: ["target"],
    ADD_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6"],
  });
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <PageContainer className="container mx-auto px-4 pt-5">
      <div className="my-8 flex items-center gap-2">
        <h1 className="text-left font-medium text-2xl sm:text-3xl">About</h1>
      </div>
      <div
        className="text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </PageContainer>
  );
}
