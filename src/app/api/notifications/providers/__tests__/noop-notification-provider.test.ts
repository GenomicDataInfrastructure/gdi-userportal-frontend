// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { NoopNotificationProvider } from "@/app/api/notifications/providers/noop-notification-provider";

describe("NoopNotificationProvider", () => {
  const provider = new NoopNotificationProvider();

  test("lists no notifications", async () => {
    await expect(provider.list()).resolves.toEqual({ items: [], total: 0 });
  });

  test("reports zero unread notifications", async () => {
    await expect(provider.unreadCount()).resolves.toBe(0);
  });

  test("markRead and delete are no-ops", async () => {
    await expect(provider.markRead()).resolves.toBeUndefined();
    await expect(provider.delete()).resolves.toBeUndefined();
  });
});
