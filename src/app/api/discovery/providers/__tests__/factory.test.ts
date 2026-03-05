// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  getDiscoveryProvider,
  resolveDiscoveryProviderKey,
} from "@/app/api/discovery/providers/factory";

describe("discovery provider factory", () => {
  const originalProviderEnv = process.env.DISCOVERY_PROVIDER;

  afterEach(() => {
    process.env.DISCOVERY_PROVIDER = originalProviderEnv;
  });

  test("returns default key for empty env", () => {
    expect(resolveDiscoveryProviderKey(undefined)).toBe("dds");
  });

  test("resolves supported keys", () => {
    expect(resolveDiscoveryProviderKey("dds")).toBe("dds");
    expect(resolveDiscoveryProviderKey("local-index")).toBe("local-index");
  });

  test("resolves keys case-insensitively", () => {
    expect(resolveDiscoveryProviderKey("DDS")).toBe("dds");
    expect(resolveDiscoveryProviderKey("LOCAL-INDEX")).toBe("local-index");
  });

  test("throws with supported values for unknown key", () => {
    expect(() => resolveDiscoveryProviderKey("unknown-provider")).toThrow(
      /Unsupported DISCOVERY_PROVIDER "unknown-provider"/
    );
    expect(() => resolveDiscoveryProviderKey("unknown-provider")).toThrow(
      /Supported values:/
    );
  });

  test("returns the selected provider instance", () => {
    process.env.DISCOVERY_PROVIDER = "dds";
    expect(getDiscoveryProvider().key).toBe("dds");

    process.env.DISCOVERY_PROVIDER = "local-index";
    expect(getDiscoveryProvider().key).toBe("local-index");
  });
});
