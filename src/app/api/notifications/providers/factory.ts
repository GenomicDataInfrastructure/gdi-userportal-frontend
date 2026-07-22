// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { NoopNotificationProvider } from "@/app/api/notifications/providers/noop-notification-provider";
import { NotificationProvider } from "@/app/api/notifications/providers/types";

export type NotificationProviderKey = "noop";

const NOOP_PROVIDER_KEY: NotificationProviderKey = "noop";

const providersByKey: Record<NotificationProviderKey, NotificationProvider> = {
  noop: new NoopNotificationProvider(),
};

export const resolveNotificationProviderKey = (
  keyFromEnv: string | undefined
): NotificationProviderKey => {
  if (!keyFromEnv) return NOOP_PROVIDER_KEY;

  const normalized = keyFromEnv.toLowerCase();
  if (normalized in providersByKey) {
    return normalized as NotificationProviderKey;
  }

  throw new Error(
    `Unsupported NOTIFICATION_PROVIDER "${keyFromEnv}". Supported values: ${Object.keys(
      providersByKey
    ).join(", ")}`
  );
};

export const getNotificationProvider = (): NotificationProvider => {
  const providerKey = resolveNotificationProviderKey(
    process.env.NOTIFICATION_PROVIDER
  );
  return providersByKey[providerKey];
};

/**
 * The notification UI is only shown once a deployment configures a real
 * (non-noop) provider, so this flag is derived automatically from
 * NOTIFICATION_PROVIDER rather than toggled by a separate feature flag.
 */
export const isNotificationsFeatureEnabled = (): boolean =>
  getNotificationProvider().key !== NOOP_PROVIDER_KEY;
