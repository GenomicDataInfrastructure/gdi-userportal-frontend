/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act } from "react";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import EntitlementsPage from "../index";
import { ACCESS_MANAGEMENT_UNAUTHORIZED_MESSAGE } from "@/app/api/access-management/errors";

const mockSignIn = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

const mockRetrieveEntitlementsApi = jest.fn();
jest.mock("@/app/api/access-management", () => ({
  retrieveEntitlementsApi: () => mockRetrieveEntitlementsApi(),
}));

jest.mock("@/utils/datasetEntitlements", () => ({
  createDatasetEntitlements: jest.fn().mockResolvedValue([]),
}));

jest.mock("@/app/error", () => ({
  __esModule: true,
  default: ({ errorTitle }: { errorTitle?: string }) =>
    createElement("div", {}, errorTitle ?? "error"),
}));
jest.mock("../EntitlementsList", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../EmptyEntitlements", () => ({ EmptyEntitlements: () => null }));
jest.mock("../PassportUnavailableBanner", () => ({
  __esModule: true,
  default: () => null,
}));

async function renderEntitlementsPage() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(createElement(EntitlementsPage));
  });
  return container;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("redirects to Keycloak login when the API rejects with the unauthorized marker", async () => {
  mockRetrieveEntitlementsApi.mockRejectedValue(
    new Error(ACCESS_MANAGEMENT_UNAUTHORIZED_MESSAGE)
  );

  await renderEntitlementsPage();

  expect(mockSignIn).toHaveBeenCalledWith("keycloak", {
    callbackUrl: window.location.href,
  });
});

test("shows a generic error for non-401 failures without redirecting to login", async () => {
  mockRetrieveEntitlementsApi.mockRejectedValue({
    isAxiosError: true,
    response: { status: 500, data: { title: "Oops", detail: "Failed" } },
  });

  const container = await renderEntitlementsPage();

  expect(mockSignIn).not.toHaveBeenCalled();
  expect(container.textContent).toContain("Oops");
});
