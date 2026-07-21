// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { NotificationProvider } from "@/app/api/notifications/providers/types";
import { ListNotificationsResult } from "@/lib/notifications/types";

export class NoopNotificationProvider implements NotificationProvider {
  readonly key = "noop";

  async list(): Promise<ListNotificationsResult> {
    return { items: [], total: 0 };
  }

  async unreadCount(): Promise<number> {
    return 0;
  }

  async markRead(): Promise<void> {}

  async delete(): Promise<void> {}
}
