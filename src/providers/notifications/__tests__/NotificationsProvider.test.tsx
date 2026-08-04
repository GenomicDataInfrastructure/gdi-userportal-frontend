/**
 * @jest-environment jsdom
 */

// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { jest } from "@jest/globals";
import type { AppNotification } from "@/lib/notifications/types";

const mockUseSession = jest.fn<() => { status: string }>();
jest.mock("next-auth/react", () => ({
  useSession: mockUseSession,
}));

const mockGetNotificationsSnapshotApi = jest.fn<
  () => Promise<{
    enabled: boolean;
    list: { items: AppNotification[]; total?: number };
    unreadCount: number;
  }>
>();
const mockMarkNotificationsReadApi = jest.fn<() => Promise<void>>();
const mockDeleteNotificationsApi = jest.fn<() => Promise<void>>();

jest.mock("@/app/api/notifications", () => ({
  getNotificationsSnapshotApi: mockGetNotificationsSnapshotApi,
  markNotificationsReadApi: mockMarkNotificationsReadApi,
  deleteNotificationsApi: mockDeleteNotificationsApi,
}));

import {
  NotificationsProvider,
  useNotifications,
} from "@/providers/notifications/NotificationsProvider";

let latestState: ReturnType<typeof useNotifications> | undefined;

const Probe = () => {
  const state = useNotifications();
  useEffect(() => {
    latestState = state;
  });
  return null;
};

describe("NotificationsProvider", () => {
  let container: HTMLDivElement;
  let root: Root;
  let isUnmounted: boolean;

  beforeEach(() => {
    jest.clearAllMocks();
    latestState = undefined;
    isUnmounted = false;
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  const unmountRoot = () => {
    if (isUnmounted) return;
    isUnmounted = true;
    act(() => {
      root.unmount();
    });
  };

  afterEach(() => {
    unmountRoot();
    container.remove();
  });

  const renderProvider = () => {
    act(() => {
      root = createRoot(container);
      root.render(
        <NotificationsProvider>
          <Probe />
        </NotificationsProvider>
      );
    });
  };

  test("resets enabled, notifications and unreadCount when the session is not authenticated", async () => {
    mockUseSession.mockReturnValue({ status: "unauthenticated" });

    renderProvider();
    await act(async () => {});

    expect(latestState).toMatchObject({
      enabled: false,
      notifications: [],
      unreadCount: 0,
      isLoading: false,
    });
    expect(mockGetNotificationsSnapshotApi).not.toHaveBeenCalled();
  });

  test("clears stale notifications and unread count after logging out", async () => {
    mockUseSession.mockReturnValue({ status: "authenticated" });
    mockGetNotificationsSnapshotApi.mockResolvedValue({
      enabled: true,
      list: {
        items: [
          {
            id: "1",
            title: "title",
            message: "message",
            createdAt: "2026-07-01T00:00:00.000Z",
            read: false,
          },
        ],
        total: 1,
      },
      unreadCount: 1,
    });

    renderProvider();
    await act(async () => {});

    expect(latestState).toMatchObject({
      enabled: true,
      notifications: [{ id: "1" }],
      unreadCount: 1,
    });

    mockUseSession.mockReturnValue({ status: "unauthenticated" });
    act(() => {
      root.render(
        <NotificationsProvider>
          <Probe />
        </NotificationsProvider>
      );
    });
    await act(async () => {});

    expect(latestState).toMatchObject({
      enabled: false,
      notifications: [],
      unreadCount: 0,
    });
  });

  test("does not fetch notifications while the session is loading", async () => {
    mockUseSession.mockReturnValue({ status: "loading" });

    renderProvider();
    await act(async () => {});

    expect(mockGetNotificationsSnapshotApi).not.toHaveBeenCalled();
    expect(latestState?.isLoading).toBe(true);
  });

  test("surfaces an error and clears loading when the initial fetch fails", async () => {
    mockUseSession.mockReturnValue({ status: "authenticated" });
    mockGetNotificationsSnapshotApi.mockRejectedValueOnce(new Error("down"));

    renderProvider();
    await act(async () => {});

    expect(latestState).toMatchObject({
      error: true,
      isLoading: false,
      notifications: [],
    });
  });

  test("clears a previous error and populates state on a successful refresh", async () => {
    mockUseSession.mockReturnValue({ status: "authenticated" });
    mockGetNotificationsSnapshotApi.mockRejectedValueOnce(new Error("down"));

    renderProvider();
    await act(async () => {});
    expect(latestState?.error).toBe(true);

    mockGetNotificationsSnapshotApi.mockResolvedValueOnce({
      enabled: true,
      list: { items: [], total: 0 },
      unreadCount: 0,
    });
    await act(async () => {
      await latestState?.refresh();
    });

    expect(latestState).toMatchObject({ error: false, unreadCount: 0 });
  });

  test("resets a stale error after logging out", async () => {
    mockUseSession.mockReturnValue({ status: "authenticated" });
    mockGetNotificationsSnapshotApi.mockRejectedValueOnce(new Error("down"));

    renderProvider();
    await act(async () => {});
    expect(latestState?.error).toBe(true);

    mockUseSession.mockReturnValue({ status: "unauthenticated" });
    act(() => {
      root.render(
        <NotificationsProvider>
          <Probe />
        </NotificationsProvider>
      );
    });
    await act(async () => {});

    expect(latestState?.error).toBe(false);
  });

  describe("polling", () => {
    const originalVisibilityState = Object.getOwnPropertyDescriptor(
      document,
      "visibilityState"
    );

    const setVisibilityState = (value: DocumentVisibilityState) => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => value,
      });
    };

    beforeEach(() => {
      jest.useFakeTimers();
      setVisibilityState("visible");
    });

    afterEach(() => {
      jest.useRealTimers();
      if (originalVisibilityState) {
        Object.defineProperty(document, "visibilityState", originalVisibilityState);
      }
    });

    test("silently refreshes on an interval without toggling isLoading", async () => {
      mockUseSession.mockReturnValue({ status: "authenticated" });
      mockGetNotificationsSnapshotApi.mockResolvedValue({
        enabled: true,
        list: { items: [], total: 0 },
        unreadCount: 0,
      });

      renderProvider();
      await act(async () => {});
      expect(mockGetNotificationsSnapshotApi).toHaveBeenCalledTimes(1);

      await act(async () => {
        await jest.advanceTimersByTimeAsync(60000);
      });

      expect(mockGetNotificationsSnapshotApi).toHaveBeenCalledTimes(2);
      expect(latestState?.isLoading).toBe(false);
    });

    test("stops polling while the tab is hidden", async () => {
      mockUseSession.mockReturnValue({ status: "authenticated" });
      mockGetNotificationsSnapshotApi.mockResolvedValue({
        enabled: true,
        list: { items: [], total: 0 },
        unreadCount: 0,
      });

      renderProvider();
      await act(async () => {});
      expect(mockGetNotificationsSnapshotApi).toHaveBeenCalledTimes(1);

      setVisibilityState("hidden");
      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });

      await act(async () => {
        await jest.advanceTimersByTimeAsync(120000);
      });

      expect(mockGetNotificationsSnapshotApi).toHaveBeenCalledTimes(1);
    });

    test("stops polling on unmount", async () => {
      mockUseSession.mockReturnValue({ status: "authenticated" });
      mockGetNotificationsSnapshotApi.mockResolvedValue({
        enabled: true,
        list: { items: [], total: 0 },
        unreadCount: 0,
      });

      renderProvider();
      await act(async () => {});
      expect(mockGetNotificationsSnapshotApi).toHaveBeenCalledTimes(1);

      unmountRoot();

      await act(async () => {
        await jest.advanceTimersByTimeAsync(120000);
      });

      expect(mockGetNotificationsSnapshotApi).toHaveBeenCalledTimes(1);
    });
  });
});
