/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act } from "react";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import ApplicationsPage from "../index";
import { ACCESS_MANAGEMENT_UNAUTHORIZED_MESSAGE } from "@/app/api/access-management/errors";

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

test("redirects to Keycloak login when the API rejects with the unauthorized marker", async () => {
  mockListApplicationsApi.mockRejectedValue(
    new Error(ACCESS_MANAGEMENT_UNAUTHORIZED_MESSAGE)
  );

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

test("recovers from a failed sign-in attempt instead of spinning forever", async () => {
  mockListApplicationsApi.mockRejectedValue(
    new Error(ACCESS_MANAGEMENT_UNAUTHORIZED_MESSAGE)
  );
  mockSignIn.mockRejectedValue(new Error("network error"));

  const container = await renderApplicationsPage();

  expect(container.textContent).not.toBe("");
});
