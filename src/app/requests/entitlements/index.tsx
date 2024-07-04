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

function EntitelementsPage() {
  const [response, setResponse] = useState<EntitelementsResponse>({
    status: "loading",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const entitlements = await retrieveEntitlements();

        const datasetEntitlements = await createDatasetEntitlements(
          entitlements.data.entitlements,
        );

        setResponse({
          datasetEntitlements: datasetEntitlements,
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
