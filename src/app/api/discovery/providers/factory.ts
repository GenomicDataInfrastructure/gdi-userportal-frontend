// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { CustomDiscoveryProvider } from "@/app/api/discovery/providers/custom-discovery-provider";
import { DdsDiscoveryProvider } from "@/app/api/discovery/providers/dds-discovery-provider";
import { DiscoveryProvider } from "@/app/api/discovery/providers/types";

export type DiscoveryProviderKey = "dds" | "custom";

const defaultProviderKey: DiscoveryProviderKey = "dds";

const providersByKey: Record<DiscoveryProviderKey, DiscoveryProvider> = {
  dds: new DdsDiscoveryProvider(),
  custom: new CustomDiscoveryProvider(),
};

export const resolveDiscoveryProviderKey = (
  keyFromEnv: string | undefined
): DiscoveryProviderKey => {
  if (!keyFromEnv) return defaultProviderKey;

  const normalized = keyFromEnv.toLowerCase();
  if (normalized in providersByKey) {
    return normalized as DiscoveryProviderKey;
  }

  throw new Error(
    `Unsupported DISCOVERY_PROVIDER "${keyFromEnv}". Supported values: ${Object.keys(
      providersByKey
    ).join(", ")}`
  );
};

export const getDiscoveryProvider = (): DiscoveryProvider => {
  const providerKey = resolveDiscoveryProviderKey(
    process.env.DISCOVERY_PROVIDER
  );
  return providersByKey[providerKey];
};
