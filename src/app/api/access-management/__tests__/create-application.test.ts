// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import AxiosMockAdapter from "axios-mock-adapter";
import { accessManagementAxiosInstance } from "@/app/api/shared/client";
import { jest } from "@jest/globals";
import { getServerSession } from "next-auth";
import { encrypt } from "@/utils/encryption";
import { createApplicationApi } from "@/app/api/access-management";

jest.mock("next-auth/next");
const mockedGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

describe("Creating an application", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(
    accessManagementAxiosInstance
  );

  beforeEach(() => {
    jest.resetAllMocks();
    mockDiscoveryAdapter.resetHistory();
  });

  test("Rejects unauthenticated requests without calling access management", async () => {
    mockedGetServerSession.mockResolvedValueOnce(null);
    await expect(
      createApplicationApi({ datasetIds: ["id1"] })
    ).resolves.toMatchObject({
      ok: false,
      response: { status: 401, data: { status: 401 } },
    });
    expect(mockDiscoveryAdapter.history.post).toHaveLength(0);
  });

  test("Creates a new application for the authenticated user", async () => {
    const encryptedToken = encrypt("decryptedToken");
    mockedGetServerSession.mockResolvedValueOnce({
      access_token: encryptedToken,
    });

    mockDiscoveryAdapter.onPost("/api/v1/applications/create").reply(200, {
      applicationId: "543",
    });

    const response = await createApplicationApi({ datasetIds: ["id1", "id2"] });

    expect(response).toBeDefined();
    expect(response).toEqual({
      ok: true,
      applicationId: "543",
      response: null,
    });
  });
  test.each([401, 403, 500])(
    "Returns structured backend errors (%s)",
    async (status) => {
      mockedGetServerSession.mockResolvedValueOnce({
        access_token: encrypt("token"),
      });
      mockDiscoveryAdapter
        .onPost("/api/v1/applications/create")
        .reply(status, { title: "Request failed", detail: "Backend detail" });
      await expect(
        createApplicationApi({ datasetIds: ["id1"] })
      ).resolves.toMatchObject({
        ok: false,
        response: {
          status,
          data: { title: "Request failed", detail: "Backend detail", status },
        },
      });
    }
  );

  test("Returns a safe structured error for unexpected failures", async () => {
    mockedGetServerSession.mockRejectedValueOnce(
      new Error("Internal credentials")
    );
    await expect(
      createApplicationApi({ datasetIds: ["id1"] })
    ).resolves.toMatchObject({
      ok: false,
      response: {
        status: 500,
        data: { detail: "Failed to create application" },
      },
    });
    expect(mockDiscoveryAdapter.history.post).toHaveLength(0);
  });
});
