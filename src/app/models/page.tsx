// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import ResultCount from "@/components/ResultCount";
import NoResultsMessage from "@/components/NoResultsMessage";
import AiModelListContainer from "./AiModelListContainer";
import { use } from "react";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import AiModelsProvider, {
  useAiModels,
} from "@/providers/aiModels/AiModelsProvider";
import { UrlSearchParams } from "@/app/params";
import { useLocale } from "next-intl";
import contentConfig from "@/config/contentConfig";
import { useAiModelSupport } from "@/providers/AiModelSupportProvider";

type AiModelsPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

function AiModelsSummary() {
  const { aiModelCount, isLoading, errorCode } = useAiModels();
  return (
    <>
      <ResultCount
        namespace="aiModels"
        count={aiModelCount}
        isLoading={isLoading}
        errorCode={errorCode}
      />
      <NoResultsMessage
        namespace="aiModels"
        count={aiModelCount}
        isLoading={isLoading}
      />
    </>
  );
}

export default function AiModelsPage({ searchParams }: AiModelsPageProps) {
  const supportsAiModels = useAiModelSupport();
  if (!contentConfig.enableAiModel || !supportsAiModels) {
    notFound();
  }

  const _searchParams = use(searchParams);
  const locale = useLocale();

  if (!_searchParams.page) {
    redirect({ href: "/models?page=1", locale });
  }

  const currentPage = Number(_searchParams.page);

  return (
    <PageContainer searchParams={_searchParams}>
      <div className="grid grid-cols-12">
        <div className="col-start-0 col-span-12 flex items-center justify-between xl:col-span-10 xl:col-start-2">
          <SearchBar
            searchParams={_searchParams}
            basePath="/models"
            placeholderKey="search.aiModelsPlaceholder"
          />
        </div>

        <AiModelsProvider searchParams={_searchParams}>
          <AiModelsSummary />
          <div className="col-span-12 xl:col-span-8 xl:col-start-5">
            <AiModelListContainer currentPage={currentPage} />
          </div>
        </AiModelsProvider>
      </div>
    </PageContainer>
  );
}
