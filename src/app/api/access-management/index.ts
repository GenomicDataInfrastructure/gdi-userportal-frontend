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
import { AxiosError, AxiosHeaders, isAxiosError } from "axios";
import { ZodError } from "zod";
import { LsAaiUnauthorizedError } from "@/app/api/ga4gh/errors";
import { retrieveEntitlements } from "@/app/api/ga4gh/entitlements";
import { checkBeaconAuthorization } from "@/app/api/ga4gh/beacon-authorization";

// Return expected failures as plain data: production sanitizes thrown errors.
function toAccessManagementFailure(error: unknown) {
  const unauthorized =
    (isAxiosError(error) && error.response?.status === 401) ||
    error instanceof LsAaiUnauthorizedError;
  if (unauthorized) {
    return { ok: false as const, status: 401 as const };
  }
  // Unexpected failures must remain visible in server logs. Next.js hides
  // their details from production clients, which show the generic error UI.
  throw error;
}

const unauthorizedResponse = {
  status: 401,
  statusText: "Unauthorized",
  config: { headers: new AxiosHeaders() },
  headers: { "Content-Type": "application/json" },
  data: {
    title: "Unauthorized",
    detail: "Log in before requesting dataset access.",
    status: 401,
  },
} as const;

function createUnauthorizedError() {
  return new AxiosError(
    unauthorizedResponse.data.detail,
    "ERR_UNAUTHORIZED",
    undefined,
    undefined,
    unauthorizedResponse
  );
}

function getBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader) {
    return null;
  }
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
}

const forbiddenApplicationResponse = {
  status: 403,
  headers: { "Content-Type": "application/json" },
  data: {
    title: "Application requirements not met",
    detail:
      "Active Researcher status and acceptance of the Terms & Conditions are required to apply for dataset access.",
    status: 403,
  },
} as const;

async function canApplyForDatasetAccess(): Promise<boolean> {
  const { hasResearcherStatus, hasAcceptedTC } = await checkBeaconAuthorization(
    { refresh: true }
  );
  return hasResearcherStatus && hasAcceptedTC;
}

export const createApplicationApi = async (createApplicationCommand: {
  datasetIds: string[];
}) => {
  try {
    const headers = await createHeaders();
    if (!headers.Authorization) {
      return {
        ok: false as const,
        response: unauthorizedResponse,
      };
    }
    if (!(await canApplyForDatasetAccess())) {
      return {
        ok: false as const,
        response: forbiddenApplicationResponse,
      };
    }
    const { applicationId } =
      await accessManagementClient.create_application_v1(
        createApplicationCommand,
        { headers }
      );
    return { ok: true as const, applicationId, response: null };
  } catch (error) {
    const status = isAxiosError(error) ? (error.response?.status ?? 500) : 500;
    const data = isAxiosError(error) ? error.response?.data : undefined;
    return {
      ok: false as const,
      response: {
        status,
        headers: { "Content-Type": "application/json" },
        data: {
          title: typeof data?.title === "string" ? data.title : "Error",
          detail:
            typeof data?.detail === "string"
              ? data.detail
              : "Failed to create application",
          status,
        },
      },
    };
  }
};

export const listApplicationsApi = async () => {
  try {
    const headers = await requireAuthenticatedHeaders();
    const data = await accessManagementClient.list_applications_v1({ headers });
    return { ok: true as const, data };
  } catch (error) {
    return toAccessManagementFailure(error);
  }
};

export const retrieveApplicationApi = async (applicationId: number) => {
  try {
    const headers = await requireAuthenticatedHeaders();
    const data = await accessManagementClient.retrieve_application_v1({
      params: { id: applicationId },
      headers,
    });
    return { ok: true as const, data };
  } catch (error) {
    return toAccessManagementFailure(error);
  }
};

export const deleteApplicationApi = async (applicationId: number) => {
  try {
    const headers = await requireAuthenticatedHeaders();
    await accessManagementClient.delete_application_v1(undefined, {
      params: { id: applicationId },
      headers,
    });
    return { ok: true as const };
  } catch (error) {
    return toAccessManagementFailure(error);
  }
};

export const addAttachmentToApplicationApi = async (
  applicationId: number,
  attachment: FormData
) => {
  try {
    const headers = await requireAuthenticatedHeaders();
    delete headers["Content-Type"];

    const { id } =
      await accessManagementClient.add_attachment_to_application_v1(
        { file: attachment.get("file") as File },
        {
          params: { id: applicationId },
          headers,
        }
      );

    return { ok: true as const, data: id };
  } catch (error) {
    return toAccessManagementFailure(error);
  }
};

export const acceptApplicationTermsApi = async (
  applicationId: number,
  acceptTermsCommand: { acceptedLicenses: number[] }
) => {
  try {
    const headers = await requireAuthenticatedHeaders();
    await accessManagementClient.accept_application_terms_v1(
      acceptTermsCommand,
      {
        params: { id: applicationId },
        headers,
      }
    );
    return { ok: true as const };
  } catch (error) {
    return toAccessManagementFailure(error);
  }
};

export const saveFormsAndDuosApi = async (
  applicationId: number,
  forms: SaveForm[],
  duoCodes: SaveDUOCode[]
) => {
  try {
    const headers = await requireAuthenticatedHeaders();
    await accessManagementClient.save_application_forms_and_duos_v1(
      { forms, duoCodes },
      { params: { id: applicationId }, headers }
    );
    return { ok: true as const };
  } catch (error) {
    return toAccessManagementFailure(error);
  }
};

export const submitApplicationApi = async (applicationId: number) => {
  try {
    const headers = await createHeaders();
    if (!headers.Authorization) {
      return { ok: false as const, response: unauthorizedResponse };
    }
    if (!(await canApplyForDatasetAccess())) {
      return {
        ok: false as const,
        response: forbiddenApplicationResponse,
      };
    }
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
  try {
    const headers = await requireAuthenticatedHeaders();
    const data = await retrieveEntitlements(
      getBearerToken(headers.Authorization)
    );
    return { ok: true as const, data };
  } catch (error) {
    return toAccessManagementFailure(error);
  }
};

async function requireAuthenticatedHeaders(): Promise<Record<string, string>> {
  const headers = await createHeaders();
  if (!headers.Authorization) {
    throw createUnauthorizedError();
  }
  return headers;
}

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
