/* SPDX-FileCopyrightText: 2025 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

// src/pages/legal.tsx
import { promises as fs } from "fs";
import path from "path";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PageContainer from "@/components/PageContainer";
import { UrlSearchParams } from "@/app/params";

const getLegalFilePath = () => path.resolve("public/legal.md");

const getLegalContent = async () => {
  const filePath = getLegalFilePath();
  return await fs.readFile(filePath, "utf8");
};

type LegalPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default async function LegalPage({ searchParams }: LegalPageProps) {
  const _searchParams = await searchParams;
  const content = await getLegalContent();

  return (
    <PageContainer
      searchParams={_searchParams}
      className="container mx-auto px-4 pt-5"
    >
      <div className="my-8 gap-2">
        <MarkdownRenderer content={content} />
      </div>
    </PageContainer>
  );
}
