// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Error from "@/app/error";
import PageContainer from "@/components/PageContainer";
import { datasetGet } from "@/services/discovery";
import ClientSidebar from "./ClientSidebar";
import DatasetMetadata from "./DatasetMetadata";
import Tooltip from "./Tooltip";
import axios from "axios";

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
            {dataset.themes && dataset.themes.length > 0 && (
              <div className="tracking-widest uppercase flex items-center text-[14px] relative group">
                {dataset.themes.map((theme) => theme.label).join("  |  ")}
                <Tooltip message="Themes associated with the dataset." />
              </div>
            )}
            <h1 className="text-[25px] font-semibold">{dataset.title}</h1>
            <div className="pb-3.5">
              <p className="text-gray">{dataset.description}</p>
            </div>
            <DatasetMetadata
              dataset={dataset}
              relationships={relationships}
              dictionary={dictionary}
            />
          </div>
          <ClientSidebar dataset={dataset} />
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
