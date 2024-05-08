// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import DatasetList from "@/app/requests/applications/DatasetList";
import { SidebarItem, createTextItem } from "@/components/Sidebar";
import { RetrievedApplication } from "@/types/application.types";
import { formatApplicationProp } from "@/utils/application";
import { formatDateTime } from "@/utils/formatDate";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function createApplicationSidebarItems(
  application: RetrievedApplication,
): SidebarItem[] {
  const { datasets, applicant, events } = application;

  return [
    {
      label: "Datasets",
      value: <DatasetList datasets={datasets} />,
    },
    {
      label: "Participants",
      value: createTextItem(applicant.name),
    },
    {
      label: "Events",
      value: (
        <ul>
          {events.map((event, index) => (
            <li key={index} className="mb-2">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faHistory} className="mr-2 text-sm" />
                {formatApplicationProp(event?.eventType)}
              </div>
              <div className="text-xs md:text-sm">
                at{" "}
                <span className="font-date text-info">
                  {formatDateTime(event.eventTime.toString())}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ),
    },
  ];
}

export { createApplicationSidebarItems };
