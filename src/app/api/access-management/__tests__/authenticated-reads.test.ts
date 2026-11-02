// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import {
  listApplicationsApi,
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
  await expect(retrieveApplicationApi(123)).rejects.toMatchObject({
    response: { status: 401 },
  });
  expect(accessManagementClient.retrieve_application_v1).not.toHaveBeenCalled();
});
