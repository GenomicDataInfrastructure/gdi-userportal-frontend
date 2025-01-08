/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { promises as fs } from "fs";
import path from "path";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PageContainer from "@/components/PageContainer";
import { UrlSearchParams } from "@/app/params";

function getAboutFilePath(): string {
  return path.resolve("public/howto.md");
}

async function getAboutContent(): Promise<string> {
  const filePath = getAboutFilePath();
  return await fs.readFile(filePath, "utf8");
}

type HowToPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default async function HowtoPage({ searchParams }: HowToPageProps) {
  const _searchParams = await searchParams;
  const content = await getAboutContent();

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
