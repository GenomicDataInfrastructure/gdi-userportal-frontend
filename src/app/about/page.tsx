/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { promises as fs } from "fs";
import path from "path";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PageContainer from "@/components/PageContainer";

function getAboutFilePath(): string {
  return path.resolve("public/about.md");
}

async function getAboutContent(): Promise<string> {
  const filePath = getAboutFilePath();
  return await fs.readFile(filePath, "utf8");
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <PageContainer className="container mx-auto px-4 pt-5">
      <div className="my-8 gap-2">
        <MarkdownRenderer content={content} />
      </div>
    </PageContainer>
  );
}
