// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Error from "@/app/error";
import Chips from "@/components/Chips";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import PageSubHeading from "@/components/PageSubHeading";
import { datasetGet } from "@/services/discovery";
import { isErrorResponse } from "@/utils/ErrorResponse";
import ClientSidebar from "./ClientSidebar";
import DatasetMetadata from "./DatasetMetadata";
import {
  parseDatasetRelationships,
  formatRelationshipType,
} from "@/utils/datasetRelationshipUtils";
import {
  parseDatasetDictionary,
  formatFieldName,
  formatDescription,
} from "@/utils/datasetDictionaryUtils";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const dataset = await datasetGet(id);

    const relationships = parseDatasetRelationships(dataset);
    const dictionary = parseDatasetDictionary(dataset);

    return (
      <PageContainer>
        <div className="flex flex-col items-start justify-start lg:flex-row">
          <div className="flex w-full flex-col gap-5 lg:w-2/3 lg:px-5">
            <h1 className="text-primary text-[25px] font-semibold">{dataset.title}</h1>
            {dataset.themes && dataset.themes.length > 0 && (
              <div className="tracking-widest uppercase flex items-center gap-2">
                <FontAwesomeIcon icon={faThLarge} className="text-primary" />
                {dataset.themes.map((theme) => theme.label).join("  |  ")}
              </div>
            )}
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
