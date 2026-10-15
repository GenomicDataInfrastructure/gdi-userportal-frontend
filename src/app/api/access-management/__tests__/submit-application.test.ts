// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AxiosMockAdapter from "axios-mock-adapter";
import { accessManagementAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import { submitApplicationApi } from "@/app/api/access-management";
import { checkBeaconAuthorization } from "@/app/api/ga4gh/beacon-authorization";

jest.mock("next-auth/next");
jest.mock("@/app/api/ga4gh/beacon-authorization", () => ({
  checkBeaconAuthorization: jest.fn(),
}));
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockedCheckBeaconAuthorization =
  checkBeaconAuthorization as jest.MockedFunction<
    typeof checkBeaconAuthorization
  >;

describe("Submitting an application", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(
    accessManagementAxiosInstance
  );

  beforeEach(() => {
    jest.resetAllMocks();
    mockDiscoveryAdapter.resetHistory();
    mockedCheckBeaconAuthorization.mockResolvedValue({
      hasResearcherStatus: true,
      hasAcceptedTC: true,
    });
  });

  test("Successfully submits an application", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/applications/44/submit").reply(200);

    const result = await submitApplicationApi(44);
    expect(result).toEqual({ ok: true, response: null });
    expect(mockedCheckBeaconAuthorization).toHaveBeenCalledWith({
      refresh: true,
    });
  });

  test.each([
    [false, true],
    [true, false],
    [false, false],
  ])(
    "Rejects submission without both required Visas (Researcher: %s, T&C: %s)",
    async (hasResearcherStatus, hasAcceptedTC) => {
      mockedGetServerSession.mockResolvedValueOnce({
        access_token: encrypt("token"),
      });
      mockedCheckBeaconAuthorization.mockResolvedValueOnce({
        hasResearcherStatus,
        hasAcceptedTC,
      });

      await expect(submitApplicationApi(44)).resolves.toMatchObject({
        ok: false,
        response: {
          status: 403,
          data: {
            title: "Application requirements not met",
            status: 403,
          },
        },
      });
      expect(mockDiscoveryAdapter.history.post).toHaveLength(0);
    }
  );

  test("Handles validation warnings from backend", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    const validationWarnings = [
      {
        key: "validation/t.form.validation/required",
        formId: 1,
        fieldId: "field1",
      },
      {
        key: "validation/t.actions.errors/licenses-not-accepted",
        formId: 2,
        fieldId: "field2",
      },
    ];

    mockDiscoveryAdapter.onPost("/api/v1/applications/44/submit").reply(400, {
      title: "Validation Error",
      detail: "Some fields are invalid",
      status: 400,
      validationWarnings,
    });

    const result = await submitApplicationApi(44);
    expect(result).toEqual({
      ok: false,
      response: {
        status: 400,
        headers: { "Content-Type": "application/json" },
        data: {
          title: "Validation Error",
          detail: "Some fields are invalid",
          status: 400,
          validationWarnings: [
            {
              key: "required",
              formId: 1,
              fieldId: "field1",
            },
            {
              key: "licenses-not-accepted",
              formId: 2,
              fieldId: "field2",
            },
          ],
        },
      },
    });
  });

  test("Handles non-validation error responses", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/applications/44/submit").reply(404, {
      title: "Not Found",
      detail: "Application not found",
      status: 404,
    });

    const result = await submitApplicationApi(44);
    expect(result).toEqual({
      ok: false,
      response: {
        status: 404,
        headers: { "Content-Type": "application/json" },
        data: {
          title: "Not Found",
          detail: "Application not found",
          status: 404,
        },
      },
    });
  });

  test("Handles network or unexpected errors", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter
      .onPost("/api/v1/applications/44/submit")
      .networkError();

    const result = await submitApplicationApi(44);
    expect(result).toEqual({
      ok: false,
      response: {
        status: 500,
        headers: { "Content-Type": "application/json" },
        data: {
          title: "Error",
          detail: "Network Error",
          status: 500,
        },
      },
    });
  });

  test("Handles non-Error objects in catch block", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/applications/44/submit").reply(() => {
      throw "Unexpected string error";
    });

    const result = await submitApplicationApi(44);
    expect(result).toEqual({
      ok: false,
      response: {
        status: 500,
        headers: { "Content-Type": "application/json" },
        data: {
          title: "Error",
          detail: "Failed to submit application",
          status: 500,
        },
      },
    });
  });
});
