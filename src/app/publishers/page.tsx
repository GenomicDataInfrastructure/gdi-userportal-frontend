// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Suspense } from "react";
import PageContainer from "@/components/PageContainer";
import PublisherList from "@/components/PublisherList";
import { publisherList } from "@/services/discovery";
import Error from "@/app/error";
import LoadingContainer from "@/components/LoadingContainer";
import { RetrievedPublisher } from "@/services/discovery/types/dataset.types";

async function getPublishers(): Promise<RetrievedPublisher[]> {
  try {
    const response = await publisherList();
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default async function PublishersPage() {
  let publishers: RetrievedPublisher[];

  try {
    publishers = await getPublishers();
  } catch (error) {
    return <Error statusCode={500} />;
  }

  return (
    <PageContainer className="container mx-auto px-4 pt-5">
      <div className="my-8 flex items-center gap-2">
        <h1 className="text-left font-medium text-2xl sm:text-3xl">
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
          <PublisherList publishers={publishers} />
        ) : (
          <p className="text-center text-sm text-info">No publishers found.</p>
        )}
      </Suspense>
    </PageContainer>
  );
}
