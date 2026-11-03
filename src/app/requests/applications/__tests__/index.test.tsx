/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
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

const roots: Root[] = [];

afterEach(() => {
  act(() => roots.splice(0).forEach((root) => root.unmount()));
  document.body.replaceChildren();
});

async function renderApplicationsPage() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  await act(async () => {
    root.render(
      createElement(StrictMode, null, createElement(ApplicationsPage))
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
  mockListApplicationsApi.mockResolvedValue(
    JSON.parse(JSON.stringify({ ok: false, status: 401 }))
  );

  await renderApplicationsPage();

  expect(mockSignIn).toHaveBeenCalledTimes(1);
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
  mockListApplicationsApi.mockResolvedValue(
    JSON.parse(JSON.stringify({ ok: false, status: 401 }))
  );
  mockSignIn.mockRejectedValue(new Error("network error"));

  const container = await renderApplicationsPage();

  expect(container.textContent).toBe("error");
});

test("renders a successful response without starting login", async () => {
  mockListApplicationsApi.mockResolvedValue({ ok: true, data: [] });
  const container = await renderApplicationsPage();
  expect(mockSignIn).not.toHaveBeenCalled();
  expect(container.textContent).not.toContain("error");
  expect(container.textContent).toContain("requests.applications.title");
});
