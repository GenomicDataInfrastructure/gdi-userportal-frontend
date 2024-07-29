// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Error from "@/app/error";
import PageContainer from "@/components/PageContainer";
import { datasetGet } from "@/services/discovery";
import { isErrorResponse } from "@/utils/ErrorResponse";
import ClientSidebar from "./ClientSidebar";
import DatasetMetadata from "./DatasetMetadata";
import { parseDatasetRelationships } from "@/utils/datasetRelationshipUtils";
import { parseDatasetDictionary } from "@/utils/datasetDictionaryUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const dataset = await datasetGet(id);

    const relationships = parseDatasetRelationships({
      ...dataset,
      dataset_relationships: dataset.dataset_relationships || "[]",
    });
    const dictionary = parseDatasetDictionary({
      ...dataset,
      dataset_dictionary: dataset.dataset_dictionary || "[]",
    });

    return (
      <PageContainer>
        <div className="flex flex-col items-start justify-start lg:flex-row">
          <div className="flex w-full flex-col gap-5 lg:w-2/3 lg:px-5">
            {dataset.themes && dataset.themes.length > 0 && (
              <div className="tracking-widest uppercase flex items-center text-[14px]">
                <FontAwesomeIcon
                  icon={faThLarge}
                  className="text-primary mr-2"
                />
                {dataset.themes.map((theme) => theme.label).join("  |  ")}
              </div>
            )}
            <h1 className="text-primary text-[25px] font-semibold">
              {dataset.title}
            </h1>
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
    if (isErrorResponse(error)) {
      return (
        <Error
          statusCode={error.response.status}
          errorTitle={error.response.data.title}
          errorDetail={error.response.data.detail}
        />
      );
    }

    return <Error statusCode={500} />;
  }
}
