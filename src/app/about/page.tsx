/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { promises as fs } from "fs";
import path from "path";
import PageContainer from "@/components/PageContainer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { UrlSearchParams } from "@/app/params";

function getAboutFilePath(): string {
  return path.resolve("public/about.md");
}

async function getAboutContent(): Promise<string> {
  const filePath = getAboutFilePath();
  return await fs.readFile(filePath, "utf8");
}

type AboutPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const content = await getAboutContent();
  const _searchParams = await searchParams;

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
