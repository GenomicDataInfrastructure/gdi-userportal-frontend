// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SidebarItem } from "@/components/Sidebar";

type ContactPoint = {
  name?: string;
  email?: string;
};

export type ContactPointsSidebarTranslations = {
  contactPoints: string;
  noContactProvided: string;
  noEmailProvided: string;
};

export function createContactPointsSidebarItem(
  contacts: ContactPoint[] | undefined,
  t: ContactPointsSidebarTranslations
): SidebarItem {
  return {
    label: t.contactPoints,
    value: (
      <div className="flex items-center text-[14px]">
        <div className="flex flex-col gap-1">
          {!contacts?.length ? (
            <>
              <div className="flex gap-8 items-center">
                <FontAwesomeIcon icon={faUser} className="text-primary" />
                <p>{t.noContactProvided}</p>
              </div>
              <div className="flex gap-8 items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                <p>{t.noEmailProvided}</p>
              </div>
            </>
          ) : (
            contacts.map((contact, index) => (
              <div key={index}>
                <div className="flex gap-8 items-center">
                  <FontAwesomeIcon icon={faUser} className="text-primary" />
                  <p>{contact.name || t.noContactProvided}</p>
                </div>
                <div className="flex gap-8 items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                  <p>{contact.email || t.noEmailProvided}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    ),
  };
}
