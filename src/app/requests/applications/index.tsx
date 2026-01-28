// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Error from "@/app/error";
import Button from "@/components/Button";
import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import ListContainer from "@/components/ListContainer";
import PageHeading from "@/components/PageHeading";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { Status } from "@/utils/pageStatus.types";
import LoadingContainer from "@/components/LoadingContainer";
import axios from "axios";
import ApplicationCard from "./ApplicationCard";
// import { listApplicationsApi } from "../../api/access-management";
import { listApplicationsApi } from "../../api/access-management-v1/index";
import {
  ErrorResponse,
  ListedApplication,
} from "@/app/api/access-management/open-api/schemas";

interface ApplicationResponse {
  status: Status;
  applications?: ListedApplication[];
  error?: ErrorResponse;
}

const ApplicationsPage: React.FC = () => {
  const [response, setResponse] = useState<ApplicationResponse>({
    status: "loading",
  });

  const fetchApplications = async () => {
    setResponse({ status: "loading" });
    try {
      const applications = await listApplicationsApi();
      console.log("Applications fetched:", applications);
      setResponse({ applications, status: "success" });
    } catch (error) {
      console.error(error);
      setResponse({
        status: "error",
        error: axios.isAxiosError(error) ? error.response!.data : undefined,
      });
    }
  };

  useEffect(() => {
    fetchApplications().catch((error) => console.log(error));
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
