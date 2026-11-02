/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act } from "react";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import ApplicationsPage from "../index";

const mockSignIn = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

const mockListApplicationsApi = jest.fn();
jest.mock("@/app/api/access-management", () => ({
  listApplicationsApi: () => mockListApplicationsApi(),
}));

jest.mock("@/components/Button", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => createElement("button", {}, text),
}));
jest.mock("@/app/error", () => ({
  __esModule: true,
  default: ({ errorTitle }: { errorTitle?: string }) =>
    createElement("div", {}, errorTitle ?? "error"),
}));
jest.mock("../ApplicationCard", () => ({
  __esModule: true,
  default: () => null,
}));

async function renderApplicationsPage() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(createElement(ApplicationsPage));
  });
  return container;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("redirects to Keycloak login when the API rejects with a 401", async () => {
  mockListApplicationsApi.mockRejectedValue({
    isAxiosError: true,
    response: { status: 401, data: "" },
  });

  await renderApplicationsPage();

  expect(mockSignIn).toHaveBeenCalledWith("keycloak", {
    callbackUrl: window.location.href,
  });
});

test("shows a generic error for non-401 failures without redirecting to login", async () => {
  mockListApplicationsApi.mockRejectedValue({
    isAxiosError: true,
    response: { status: 500, data: { title: "Oops", detail: "Failed" } },
  });

  const container = await renderApplicationsPage();

  expect(mockSignIn).not.toHaveBeenCalled();
  expect(container.textContent).toContain("Oops");
});
