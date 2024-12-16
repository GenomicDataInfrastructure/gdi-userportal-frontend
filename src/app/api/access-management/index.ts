// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import {
  SaveDUOCode,
  SaveForm,
} from "@/app/api/access-management/open-api/schemas";
import { accessManagementClient } from "@/app/api/shared/client";
import { createHeaders } from "@/app/api/shared/headers";

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
  const headers = await createHeaders();
  await accessManagementClient.submit_application_v1(undefined, {
    params: { id: applicationId },
    headers,
  });
};

export const retrieveEntitlementsApi = async () => {
  const headers = await createHeaders();
  return accessManagementClient.retrieve_granted_dataset_identifiers({
    headers,
  });
};
