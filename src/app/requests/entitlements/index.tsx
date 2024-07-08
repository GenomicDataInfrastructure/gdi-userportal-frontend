// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import List from "@/components/List";
import ListContainer from "@/components/ListContainer";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import { useEffect, useState } from "react";
import { Status } from "@/utils/pageStatus.types";
import { retrieveEntitlements } from "@/services/daam/index.client";
import { DatasetEntitlement } from "@/services/discovery/types/dataset.types";
import { createDatasetEntitlements } from "@/utils/datasetEntitlements";
import EntitlementsList from "./EntitlementsList";
import LoadingContainer from "@/components/LoadingContainer";
import Error from "@/app/error";
import { isErrorResponse, ErrorResponse } from "@/utils/ErrorResponse";

interface EntitelementsResponse {
  datasetEntitlements?: DatasetEntitlement[];
  error?: ErrorResponse;
  status: Status;
}

const mockEntitlements: DatasetEntitlement[] = [
  {
    dataset: {
      id: "dataset1",
      title: "Dataset 1",
      description: "Description for Dataset 1",
      catalogue: "catalogue1",
      modifiedAt: "2023-12-31",
      createdAt: "2023-01-01",
      themes: [
        {
          label: "Theme 1",
          value: "",
        },
        {
          label: "Theme 2",
          value: "",
        },
      ],
      // other properties of the dataset
    },
    start: "2024-01-01",
    end: "2024-12-31",
  },
  {
    dataset: {
      id: "dataset2",
      title: "Dataset 2",
      description: "Description for Dataset 2",
      catalogue: "catalogue1",
      modifiedAt: "2023-12-31",
      createdAt: "2023-01-01",
      // other properties of the dataset
    },
    start: "2024-02-01",
    end: "2024-11-30",
  },
  {
    dataset: {
      id: "dataset3",
      title: "Dataset 3",
      description: "Description for Dataset 3",
      catalogue: "catalogue1",
      modifiedAt: "2023-12-31",
      createdAt: "2023-01-01",
      // other properties of the dataset
    },
    start: "2024-03-01",
    end: "2024-10-31",
  },
];

function EntitelementsPage() {
  const [response, setResponse] = useState<EntitelementsResponse>({
    status: "loading",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulating a delay to see the loading state
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Commenting out the real API call for now
        // const entitlements = await retrieveEntitlements();

        // const datasetEntitlements = await createDatasetEntitlements(
        //   entitlements.data.entitlements,
        // );

        setResponse({
          datasetEntitlements: mockEntitlements,
          status: "success",
        });
      } catch (error) {
        if (isErrorResponse(error)) {
          setResponse({ status: "error", error: error });
          console.error(error);
        } else {
          setResponse({ status: "error" });
          console.error(error);
        }
      }
    }
    fetchData();
  }, []);

  if (response.status === "loading") {
    return (
      <LoadingContainer
        text="Retrieving entitlements..."
        className="text-center"
      />
    );
  } else if (response.status === "error" && response.error) {
    return (
      <Error
        statusCode={response.error.response.status}
        errorTitle={response.error.response.data.title}
        errorDetail={response.error.response.data.detail}
      />
    );
  } else if (response.status === "error") {
    return <Error statusCode={500} />;
  }

  return (
    <PageContainer className="pt-5 md:pt-10">
      <PageHeading className="mb-4">Entitlements</PageHeading>
      <p>You have been granted these entitlements.</p>
      <ListContainer>
        <List>
          <EntitlementsList entitlements={response.datasetEntitlements ?? []} />
        </List>
      </ListContainer>
    </PageContainer>
  );
}

export default EntitelementsPage;
