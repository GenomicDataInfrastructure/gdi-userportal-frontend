// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

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
import Button from "@/components/Button";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

interface EntitelementsResponse {
  datasetEntitlements?: DatasetEntitlement[];
  error?: ErrorResponse;
  status: Status;
}

function EntitlementsPage() {
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
      <span>View your entitlements</span>
      <ListContainer>
        {response.datasetEntitlements?.length &&
        response.datasetEntitlements.length > 0 ? (
          <EntitlementsList entitlements={response.datasetEntitlements ?? []} />
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <p className="text-md text-center text-primary">
              <span>You don&apos;t have any entitlement yet.</span>
              <br />
              <span>
                Wait for your application(s) to be approved, or submit a new
                application.
              </span>
            </p>
            <Button
              icon={faPlusCircle}
              text="Add datasets"
              href="/datasets"
              type="primary"
              className="text-xs"
            />
          </div>
        )}
      </ListContainer>
    </PageContainer>
  );
}

export default EntitlementsPage;
