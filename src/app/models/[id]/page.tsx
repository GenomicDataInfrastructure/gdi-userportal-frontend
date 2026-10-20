// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import ErrorComponent from "@/app/error";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import axios from "axios";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { retrieveAiModelApi } from "@/app/api/discovery";
import { UrlParams, UrlSearchParams } from "@/app/params";
import contentConfig from "@/config/contentConfig";
import type { ReactNode } from "react";
import AiModelDate from "@/app/models/AiModelDate";
import { getDiscoveryProvider } from "@/app/api/discovery/providers/factory";

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

  // Reuses Dataset's labels
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

    return <ErrorComponent statusCode={404} />;
  }

  return (
    <PageContainer searchParams={_searchParams}>
      <div className="flex w-full flex-col gap-5 lg:w-2/3 lg:px-5">
        <PageHeading className="text-black">{aiModel.title}</PageHeading>
        {aiModel.description && (
          <p className="text-gray">{aiModel.description}</p>
        )}
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <MetadataItem label={t("version")} value={aiModel.version} />
          <MetadataItem
            label={t("accessRights")}
            value={aiModel.accessRights?.label}
          />
          <MetadataItem
            label={t("createdOn")}
            value={
              aiModel.createdAt && <AiModelDate value={aiModel.createdAt} />
            }
          />
          <MetadataItem
            label={t("modifiedOn")}
            value={
              aiModel.modifiedAt && <AiModelDate value={aiModel.modifiedAt} />
            }
          />
          <MetadataItem
            label={t("publishers")}
            value={aiModel.publishers
              .map((publisher) => publisher.name)
              .join(", ")}
          />
          <MetadataItem
            label={t("creators")}
            value={aiModel.creators.map((creator) => creator.name).join(", ")}
          />
          <MetadataItem
            label={t("keywords")}
            value={aiModel.keywords?.join(", ")}
          />
          <MetadataItem
            label={tAiModels("contacts")}
            value={aiModel.contacts
              ?.map((contact) => contact.name || contact.email)
              .filter(Boolean)
              .join(", ")}
          />
          <MetadataItem
            label={t("documentation")}
            value={aiModel.documentation?.join(", ")}
          />
        </dl>
      </div>
    </PageContainer>
  );
}

function MetadataItem({
  label,
  value,
}: Readonly<{ label: string; value?: ReactNode }>) {
  if (!value) return null;

  return (
    <div>
      <dt className="font-semibold text-info">{label}</dt>
      <dd className="mt-1 text-gray">{value}</dd>
    </div>
  );
}
