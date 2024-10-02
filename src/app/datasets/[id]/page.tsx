// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Error from "@/app/error";
import Chip from "@/components/Chip";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { datasetGet } from "@/services/discovery";
import axios from "axios";
import DatasetMetadata from "./DatasetMetadata";
import Tooltip from "./Tooltip";
import { createDatasetSidebarItems } from "./sidebarItems";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const dataset = await datasetGet(id, null);

    const relationships = dataset.datasetRelationships || [];

    const dictionary = dataset.dataDictionary || [];

    return (
      <PageContainer>
        <div className="flex flex-col items-start justify-start lg:flex-row">
          <div className="flex w-full flex-col gap-5 lg:w-2/3 lg:px-5">
            <div className="sm:flex sm:justify-between">
              <div className="flex items-center gap-x-4">
                <PageHeading>{dataset.title}</PageHeading>

                {dataset.themes.map((theme) => (
                  <div
                    key={theme.label}
                    className="tracking-widest uppercase flex items-center text-[14px] relative group"
                  >
                    <Chip className="text-center" chip={theme.label} />
                    <Tooltip message="Themes associated with the dataset." />
                  </div>
                ))}
              </div>
            )}
            <h1 className="text-[25px] font-semibold">{dataset.title}</h1>
            <div className="pb-3.5">
            </div>

            <div className="flex items-center gap-x-3">
              <p className="text-gray">{dataset.description}</p>
            </div>

            <div className="h-[2px] bg-secondary opacity-80"></div>

            <div className="w-full my-8 lg:hidden">
              <Sidebar items={createDatasetSidebarItems(dataset)} />
            </div>

            <div className="mt-5 h-[2px] bg-secondary opacity-80 lg:hidden"></div>

            <div className="mt-5">
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
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response!.data;
      return (
        <Error
          statusCode={errorResponse.status}
          errorTitle={errorResponse.title}
          errorDetail={errorResponse.detail}
        />
      );
    }

    return <Error statusCode={500} />;
  }
}
