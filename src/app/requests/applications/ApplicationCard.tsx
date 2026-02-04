// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Card from "@/components/Card";
import { createApplicationCardItems } from "./applicationCardItems";
import { ListedApplication } from "@/app/api/access-management/open-api/schemas";

export default function ApplicationCard({
  application,
}: Readonly<{
  application: ListedApplication;
}>) {
  return (
    <Card
      url={`/applications/new?id=${application.id}`}
      title={application.title!}
      subTitles={[application.currentState!.split("/").pop() || ""]}
      description={application.description!}
      cardItems={createApplicationCardItems(application)}
    />
  );
}
