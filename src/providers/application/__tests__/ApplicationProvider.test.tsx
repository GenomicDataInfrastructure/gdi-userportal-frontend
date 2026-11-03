/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { act, createElement, StrictMode, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { signIn } from "next-auth/react";
import * as api from "@/app/api/access-management";
import {
  ApplicationProvider,
  useApplicationDetails,
} from "../ApplicationProvider";
import type { ApplicationContextState } from "../ApplicationProvider.types";

jest.mock("next/navigation", () => ({ useParams: () => ({ id: "123" }) }));
jest.mock("next-auth/react", () => ({ signIn: jest.fn() }));
jest.mock("@/app/api/access-management", () => ({
  retrieveApplicationApi: jest.fn(),
  deleteApplicationApi: jest.fn(),
  addAttachmentToApplicationApi: jest.fn(),
  acceptApplicationTermsApi: jest.fn(),
  saveFormsAndDuosApi: jest.fn(),
  submitApplicationApi: jest.fn(),
}));

let context: ApplicationContextState;
let root: Root;
function Consumer() {
  const value = useApplicationDetails();
  useEffect(() => {
    context = value;
  }, [value]);
  return createElement("div", null, value.errorResponse?.status ?? "");
}
async function renderProvider() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(
      createElement(
        StrictMode,
        null,
        createElement(ApplicationProvider, null, createElement(Consumer))
      )
    );
  });
  return container;
}

beforeEach(() => {
  jest.resetAllMocks();
  jest.useFakeTimers();
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  jest
    .mocked(api.retrieveApplicationApi)
    .mockResolvedValue({ ok: true, data: { id: 123, forms: [] } });
});
afterEach(() => {
  act(() => root?.unmount());
  document.body.replaceChildren();
  jest.useRealTimers();
});

const unauthorized = JSON.parse(JSON.stringify({ ok: false, status: 401 }));

test("starts login only once for serialized detail-read failures in Strict Mode", async () => {
  jest.mocked(api.retrieveApplicationApi).mockResolvedValue(unauthorized);
  await renderProvider();
  expect(signIn).toHaveBeenCalledTimes(1);
  expect(signIn).toHaveBeenCalledWith("keycloak", {
    callbackUrl: window.location.href,
  });
  expect(context.application).toBeUndefined();
});

test.each(["delete", "attachment", "terms", "forms", "submit"])(
  "starts login and stops the %s action when the session expires",
  async (action) => {
    await renderProvider();
    jest.mocked(api.retrieveApplicationApi).mockClear();
    jest.mocked(api.deleteApplicationApi).mockResolvedValue(unauthorized);
    jest
      .mocked(api.addAttachmentToApplicationApi)
      .mockResolvedValue(unauthorized);
    jest.mocked(api.acceptApplicationTermsApi).mockResolvedValue(unauthorized);
    jest.mocked(api.saveFormsAndDuosApi).mockResolvedValue(unauthorized);
    jest.mocked(api.submitApplicationApi).mockResolvedValue({
      ok: false,
      response: {
        status: 401,
        headers: { "Content-Type": "application/json" },
        data: { status: 401 },
      },
    });
    await act(async () => {
      if (action === "delete") await context.deleteApplication();
      if (action === "attachment")
        await context.addAttachment(1, "file", new FormData());
      if (action === "terms") await context.acceptTerms([]);
      if (action === "forms") {
        await context.updateInputFields(1, "field", "value");
        await jest.runAllTimersAsync();
      }
      if (action === "submit") await context.submitApplication();
    });
    expect(signIn).toHaveBeenCalledTimes(1);
    expect(context.application?.id).toBe(123);
    expect(context.termsAccepted).toBe(false);
    expect(api.retrieveApplicationApi).not.toHaveBeenCalled();
    if (action === "attachment")
      expect(api.saveFormsAndDuosApi).not.toHaveBeenCalled();
  }
);

test("shows an error when starting login fails", async () => {
  jest.mocked(api.retrieveApplicationApi).mockResolvedValue(unauthorized);
  jest.mocked(signIn).mockRejectedValue(new Error("network failure"));
  const container = await renderProvider();
  expect(container.textContent).toBe("500");
  expect(context.isLoading).toBe(false);
});

test("shows an error for unexpected detail failures without starting login", async () => {
  jest
    .mocked(api.retrieveApplicationApi)
    .mockRejectedValue(new Error("sanitized server error"));
  const container = await renderProvider();
  expect(container.textContent).toBe("500");
  expect(signIn).not.toHaveBeenCalled();
});
