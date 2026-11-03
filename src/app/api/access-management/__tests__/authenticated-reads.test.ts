// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import {
  listApplicationsApi,
  deleteApplicationApi,
  addAttachmentToApplicationApi,
  acceptApplicationTermsApi,
  saveFormsAndDuosApi,
  retrieveApplicationApi,
  retrieveEntitlementsApi,
} from "../index";
import { createHeaders } from "@/app/api/shared/headers";
import { accessManagementClient } from "@/app/api/shared/client";
import { retrieveEntitlements } from "@/app/api/ga4gh/entitlements";
import { LsAaiUnauthorizedError } from "@/app/api/ga4gh/errors";

jest.mock("@/app/api/shared/headers", () => ({ createHeaders: jest.fn() }));
jest.mock("@/app/api/shared/client", () => ({
  accessManagementClient: {
    list_applications_v1: jest.fn(),
    retrieve_application_v1: jest.fn(),
    delete_application_v1: jest.fn(),
    add_attachment_to_application_v1: jest.fn(),
    accept_application_terms_v1: jest.fn(),
    save_application_forms_and_duos_v1: jest.fn(),
  },
}));
jest.mock("@/app/api/ga4gh/entitlements", () => ({
  retrieveEntitlements: jest.fn(),
}));
jest.mock("@/app/api/ga4gh/beacon-authorization", () => ({
  checkBeaconAuthorization: jest.fn(),
}));

beforeEach(() => jest.resetAllMocks());

test.each([
  ["application list", () => listApplicationsApi()],
  ["entitlements", () => retrieveEntitlementsApi()],
] as const)(
  "rejects unauthenticated %s reads with the structured unauthorized result",
  async (_, read) => {
    jest
      .mocked(createHeaders)
      .mockResolvedValue({ "Content-Type": "application/json" });
    await expect(read()).resolves.toEqual({ ok: false, status: 401 });
    expect(accessManagementClient.list_applications_v1).not.toHaveBeenCalled();
    expect(
      accessManagementClient.retrieve_application_v1
    ).not.toHaveBeenCalled();
    expect(retrieveEntitlements).not.toHaveBeenCalled();
  }
);

test("authenticated users can read applications and entitlements", async () => {
  const accessToken = "******";
  const headers = { Authorization: `Bearer ${accessToken}` };
  jest.mocked(createHeaders).mockResolvedValue(headers);
  jest.mocked(retrieveEntitlements).mockResolvedValue({
    entitlements: [],
    passportPresent: true,
  });
  await listApplicationsApi();
  await retrieveApplicationApi(123);
  await expect(retrieveEntitlementsApi()).resolves.toEqual({
    ok: true,
    data: { entitlements: [], passportPresent: true },
  });
  expect(accessManagementClient.list_applications_v1).toHaveBeenCalledWith({
    headers,
  });
  expect(accessManagementClient.retrieve_application_v1).toHaveBeenCalledWith({
    params: { id: 123 },
    headers,
  });
  expect(retrieveEntitlements).toHaveBeenCalledWith(accessToken);
});

test("normalizes a 401 from the gateway itself to the structured unauthorized result", async () => {
  jest
    .mocked(createHeaders)
    .mockResolvedValue({ Authorization: "Bearer stale-token" });
  jest.mocked(accessManagementClient.list_applications_v1).mockRejectedValue({
    isAxiosError: true,
    response: { status: 401 },
  });

  await expect(listApplicationsApi()).resolves.toEqual({
    ok: false,
    status: 401,
  });
});

test("normalizes an LS-AAI unauthorized rejection to the structured unauthorized result", async () => {
  jest
    .mocked(createHeaders)
    .mockResolvedValue({ Authorization: "Bearer stale-token" });
  jest
    .mocked(retrieveEntitlements)
    .mockRejectedValue(
      new LsAaiUnauthorizedError("LS-AAI userinfo request failed: 401")
    );

  await expect(retrieveEntitlementsApi()).resolves.toEqual({
    ok: false,
    status: 401,
  });
});

test("preserves unexpected failures for server-side error reporting", async () => {
  jest
    .mocked(createHeaders)
    .mockResolvedValue({ Authorization: "Bearer token" });
  const failure = new Error("private upstream details");
  jest
    .mocked(accessManagementClient.list_applications_v1)
    .mockRejectedValue(failure);
  await expect(listApplicationsApi()).rejects.toBe(failure);
});

test("blocks unauthenticated application details before calling the backend", async () => {
  jest.mocked(createHeaders).mockResolvedValue({});
  await expect(retrieveApplicationApi(123)).resolves.toEqual({
    ok: false,
    status: 401,
  });
  expect(accessManagementClient.retrieve_application_v1).not.toHaveBeenCalled();
});

const applicationActions = [
  [
    "details",
    () => retrieveApplicationApi(123),
    accessManagementClient.retrieve_application_v1,
  ],
  [
    "delete",
    () => deleteApplicationApi(123),
    accessManagementClient.delete_application_v1,
  ],
  [
    "attachment",
    () => addAttachmentToApplicationApi(123, new FormData()),
    accessManagementClient.add_attachment_to_application_v1,
  ],
  [
    "terms",
    () => acceptApplicationTermsApi(123, { acceptedLicenses: [] }),
    accessManagementClient.accept_application_terms_v1,
  ],
  [
    "forms",
    () => saveFormsAndDuosApi(123, [], []),
    accessManagementClient.save_application_forms_and_duos_v1,
  ],
] as const;

test.each(applicationActions)(
  "blocks unauthenticated %s actions before backend access",
  async (_, action, backend) => {
    jest.mocked(createHeaders).mockResolvedValue({});
    await expect(action()).resolves.toEqual({ ok: false, status: 401 });
    expect(backend).not.toHaveBeenCalled();
  }
);

test.each(applicationActions)(
  "serializes expired-session failures from %s actions",
  async (_, action, backend) => {
    jest
      .mocked(createHeaders)
      .mockResolvedValue({ Authorization: "Bearer stale-token" });
    jest
      .mocked(backend)
      .mockRejectedValue({ isAxiosError: true, response: { status: 401 } });
    const result = JSON.parse(JSON.stringify(await action()));
    expect(result).toEqual({ ok: false, status: 401 });
  }
);

test.each(applicationActions)(
  "preserves unexpected %s failures for server reporting",
  async (_, action, backend) => {
    jest
      .mocked(createHeaders)
      .mockResolvedValue({ Authorization: "Bearer token" });
    const failure = new Error("private upstream details");
    jest.mocked(backend).mockRejectedValue(failure);
    await expect(action()).rejects.toBe(failure);
  }
);
