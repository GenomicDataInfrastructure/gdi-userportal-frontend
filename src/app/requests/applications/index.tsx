// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Error from "@/app/error";
import Button from "@/components/Button";
import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import ListContainer from "@/components/ListContainer";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import { listApplications } from "@/services/daam/index.client";
import { ListedApplication } from "@/types/application.types";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import ApplicationItem from "./ApplicationItem";

type Status = "loading" | "error" | "success";

interface ApplicationResponse {
  status: Status;
  applications?: ListedApplication[];
  errorCode?: number;
}

const ApplicationsPage: React.FC = () => {
  const [response, setResponse] = useState<ApplicationResponse>({
    status: "loading",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await listApplications();
        setResponse({ applications: response.data, status: "success" });
      } catch (error) {
        if (error instanceof AxiosError) {
          setResponse({ status: "error", errorCode: error.response?.status });
          console.error(error);
        } else {
          setResponse({ status: "error", errorCode: 500 });
          console.error(error);
        }
      }
    }
    fetchData();
  }, []);

  if (response.status === "error") {
    return <Error statusCode={response.errorCode} />;
  }

  return (
    <PageContainer className="pt-5 md:pt-10">
      <PageHeading className="mb-4">Manage your Applications</PageHeading>
      <span>View and update your submited applications</span>
      <ListContainer>
        {response.applications?.length && response.applications.length > 0 ? (
          <List>
            {response.applications?.map((item, index) => (
              <ListItem
                key={item.id}
                className="flex items-center justify-between"
              >
                <ApplicationItem application={item} isExpanded={index === 0} />
              </ListItem>
            ))}
          </List>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <p className="text-md text-center text-primary">
              You don&apos;t have any applications yet.
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
};

export default ApplicationsPage;
