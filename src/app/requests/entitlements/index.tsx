// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import ListContainer from "@/components/ListContainer";
import PageHeading from "@/components/PageHeading";
import { useEffect, useState } from "react";
import { Status } from "@/utils/pageStatus.types";
import { createDatasetEntitlements } from "@/utils/datasetEntitlements";
import EntitlementsList from "./EntitlementsList";
import LoadingContainer from "@/components/LoadingContainer";
import Error from "@/app/error";
import axios from "axios";
import { EmptyEntitlements } from "./EmptyEntitlements";
import { retrieveEntitlementsApi } from "../../api/access-management";
import { ErrorResponse } from "@/app/api/access-management/open-api/schemas";
import { DatasetEntitlement } from "@/app/api/access-management/additional-types";

interface EntitlementsResponse {
  datasetEntitlements?: DatasetEntitlement[];
  error?: ErrorResponse;
  status: Status;
}

function EntitlementsPage() {
  const [response, setResponse] = useState<EntitlementsResponse>({
    status: "loading",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { entitlements } = await retrieveEntitlementsApi();

        const datasetEntitlements =
          await createDatasetEntitlements(entitlements);

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

  const hasEntitlements =
    response.datasetEntitlements?.length &&
    response.datasetEntitlements.length > 0;

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
    <div className="pt-5 md:pt-10">
      <PageHeading className="mb-4">Entitlements</PageHeading>
      <span>View your entitlements</span>
      <ListContainer>
        {hasEntitlements ? (
          <EntitlementsList entitlements={response.datasetEntitlements ?? []} />
        ) : (
          <EmptyEntitlements />
        )}
      </ListContainer>
    </div>
  );
}

export default EntitlementsPage;
