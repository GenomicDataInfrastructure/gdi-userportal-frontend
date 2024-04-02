// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { listApplications } from "@/services/daam/index.client";
import React, { useEffect, useState } from "react";
import ApplicationItem from "./applicationItem";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import CenteredListContainer from "@/components/CenteredListContainer";
import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import { ListedApplication } from "@/types/application.types";

const ApplicationsPage: React.FC = () => {
  const [data, setData] = useState<ListedApplication[]>([]);
  const collapseLimit = 2;

  useEffect(() => {
    listApplications().then((res) => setData(res.data));
  }, []);

  const collapsable = data.length > collapseLimit;

  return (
    <PageContainer>
      <PageHeading className="mb-4">Manage your Applications</PageHeading>
      <span>View and update your submited applications</span>

      <CenteredListContainer>
        <List>
          {data.map((item) => (
            <ListItem
              key={item.id}
              className="flex items-center justify-between"
            >
              <ApplicationItem application={item} collapsable={collapsable} />
            </ListItem>
          ))}
        </List>
      </CenteredListContainer>
    </PageContainer>
  );
};

export default ApplicationsPage;
