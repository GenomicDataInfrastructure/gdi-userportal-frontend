/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

// src/pages/legal.tsx
import { promises as fs } from "fs";
import path from "path";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PageContainer from "@/components/PageContainer";

const getLegalFilePath = () => path.resolve("src/public/legal.md");

const getLegalContent = async () => {
  const filePath = getLegalFilePath();
  return await fs.readFile(filePath, "utf8");
};

export default async function LegalPage() {
  const content = await getLegalContent();

  return (
    <PageContainer className="container mx-auto px-4 pt-5">
      <div className="my-8 gap-2">
        <MarkdownRenderer content={content} />
      </div>
    </PageContainer>
  );
}
