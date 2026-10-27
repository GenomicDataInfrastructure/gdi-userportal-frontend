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
  ["application detail", () => retrieveApplicationApi(123)],
  ["entitlements", () => retrieveEntitlementsApi()],
] as const)(
  "rejects unauthenticated %s reads before accessing data",
  async (_, read) => {
    jest
      .mocked(createHeaders)
      .mockResolvedValue({ "Content-Type": "application/json" });
    await expect(read()).rejects.toThrow("Log in");
    expect(accessManagementClient.list_applications_v1).not.toHaveBeenCalled();
    expect(
      accessManagementClient.retrieve_application_v1
    ).not.toHaveBeenCalled();
    expect(retrieveEntitlements).not.toHaveBeenCalled();
  }
);

test("authenticated users can read applications and entitlements", async () => {
  const headers = { Authorization: "Bearer test-token" };
  jest.mocked(createHeaders).mockResolvedValue(headers);
  jest.mocked(retrieveEntitlements).mockResolvedValue({
    entitlements: [],
    passportPresent: true,
  });
  await listApplicationsApi();
  await retrieveApplicationApi(123);
  await expect(retrieveEntitlementsApi()).resolves.toEqual({
    entitlements: [],
    passportPresent: true,
  });
  expect(accessManagementClient.list_applications_v1).toHaveBeenCalledWith({
    headers,
  });
  expect(accessManagementClient.retrieve_application_v1).toHaveBeenCalledWith({
    params: { id: 123 },
    headers,
  });
});
