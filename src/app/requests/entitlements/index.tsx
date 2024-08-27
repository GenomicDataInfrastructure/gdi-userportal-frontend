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
import { ErrorResponse } from "@/types/api.types";
import axios from "axios";

interface EntitelementsResponse {
  datasetEntitlements?: DatasetEntitlement[];
  error?: ErrorResponse;
  status: Status;
}

function EntitelementsPage() {
  const [response, setResponse] = useState<EntitelementsResponse>({
    status: "loading",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await retrieveEntitlements();

        const datasetEntitlements = await createDatasetEntitlements(
          response.data.entitlements
        );

        setResponse({
          datasetEntitlements: datasetEntitlements,
          status: "success",
        });
      } catch (error) {
        console.error(error);

        let errorResponse;
        if (axios.isAxiosError(error)) {
          errorResponse = error.response!.data;
        }

        setResponse({
          status: "error",
          error: errorResponse,
        });
      }
    }
    fetchData().catch((it) => console.log(it));
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
        statusCode={response.error.status}
        errorTitle={response.error.title}
        errorDetail={response.error.detail}
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
