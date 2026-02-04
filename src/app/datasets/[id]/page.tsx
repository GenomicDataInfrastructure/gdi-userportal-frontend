// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import ErrorComponent from "@/app/error";
import Chip from "@/components/Chip";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatasetMetadata from "./DatasetMetadata";
import Tooltip from "./Tooltip";
import { createDatasetSidebarItems } from "./sidebarItems";
// import { retrieveDatasetApi } from "../../api/discovery";
import { retrieveDatasetApi } from "../../api/discovery-v1/index";
import { UrlParams, UrlSearchParams } from "@/app/params";

type DatasetDetailsPageProps = {
  params: Promise<UrlParams>;
  searchParams: Promise<UrlSearchParams>;
};

export default async function Page({
  params,
  searchParams,
}: DatasetDetailsPageProps) {
  const _params = await params;
  const _searchParams = await searchParams;

  if (!_params.id) {
    throw new Error("Missing dataset id");
  }

  try {
    const dataset = await retrieveDatasetApi(_params.id);

    const relationships = dataset?.datasetRelationships || [];

    const dictionary = dataset?.dataDictionary || [];

    return (
      <PageContainer searchParams={_searchParams}>
        <div className="flex flex-col items-start justify-start lg:flex-row">
          <div className="flex w-full flex-col gap-5 lg:w-2/3 lg:px-5">
            <div
              className={`flex flex-col ${dataset.themes?.length && dataset.themes.length < 2 && "md:flex-row md:gap-y-0 items-start"} gap-y-5 gap-x-3 justify-between`}
            >
              <PageHeading className="text-black">{dataset.title}</PageHeading>

              <ul className="flex gap-x-3 gap-y-2 flex-wrap">
                {dataset.themes
                  ?.filter(
                    (theme): theme is typeof theme & { label: string } =>
                      !!theme.label
                  )
                  .map((theme) => (
                    <li
                      key={theme.label}
                      className="tracking-widest uppercase flex items-center relative group"
                    >
                      <Chip
                        className="flex justify-center items-center w-24 md:w-32 h-12 text-[10px] md:text-xs text-center px-1 md:px-2"
                        chip={theme.label}
                      />
                      <Tooltip message="Theme associated with the dataset." />
                    </li>
                  ))}
              </ul>
            </div>

            {dataset.conformsTo && dataset.conformsTo.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Conforms To:
                </span>
                {dataset.conformsTo
                  ?.filter(
                    (
                      item
                    ): item is typeof item & {
                      value?: string;
                      label?: string;
                    } => !!(item.value || item.label)
                  )
                  .map((item) => (
                    <span
                      key={item.value || item.label}
                      className="text-sm font-semibold px-3 py-1 rounded-full bg-info/10 text-info border border-info/20"
                    >
                      {item.label || item.value}
                    </span>
                  ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="w-4 h-4 flex-shrink-0"
                />
                <span>Conforms To: Not specified for this dataset</span>
              </div>
            )}

            <div className="flex items-center">
              <p className="text-gray">{dataset.description}</p>
            </div>

            <div className="h-[2px] bg-secondary opacity-80"></div>

            <div className="w-full lg:hidden">
              <Sidebar items={createDatasetSidebarItems(dataset)} />
            </div>

            <div className="h-[2px] bg-secondary opacity-80 lg:hidden"></div>

            <div>
              <DatasetMetadata
                dataset={dataset}
                relationships={relationships}
                dictionary={dictionary}
              />
            </div>
          </div>
          <div className="lg:w-1/3 hidden lg:block">
            <Sidebar items={createDatasetSidebarItems(dataset)} />
          </div>
        </div>
      </PageContainer>
    );
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response!.data;
      return (
        <ErrorComponent
          statusCode={errorResponse.status}
          errorTitle={errorResponse.title}
          errorDetail={errorResponse.detail}
        />
      );
    }

    return <ErrorComponent statusCode={500} />;
  }
}
