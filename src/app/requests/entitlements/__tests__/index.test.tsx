/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createElement } from "react";
import EntitlementsPage from "../index";

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

const roots: Root[] = [];

afterEach(() => {
  act(() => roots.splice(0).forEach((root) => root.unmount()));
  document.body.replaceChildren();
});

async function renderEntitlementsPage() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  await act(async () => {
    root.render(
      createElement(StrictMode, null, createElement(EntitlementsPage))
    );
  });
  return container;
}

beforeEach(() => {
  jest.resetAllMocks();
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

test("redirects to Keycloak login when the API returns a serialized unauthorized result", async () => {
  mockRetrieveEntitlementsApi.mockResolvedValue(
    JSON.parse(JSON.stringify({ ok: false, status: 401 }))
  );

  await renderEntitlementsPage();

  expect(mockSignIn).toHaveBeenCalledTimes(1);
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

test("shows an error when starting login fails", async () => {
  mockRetrieveEntitlementsApi.mockResolvedValue({ ok: false, status: 401 });
  mockSignIn.mockRejectedValue(new Error("network error"));
  const container = await renderEntitlementsPage();
  expect(container.textContent).toBe("error");
});
test("renders a successful response without starting login", async () => {
  mockRetrieveEntitlementsApi.mockResolvedValue({
    ok: true,
    data: { entitlements: [], passportPresent: true },
  });
  const container = await renderEntitlementsPage();
  expect(mockSignIn).not.toHaveBeenCalled();
  expect(container.textContent).not.toContain("error");
  expect(container.textContent).toContain("requests.entitlements.title");
});
