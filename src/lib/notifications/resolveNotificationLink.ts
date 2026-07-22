// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { AppNotification } from "@/lib/notifications/types";

/**
 * Maps a notification's `meta` to the in-app route it should deep-link to.
 * All application-related notifications currently resolve to the same
 * route; if a future `applicationType` needs a different destination,
 * branch on it here — the list/row UI stays generic either way.
 */
export const resolveNotificationLink = (
  notification: AppNotification
): string | undefined => {
  const { applicationId } = notification.meta ?? {};
  return applicationId ? `/applications/${applicationId}` : undefined;
};
