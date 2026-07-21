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

interface NotificationsContextState {
  enabled: boolean;
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
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

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const snapshot = await getNotificationsSnapshotApi();
      setEnabled(snapshot.enabled);
      setNotifications(snapshot.list.items);
      setUnreadCount(snapshot.unreadCount);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (sessionStatus !== "authenticated") {
      setIsLoading(false);
      return;
    }

    refresh().catch(() => setIsLoading(false));
  }, [sessionStatus, refresh]);

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
