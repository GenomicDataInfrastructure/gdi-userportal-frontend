// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/PageContainer";
import OrganizationList from "@/components/OrganizationList";
import { organizationList } from "@/services/discovery";
import Error from "@/app/error";
import LoadingContainer from "@/components/LoadingContainer";
import { AxiosError } from "axios";
import { RetrievedOrganization } from "@/services/discovery/types/dataset.types";

type Status = "loading" | "error" | "success";

interface OrganizationResponse {
  status: Status;
  organizations?: RetrievedOrganization[];
  errorCode?: number;
}

const OrganizationsPage = () => {
  const [response, setResponse] = useState<OrganizationResponse>({
    status: "loading",
  });

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        setResponse({ status: "loading" });
        const response = await organizationList();
        setResponse({
          organizations: response.data,
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
    fetchOrganizations();
  }, []);

  if (response.status === "loading") {
    return (
      <LoadingContainer
        text="Retrieving organizations. This may take a few moments."
        className="mt-4 px-4 text-center sm:mt-8 sm:px-8"
      />
    );
  }

  if (response.status === "error") {
    return <Error statusCode={response.errorCode} />;
  }

  const organizations = response.organizations ?? [];

  return (
    <PageContainer className="container mx-auto px-8 pt-5">
      <div className="my-8">
        <h1 className="text-left font-bold text-4xl text-primary">
          {organizations.length} Organizations
        </h1>
      </div>
      {organizations.length > 0 ? (
        <OrganizationList organizations={organizations} />
      ) : (
        <p className="text-center text-sm text-info">No organizations found.</p>
      )}
    </PageContainer>
  );
};

export default OrganizationsPage;
