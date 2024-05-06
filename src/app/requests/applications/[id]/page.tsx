// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from "react";
import Alert, { AlertState } from "@/components/Alert";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import Chip from "@/components/Chip";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import {
  formatApplicationProp,
  isApplicationEditable,
} from "@/utils/application";
import { formatDateTime } from "@/utils/formatDate";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import FormContainer from "./FormContainer";
import { createApplicationSidebarItems } from "./sidebarItems";

export default function ApplicationDetailsPage() {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const onCloseAlert = () => {
    setAlert(null);
  };

  const { application, submitApplication, error } = useApplicationDetails();

  useEffect(() => {
    if (error) {
      setAlert({
        message: error,
        type: "error",
      });
    }
  }, [error]);

  if (!application) return;

  const events = application.events;
  const lastEvent = events[0];
  const sidebarItems = createApplicationSidebarItems(application);

  return (
    <PageContainer>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={onCloseAlert}
          className="mb-8"
        />
      )}
      <div className="flex flex-col items-start justify-start lg:flex-row">
        <div className="flex w-full flex-col gap-5 lg:w-2/3 lg:px-5">
          <div className="sm:flex sm:justify-between">
            <div className="flex items-center gap-x-4">
              <PageHeading>Application {application.externalId}</PageHeading>
              {application.id && (
                <Chip chip={formatApplicationProp(application.state)!} />
              )}
            </div>
            <div className="mt-4 flex gap-x-3 sm:mt-0">
              {isApplicationEditable(application) && (
                <Button
                  type="primary"
                  text="Submit"
                  icon={faPaperPlane}
                  onClick={submitApplication}
                />
              )}
            </div>
          </div>
          <p>{`Last Event: ${formatApplicationProp(lastEvent.eventType)} at ${formatDateTime(lastEvent.eventTime.toString())}`}</p>
          <div>
            <div className="h-[2px] bg-secondary opacity-80"></div>

            <div className="my-8 w-full lg:hidden">
              <Sidebar items={sidebarItems} />
            </div>

            <div className="mt-5 h-[2px] bg-secondary opacity-80 lg:hidden"></div>
            <ul>
              {application.forms.map(
                (form) =>
                  form && (
                    <li key={form.id}>
                      <FormContainer form={form} />
                    </li>
                  ),
              )}
            </ul>
          </div>
        </div>

        <aside className="hidden w-full lg:block lg:w-1/3">
          <Sidebar items={sidebarItems} />
        </aside>
      </div>
    </PageContainer>
  );
}
