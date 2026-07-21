// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  ListNotificationsParams,
  ListNotificationsResult,
} from "@/lib/notifications/types";

export interface NotificationProvider {
  readonly key: string;
  list: (
    params: ListNotificationsParams,
    headers: Record<string, string>
  ) => Promise<ListNotificationsResult>;
  unreadCount?: (headers: Record<string, string>) => Promise<number>;
  markRead?: (ids: string[], headers: Record<string, string>) => Promise<void>;
  // Omitting `ids` deletes all notifications for the current user.
  delete?: (
    ids: string[] | undefined,
    headers: Record<string, string>
  ) => Promise<void>;
}
