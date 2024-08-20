// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import PublisherList from "@/components/PublisherList";
import { publisherList } from "@/services/discovery";
import Error from "@/app/error";
import LoadingContainer from "@/components/LoadingContainer";
import { AxiosError } from "axios";
import { RetrievedPublisher } from "@/services/discovery/types/dataset.types";

type Status = "loading" | "error" | "success";

interface PublisherResponse {
  status: Status;
  publishers?: RetrievedPublisher[];
  errorCode?: number;
}

const PublishersPage = () => {
  const [response, setResponse] = useState<PublisherResponse>({
    status: "loading",
  });

  useEffect(() => {
    async function fetchPublishers() {
      try {
        setResponse({ status: "loading" });
        const response = await publisherList();
        setResponse({
          publishers: response.data,
          status: "success",
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          setResponse({
            status: "error",
            errorCode: error.response?.status,
          });
          console.error(error);
        } else {
          setResponse({ status: "error", errorCode: 500 });
          console.error(error);
        }
      }
    }
    fetchPublishers();
  }, []);

  if (response.status === "loading") {
    return (
      <LoadingContainer
        text="Retrieving publishers. This may take a few moments."
        className="mt-4 px-4 text-center sm:mt-8 sm:px-8"
      />
    );
  }

  if (response.status === "error") {
    return <Error statusCode={response.errorCode} />;
  }

  const publishers = response.publishers ?? [];

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
      {publishers.length > 0 ? (
        <PublisherList publishers={publishers} />
      ) : (
        <p className="text-center text-sm text-info">No publishers found.</p>
      )}
    </PageContainer>
  );
};

export default PublishersPage;
