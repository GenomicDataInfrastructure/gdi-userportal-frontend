// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Suspense } from "react";
import PageContainer from "@/components/PageContainer";
import ValueList from "@/components/ValueList";
import Error from "@/app/error";
import LoadingContainer from "@/components/LoadingContainer";
import { retrieveFilterValuesApi } from "../api/discovery";
import { ValueLabel } from "@/app/api/discovery/open-api/schemas";
import { FilterValueType } from "@/app/api/discovery/additional-types";

async function getPublishers(): Promise<ValueLabel[]> {
  try {
    return await retrieveFilterValuesApi(FilterValueType.PUBLISHER);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default async function PublishersPage() {
  let publishers: ValueLabel[];

  try {
    publishers = await getPublishers();
  } catch (error) {
    console.error(error);
    return <Error statusCode={500} />;
  }

  return (
    <PageContainer className="container mx-auto px-4 pt-5">
      <div className="my-8 flex items-center gap-2 px-4 sm:px-6 lg:px-8">
        <h1 className="text-left font-title text-2xl sm:text-3xl">
          Publishers
        </h1>
        <span className="bg-info text-white text-sm px-2 py-1 rounded-full">
          {publishers.length}
        </span>
      </div>
      <Suspense
        fallback={
          <LoadingContainer
            text="Retrieving publishers. This may take a few moments."
            className="mt-4 px-4 text-center sm:mt-8 sm:px-8"
          />
        }
      >
        {publishers.length > 0 ? (
          <ValueList
            items={publishers}
            filterKey={FilterValueType.PUBLISHER}
            title="Publishers"
          />
        ) : (
          <p className="text-center text-sm text-info">No publishers found.</p>
        )}
      </Suspense>
    </PageContainer>
  );
}
