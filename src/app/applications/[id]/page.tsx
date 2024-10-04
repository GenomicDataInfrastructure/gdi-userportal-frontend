// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Error from "@/app/error";
import Alert, { AlertState } from "@/components/Alert";
import Button from "@/components/Button";
import Chip from "@/components/Chip";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { ValidationWarning } from "@/types/api.types";
import { State } from "@/types/application.types";
import {
  formatApplicationProp,
  groupWarningsPerFormId,
  isApplicationEditable,
} from "@/utils/application";
import { formatDateTime } from "@/utils/formatDate";
import { getTranslation } from "@/utils/getTranslation";
import {
  faPaperPlane,
  faSpinner,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormContainer from "./FormContainer";
import { createApplicationSidebarItems } from "./sidebarItems";

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const [alert, setAlert] = useState<AlertState | null>(null);
  const onCloseAlert = () => {
    setAlert(null);
  };

  const {
    application,
    errorResponse,
    deleteApplication,
    submitApplication,
    clearError,
    isLoading,
  } = useApplicationDetails();

  useEffect(() => {
    if (!!errorResponse) {
      setAlert({
        message: errorResponse.detail,
        type: "error",
      });
    } else {
      setAlert(null);
    }
  }, [errorResponse]);

  const handleSubmission = () => {
    onCloseAlert();
    clearError();
    submitApplication();
  };

  const handleDelete = async () => {
    await deleteApplication();
    router.push("/requests?tab=applications");
  };

  if (errorResponse?.status === 404) {
    return <Error statusCode={404} />;
  }

  if (!application) {
    return (
      <PageContainer>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => {
              onCloseAlert();
              clearError();
            }}
            className="mb-8"
          />
        )}
      </PageContainer>
    );
  }

  const events = application.events;
  const lastEvent = events[0];
  const editable = isApplicationEditable(application);
  const isDraft = application.state === State.DRAFT;

  const formWarnings: ValidationWarning[] = [];
  const applicationWarnings: ValidationWarning[] = [];
  errorResponse?.validationWarnings.forEach((it) => {
    if (!it.formId) {
      applicationWarnings.push(it);
    } else {
      formWarnings.push(it);
    }
  });
  const warningsPerForm = groupWarningsPerFormId(formWarnings);
  return (
    <PageContainer>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => {
            onCloseAlert();
            clearError();
          }}
          className="mb-8"
        />
      )}
      <div className="flex flex-col items-start justify-start lg:flex-row">
        <div className="flex w-full flex-col gap-5 lg:w-2/3 lg:px-5">
          <div className="sm:flex sm:justify-between">
            <div className="flex items-center gap-x-4">
              <PageHeading className="text-black">
                Application {application.externalId}
              </PageHeading>
              {application.id && (
                <Chip
                  className="uppercase text-xs lg:text-sm tracking-widest"
                  chip={formatApplicationProp(application.state)!}
                />
              )}
            </div>
            <div className="mt-4 flex gap-x-3 sm:mt-0">
              {isDraft && (
                <Button
                  type="warning"
                  text="Delete"
                  icon={faXmarkCircle}
                  disabled={isLoading}
                  onClick={handleDelete}
                />
              )}
              {editable && (
                <Button
                  type="primary"
                  text="Submit"
                  icon={faPaperPlane}
                  disabled={isLoading}
                  onClick={handleSubmission}
                />
              )}
            </div>
          </div>
          {isLoading ? (
            <div className="gap-x-1 flex items-center">
              {" "}
              <FontAwesomeIcon icon={faSpinner} />{" "}
              <span>Saving Changes...</span>
            </div>
          ) : (
            <p>{`Last Event: ${formatApplicationProp(lastEvent.eventType)} at ${formatDateTime(lastEvent.eventTime.toString())}`}</p>
          )}

          <div className="h-[2px] bg-secondary opacity-80"></div>

          <div className="lg:hidden w-full">
            <Sidebar items={createApplicationSidebarItems(application)} />
          </div>

          <div className="h-[2px] bg-secondary opacity-80 lg:hidden"></div>

          {applicationWarnings.length > 0 && (
            <ul>
              {applicationWarnings.map(
                (warning, index) =>
                  warning && (
                    <li key={index}>
                      <span className="text-red-600 mt-2">
                        {" "}
                        - {getTranslation(warning.key)}
                      </span>
                    </li>
                  )
              )}
            </ul>
          )}

          <ul>
            {application.forms.map(
              (form) =>
                form && (
                  <li key={form.id}>
                    <FormContainer
                      form={form}
                      editable={editable}
                      validationWarnings={warningsPerForm.get(form.id)}
                    />
                  </li>
                )
            )}
          </ul>
        </div>

        <aside className="hidden w-full lg:block lg:w-1/3">
          <Sidebar items={createApplicationSidebarItems(application)} />
        </aside>
      </div>
    </PageContainer>
  );
}
