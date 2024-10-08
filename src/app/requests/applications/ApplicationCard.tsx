// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { ListedApplication } from "@/types/application.types";
import Card from "@/components/Card";
import { createApplicationCardItems } from "./applicationCardItems";

export default function ApplicationCard({
  application,
}: Readonly<{
  application: ListedApplication;
}>) {
  return (
    <Card
      url={`/applications/${application.id}`}
      title={application.title}
      subTitles={[application.currentState.split("/").pop() || ""]}
      description={application.description}
      cardItems={createApplicationCardItems(application)}
    />
  );
}
