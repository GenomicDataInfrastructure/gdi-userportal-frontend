// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import ErrorComponent from "@/app/error";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { createContactPointsSidebarItem } from "@/components/ContactPointsSidebarItem";
import axios from "axios";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { retrieveAiModelApi } from "@/app/api/discovery";
import { UrlParams, UrlSearchParams } from "@/app/params";
import contentConfig from "@/config/contentConfig";
import { getDiscoveryProvider } from "@/app/api/discovery/providers/factory";
import AiModelMetadata from "./AiModelMetadata";

type AiModelDetailsPageProps = {
  params: Promise<UrlParams>;
  searchParams: Promise<UrlSearchParams>;
};

export default async function Page({
  params,
  searchParams,
}: AiModelDetailsPageProps) {
  if (!contentConfig.enableAiModel || !getDiscoveryProvider().retrieveAiModel) {
    notFound();
  }

  const t = await getTranslations("datasets.detail");
  const tAiModels = await getTranslations("aiModels");
  const _params = await params;
  const _searchParams = await searchParams;

  if (!_params.id) {
    throw new Error("Missing AI Model id");
  }

  let aiModel: Awaited<ReturnType<typeof retrieveAiModelApi>>;

  try {
    aiModel = await retrieveAiModelApi(decodeURIComponent(_params.id));
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data;
      return (
        <ErrorComponent
          statusCode={errorResponse?.status ?? error.response?.status}
          errorTitle={errorResponse?.title}
          errorDetail={errorResponse?.detail}
        />
      );
    }

    if (
      error instanceof Error &&
      error.message.startsWith("AI Model not found in local index:")
    ) {
      return <ErrorComponent statusCode={404} />;
    }

    return <ErrorComponent statusCode={500} />;
  }

  const sidebarTranslations = {
    contactPoints: tAiModels("contacts"),
    noContactProvided: t("noContactProvided"),
    noEmailProvided: t("noEmailProvided"),
  };
  const sidebarItems = [
    createContactPointsSidebarItem(aiModel.contacts, sidebarTranslations),
  ];

  return (
    <PageContainer searchParams={_searchParams}>
      <div className="flex flex-col items-start justify-start lg:flex-row">
        <div className="flex w-full flex-col gap-5 lg:w-2/3 lg:px-5">
          <PageHeading className="text-black">{aiModel.title}</PageHeading>

          <div className="flex items-center">
            <p className="text-gray">{aiModel.description}</p>
          </div>

          <div className="h-[2px] bg-secondary opacity-80"></div>

          <div className="w-full lg:hidden">
            <Sidebar items={sidebarItems} />
          </div>

          <div className="h-[2px] bg-secondary opacity-80 lg:hidden"></div>

          <div>
            <AiModelMetadata aiModel={aiModel} />
          </div>
        </div>
        <div className="lg:w-1/3 hidden lg:block">
          <Sidebar items={sidebarItems} />
        </div>
      </div>
    </PageContainer>
  );
}
