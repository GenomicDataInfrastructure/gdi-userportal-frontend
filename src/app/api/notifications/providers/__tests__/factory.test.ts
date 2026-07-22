// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  getNotificationProvider,
  isNotificationsFeatureEnabled,
  resolveNotificationProviderKey,
} from "@/app/api/notifications/providers/factory";

describe("notification provider factory", () => {
  const originalProviderEnv = process.env.NOTIFICATION_PROVIDER;

  afterEach(() => {
    process.env.NOTIFICATION_PROVIDER = originalProviderEnv;
  });

  test("defaults to noop when env is unset", () => {
    expect(resolveNotificationProviderKey(undefined)).toBe("noop");
  });

  test("resolves supported keys case-insensitively", () => {
    expect(resolveNotificationProviderKey("noop")).toBe("noop");
    expect(resolveNotificationProviderKey("NOOP")).toBe("noop");
  });

  test("throws with supported values for unknown key", () => {
    expect(() => resolveNotificationProviderKey("unknown")).toThrow(
      /Unsupported NOTIFICATION_PROVIDER "unknown"/
    );
    expect(() => resolveNotificationProviderKey("unknown")).toThrow(
      /Supported values:/
    );
  });

  test("returns the selected provider instance", () => {
    process.env.NOTIFICATION_PROVIDER = "noop";
    expect(getNotificationProvider().key).toBe("noop");
  });

  test("feature flag is disabled when only the noop provider is configured", () => {
    process.env.NOTIFICATION_PROVIDER = "noop";
    expect(isNotificationsFeatureEnabled()).toBe(false);
  });

  test("feature flag defaults to disabled when unset", () => {
    delete process.env.NOTIFICATION_PROVIDER;
    expect(isNotificationsFeatureEnabled()).toBe(false);
  });
});
