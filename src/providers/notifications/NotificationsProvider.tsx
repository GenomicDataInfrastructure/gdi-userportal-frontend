// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  deleteNotificationsApi,
  getNotificationsSnapshotApi,
  markNotificationsReadApi,
} from "@/app/api/notifications";
import { AppNotification } from "@/lib/notifications/types";
import { useSession } from "next-auth/react";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createNotificationsPoller } from "./notificationsPolling";

interface RefreshOptions {
  silent?: boolean;
}

interface NotificationsContextState {
  enabled: boolean;
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: boolean;
  /**
   * Bumped whenever `notifications` is replaced wholesale by a fresh server
   * snapshot (a `refresh()` or a session change) rather than patched locally
   * (`markRead`/`remove`). Consumers that layer client-side pagination on
   * top of `notifications` (see `useNotificationsPagination`) key their
   * reset-on-new-snapshot logic off this value.
   */
  snapshotVersion: number;
  refresh: (options?: RefreshOptions) => Promise<void>;
  markRead: (ids: string[]) => Promise<void>;
  remove: (ids: string[]) => Promise<void>;
}

const NotificationsContext = createContext<
  NotificationsContextState | undefined
>(undefined);

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { status: sessionStatus } = useSession();
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [snapshotVersion, setSnapshotVersion] = useState(0);

  const refresh = useCallback(async (options?: RefreshOptions) => {
    const silent = options?.silent ?? false;
    if (!silent) setIsLoading(true);
    try {
      const snapshot = await getNotificationsSnapshotApi();
      setEnabled(snapshot.enabled);
      setNotifications(snapshot.list.items);
      setUnreadCount(snapshot.unreadCount);
      setSnapshotVersion((version) => version + 1);
      if (!silent) setError(false);
    } catch (err) {
      console.error(err);
      if (!silent) setError(true);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus !== "authenticated") {
      setEnabled(false);
      setNotifications([]);
      setUnreadCount(0);
      setError(false);
      setIsLoading(false);
      setSnapshotVersion((version) => version + 1);
      return;
    }

    void refresh();
  }, [sessionStatus, refresh]);

  useEffect(() => {
    if (sessionStatus !== "authenticated" || !enabled) return;

    const poller = createNotificationsPoller({
      refresh: () => refresh({ silent: true }),
    });

    const syncPollingToVisibility = () => {
      if (document.visibilityState === "visible") {
        poller.start();
      } else {
        poller.stop();
      }
    };

    syncPollingToVisibility();
    document.addEventListener("visibilitychange", syncPollingToVisibility);

    return () => {
      document.removeEventListener("visibilitychange", syncPollingToVisibility);
      poller.dispose();
    };
  }, [sessionStatus, enabled, refresh]);

  const markRead = useCallback(async (ids: string[]) => {
    await markNotificationsReadApi(ids);
    setNotifications((prev) => {
      const idSet = new Set(ids);
      let unreadMarked = 0;
      const next = prev.map((notification) => {
        if (idSet.has(notification.id) && !notification.read) {
          unreadMarked += 1;
          return { ...notification, read: true };
        }
        return notification;
      });
      setUnreadCount((count) => Math.max(0, count - unreadMarked));
      return next;
    });
  }, []);

  const remove = useCallback(async (ids: string[]) => {
    await deleteNotificationsApi(ids);
    setNotifications((prev) => {
      const idSet = new Set(ids);
      let removedUnread = 0;
      const next = prev.filter((notification) => {
        if (!idSet.has(notification.id)) return true;
        if (!notification.read) removedUnread += 1;
        return false;
      });
      setUnreadCount((count) => Math.max(0, count - removedUnread));
      return next;
    });
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        enabled,
        notifications,
        unreadCount,
        isLoading,
        error,
        snapshotVersion,
        refresh,
        markRead,
        remove,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
