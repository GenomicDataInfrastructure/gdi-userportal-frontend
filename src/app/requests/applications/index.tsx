// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Error from "@/app/error";
import Button from "@/components/Button";
import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import ListContainer from "@/components/ListContainer";
import PageHeading from "@/components/PageHeading";
import { listApplications } from "@/services/daam/index.client";
import { ListedApplication } from "@/types/application.types";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Status } from "@/utils/pageStatus.types";
import LoadingContainer from "@/components/LoadingContainer";
import { ErrorResponse } from "@/types/api.types";
import axios from "axios";
import ApplicationCard from "./ApplicationCard";

interface ApplicationResponse {
  status: Status;
  applications?: ListedApplication[];
  error?: ErrorResponse;
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
        text="Retrieving applications..."
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
      <PageHeading className="mb-4">Manage your Applications</PageHeading>
      <span>View and update your submitted applications</span>
      <ListContainer>
        {response.applications?.length && response.applications.length > 0 ? (
          <List>
            {response.applications?.map((item) => (
              <ListItem
                key={item.id}
                className="bg-white mb-4 flex items-center justify-center px-2 rounded-lg  shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50"
              >
                <ApplicationCard application={item} />
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
    </div>
  );
};

export default ApplicationsPage;
