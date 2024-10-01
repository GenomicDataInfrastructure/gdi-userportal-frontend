// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import DatasetList from "@/app/requests/applications/DatasetList";
import { createTextItem, SidebarItem } from "@/components/Sidebar";
import { RetrievedApplication } from "@/types/application.types";
import { formatApplicationProp } from "@/utils/application";
import { formatDateTime } from "@/utils/formatDate";
import { faHistory, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TermsAcceptance from "./TermsAcceptance";

export function createApplicationSidebarItems(
  application: RetrievedApplication
): SidebarItem[] {
  const { datasets, applicant, events } = application;

  return [
    {
      label: "Datasets",
      value: <DatasetList datasets={datasets} />,
    },
    {
      label: "Participants",
      value: (
        <div className="flex gap-6 items-center">
          <FontAwesomeIcon icon={faUser} className="text-primary" />
          <p>{createTextItem(applicant.name)}</p>
        </div>
      ),
    },
    {
      label: "Events",
      value: (
        <ul>
          {events.slice(0, 5).map((event, index) => (
            <li key={index} className="mb-2">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faHistory} className="mr-6 text-sm" />
                <div>
                  {formatApplicationProp(event?.eventType)}
                  <div className="text-xs md:text-sm">
                    at{" "}
                    <span className="font-date text-info">
                      {formatDateTime(event.eventTime.toString())}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Terms & Conditions",
      value: <TermsAcceptance />,
    },
  ];
}
