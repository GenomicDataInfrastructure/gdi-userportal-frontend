/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LoginPage from "../page";

const mockSignIn = jest.fn();
jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

test.each(["/requests?tab=applications", "/fr/applications/123", null])(
  "starts Keycloak login once and preserves callback %s",
  async (callbackUrl) => {
    (
      globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    mockSignIn.mockClear();
    const query = callbackUrl ? `?${new URLSearchParams({ callbackUrl })}` : "";
    window.history.replaceState({}, "", `/login${query}`);
    const root = createRoot(document.createElement("div"));
    try {
      await act(async () => {
        root.render(createElement(StrictMode, null, createElement(LoginPage)));
      });
      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockSignIn).toHaveBeenCalledWith("keycloak", {
        callbackUrl: callbackUrl || "/",
      });
    } finally {
      act(() => root.unmount());
    }
  }
);

test("does not auto-login when returning with an auth error", async () => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  mockSignIn.mockClear();
  window.history.replaceState(
    {},
    "",
    "/login?error=AccessDenied&callbackUrl=%2Frequests%3Ftab%3Dentitlements"
  );
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await act(async () => {
      root.render(createElement(StrictMode, null, createElement(LoginPage)));
    });
    expect(mockSignIn).not.toHaveBeenCalled();

    const button = container.querySelector("button");
    expect(button).not.toBeNull();
    await act(async () => {
      button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith("keycloak", {
      callbackUrl: "/requests?tab=entitlements",
    });
  } finally {
    act(() => root.unmount());
  }
});
