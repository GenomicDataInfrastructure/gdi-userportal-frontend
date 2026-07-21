// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { resolveNotificationLink } from "@/lib/notifications/resolveNotificationLink";
import { AppNotification } from "@/lib/notifications/types";

const baseNotification: AppNotification = {
  id: "1",
  title: "title",
  message: "message",
  createdAt: "2026-07-01T00:00:00.000Z",
  read: false,
};

describe("resolveNotificationLink", () => {
  test("returns undefined when there is no applicationId", () => {
    expect(resolveNotificationLink(baseNotification)).toBeUndefined();
  });

  test("builds an applications route when applicationId is present", () => {
    const link = resolveNotificationLink({
      ...baseNotification,
      meta: { applicationId: "42" },
    });

    expect(link).toBe("/applications/42");
  });
});
