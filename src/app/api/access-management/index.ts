// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import {
  SaveDUOCode,
  SaveForm,
  ValidationWarning,
} from "@/app/api/access-management/open-api/schemas";
import { accessManagementClient } from "@/app/api/shared/client";
import { createHeaders } from "@/app/api/shared/headers";
import { AxiosError, isAxiosError } from "axios";
import { ZodError } from "zod";

export const createApplicationApi = async (createApplicationCommand: {
  datasetIds: string[];
}) => {
  const headers = await createHeaders();
  const { applicationId } = await accessManagementClient.create_application_v1(
    createApplicationCommand,
    { headers }
  );
  return applicationId;
};

export const listApplicationsApi = async () => {
  const headers = await createHeaders();
  return await accessManagementClient.list_applications_v1({
    headers,
  });
};

export const retrieveApplicationApi = async (applicationId: number) => {
  const headers = await createHeaders();
  return await accessManagementClient.retrieve_application_v1({
    params: { id: applicationId },
    headers,
  });
};

export const deleteApplicationApi = async (applicationId: number) => {
  const headers = await createHeaders();
  await accessManagementClient.delete_application_v1(undefined, {
    params: { id: applicationId },
    headers,
  });
};

export const addAttachmentToApplicationApi = async (
  applicationId: number,
  attachment: FormData
) => {
  const headers = await createHeaders();
  delete headers["Content-Type"];

  const { id } = await accessManagementClient.add_attachment_to_application_v1(
    { file: attachment.get("file") as File },
    {
      params: { id: applicationId },
      headers,
    }
  );

  return id;
};

export const acceptApplicationTermsApi = async (
  applicationId: number,
  acceptTermsCommand: { acceptedLicenses: number[] }
) => {
  const headers = await createHeaders();
  await accessManagementClient.accept_application_terms_v1(acceptTermsCommand, {
    params: { id: applicationId },
    headers,
  });
};

export const saveFormsAndDuosApi = async (
  applicationId: number,
  forms: SaveForm[],
  duoCodes: SaveDUOCode[]
) => {
  const headers = await createHeaders();
  await accessManagementClient.save_application_forms_and_duos_v1(
    { forms, duoCodes },
    { params: { id: applicationId }, headers }
  );
};

export const submitApplicationApi = async (applicationId: number) => {
  try {
    const headers = await createHeaders();
    await accessManagementClient.submit_application_v1(undefined, {
      params: { id: applicationId },
      headers,
    });
    return { ok: true, response: null };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      const errorData = error.response.data;
      if (errorData.validationWarnings) {
        errorData.validationWarnings = errorData.validationWarnings.map(
          (warning: ValidationWarning) => ({
            ...warning,
            key: warning.key.split("/").pop(),
          })
        );
      }

      return {
        ok: false,
        response: {
          status: error.response.status,
          headers: { "Content-Type": "application/json" },
          data: errorData,
        },
      };
    }

    return {
      ok: false,
      response: {
        status: 500,
        headers: { "Content-Type": "application/json" },
        data: {
          title: "Error",
          detail:
            error instanceof Error
              ? error.message
              : "Failed to submit application",
          status: 500,
        },
      },
    };
  }
};

export const retrieveEntitlementsApi = async () => {
  const headers = await createHeaders();
  return accessManagementClient.retrieve_granted_dataset_identifiers({
    headers,
  });
};

export const inviteMemberApi = async (
  applicationId: number,
  { name, email }: { name: string; email: string }
) => {
  const headers = await createHeaders();

  try {
    await accessManagementClient.invite_member_to_application_v1(
      { name, email },
      { params: { id: applicationId }, headers }
    );
  } catch (error: AxiosError | unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.detail);
    } else if ((error as { cause: unknown }).cause instanceof ZodError) {
      const { cause } = error as { cause: ZodError };

      const message = cause.errors.reduce((acc, curr) => {
        acc += `Field ${curr.path.join(", ")}: ${curr.message} \n`;
        return acc;
      }, "");

      throw new Error(message);
    } else {
      throw new Error("Failed to invite member");
    }
  }
};
