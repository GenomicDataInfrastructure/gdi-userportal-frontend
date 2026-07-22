// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

const mockGetNotificationProvider = jest.fn();
const mockIsNotificationsFeatureEnabled = jest.fn();

jest.mock("@/app/api/notifications/providers/factory", () => ({
  getNotificationProvider: mockGetNotificationProvider,
  isNotificationsFeatureEnabled: mockIsNotificationsFeatureEnabled,
}));

jest.mock("@/app/api/shared/headers", () => ({
  createHeaders: jest.fn(async () => ({ Authorization: "Bearer token" })),
}));

describe("notifications server actions", () => {
  const list = jest.fn<(...args: unknown[]) => Promise<unknown>>();
  const unreadCount = jest.fn<(...args: unknown[]) => Promise<unknown>>();
  const markRead = jest.fn<(...args: unknown[]) => Promise<unknown>>();
  const remove = jest.fn<(...args: unknown[]) => Promise<unknown>>();

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockIsNotificationsFeatureEnabled.mockReturnValue(true);
    mockGetNotificationProvider.mockReturnValue({
      key: "some-provider",
      list,
      unreadCount,
      markRead,
      delete: remove,
    });
  });

  test("listNotificationsApi forwards params and headers to the provider", async () => {
    list.mockResolvedValueOnce({ items: [], total: 0 });
    const { listNotificationsApi } = await import("@/app/api/notifications");

    const result = await listNotificationsApi({ page: 1 });

    expect(list).toHaveBeenCalledWith(
      { page: 1 },
      { Authorization: "Bearer token" }
    );
    expect(result).toEqual({ items: [], total: 0 });
  });

  test("markNotificationsReadApi forwards ids and headers", async () => {
    const { markNotificationsReadApi } =
      await import("@/app/api/notifications");

    await markNotificationsReadApi(["1", "2"]);

    expect(markRead).toHaveBeenCalledWith(["1", "2"], {
      Authorization: "Bearer token",
    });
  });

  test("deleteNotificationsApi forwards ids and headers", async () => {
    const { deleteNotificationsApi } = await import("@/app/api/notifications");

    await deleteNotificationsApi(["1"]);

    expect(remove).toHaveBeenCalledWith(["1"], {
      Authorization: "Bearer token",
    });
  });

  describe("getNotificationsSnapshotApi", () => {
    test("returns a disabled empty snapshot without calling the provider", async () => {
      mockIsNotificationsFeatureEnabled.mockReturnValue(false);
      const { getNotificationsSnapshotApi } =
        await import("@/app/api/notifications");

      const snapshot = await getNotificationsSnapshotApi();

      expect(snapshot).toEqual({
        enabled: false,
        list: { items: [] },
        unreadCount: 0,
      });
      expect(list).not.toHaveBeenCalled();
    });

    test("uses the provider's unreadCount when available", async () => {
      list.mockResolvedValueOnce({
        items: [{ id: "1", read: false }],
        total: 1,
      });
      unreadCount.mockResolvedValueOnce(5);
      const { getNotificationsSnapshotApi } =
        await import("@/app/api/notifications");

      const snapshot = await getNotificationsSnapshotApi();

      expect(snapshot.unreadCount).toBe(5);
      expect(unreadCount).toHaveBeenCalledWith({
        Authorization: "Bearer token",
      });
    });

    test("falls back to counting unread items when unreadCount is not implemented", async () => {
      list.mockResolvedValueOnce({
        items: [
          { id: "1", read: false },
          { id: "2", read: true },
          { id: "3", read: false },
        ],
        total: 3,
      });
      mockGetNotificationProvider.mockReturnValue({
        key: "some-provider",
        list,
      });
      const { getNotificationsSnapshotApi } =
        await import("@/app/api/notifications");

      const snapshot = await getNotificationsSnapshotApi();

      expect(snapshot.unreadCount).toBe(2);
    });
  });
});
