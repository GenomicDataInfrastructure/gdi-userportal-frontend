// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { createTextItem, SidebarItem } from "@/components/Sidebar";
import { formatApplicationProp } from "@/utils/application";
import { formatDateTime } from "@/utils/formatDate";
import {
  faDatabase,
  faHistory,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TermsAcceptance from "./TermsAcceptance";
import { getLabelName } from "@/utils/getLabelName";
import { RetrievedApplication } from "@/app/api/access-management/open-api/schemas";
import AddParticipantForm from "./AddParticipantForm";
import contentConfig from "@/config/contentConfig";

export function createApplicationSidebarItems(
  application: RetrievedApplication
): SidebarItem[] {
  const { datasets, applicant, events, members } = application;

  return [
    {
      label: "Datasets",
      value: datasets!.map((dataset, index) => (
        <span
          className="mb-3 flex items-center gap-x-6"
          key={`${dataset.id}-${index}`}
        >
          <FontAwesomeIcon icon={faDatabase} className="text-primary" />
          <p className="break-words">{getLabelName(dataset.title!)}</p>
        </span>
      )),
    },
    {
      label: "Participants",
      value: (
        <>
          <div className="mb-6">
            <div className="flex gap-6 items-center">
              <FontAwesomeIcon icon={faUser} className="text-primary" />
              <p>{createTextItem(applicant!.name!)}</p>
            </div>
            {members!.map((member, index) => (
              <div className="flex gap-6 items-center" key={index}>
                <FontAwesomeIcon icon={faUser} className="text-primary" />
                <p>{createTextItem(member!.name!)}</p>
              </div>
            ))}
          </div>
          {contentConfig.addParticipantsEnabled && (
            <AddParticipantForm application={application} />
          )}
        </>
      ),
    },
    {
      label: "Events",
      value: (
        <ul>
          {events!.slice(0, 5).map((event, index) => (
            <li key={index} className="mb-2">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faHistory} className="mr-6 text-sm" />
                <div>
                  {formatApplicationProp(event!.eventType!)}
                  <div className="text-xs md:text-sm">
                    at{" "}
                    <span className="font-date text-info">
                      {formatDateTime(event.eventTime!.toString())}
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
