// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use server";

import {
  getNotificationProvider,
  isNotificationsFeatureEnabled,
} from "@/app/api/notifications/providers/factory";
import { createHeaders } from "@/app/api/shared/headers";
import {
  ListNotificationsParams,
  ListNotificationsResult,
} from "@/lib/notifications/types";

const notificationProvider = getNotificationProvider();

const countUnread = (result: ListNotificationsResult): number =>
  result.items.filter((notification) => !notification.read).length;

export interface NotificationsSnapshot {
  enabled: boolean;
  list: ListNotificationsResult;
  unreadCount: number;
}

/**
 * Single entry point for the initial client fetch: resolves whether the
 * feature is enabled and, if so, the notification list and unread count in
 * one round trip. Falls back to counting unread items from `list` when the
 * active provider doesn't implement `unreadCount`.
 */
export const getNotificationsSnapshotApi =
  async (): Promise<NotificationsSnapshot> => {
    const enabled = isNotificationsFeatureEnabled();
    if (!enabled) {
      return { enabled, list: { items: [] }, unreadCount: 0 };
    }

    const headers = await createHeaders();
    const list = await notificationProvider.list({}, headers);
    const unreadCount = notificationProvider.unreadCount
      ? await notificationProvider.unreadCount(headers)
      : countUnread(list);

    return { enabled, list, unreadCount };
  };

export const listNotificationsApi = async (
  params: ListNotificationsParams = {}
): Promise<ListNotificationsResult> => {
  const headers = await createHeaders();
  return notificationProvider.list(params, headers);
};

export const markNotificationsReadApi = async (
  ids: string[]
): Promise<void> => {
  if (!notificationProvider.markRead) return;
  const headers = await createHeaders();
  await notificationProvider.markRead(ids, headers);
};

export const deleteNotificationsApi = async (ids?: string[]): Promise<void> => {
  if (!notificationProvider.delete) return;
  const headers = await createHeaders();
  await notificationProvider.delete(ids, headers);
};
