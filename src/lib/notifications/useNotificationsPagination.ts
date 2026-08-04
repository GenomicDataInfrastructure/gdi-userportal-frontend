// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useMemo, useRef, useState } from "react";
import { listNotificationsApi } from "@/app/api/notifications";
import {
  AppNotification,
  NOTIFICATIONS_PAGE_SIZE,
} from "@/lib/notifications/types";

interface UseNotificationsPaginationResult {
  notifications: AppNotification[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreError: boolean;
  loadMore: () => Promise<void>;
  applyMarkRead: (ids: string[]) => void;
  applyRemove: (ids: string[]) => void;
}

/**
 * Layers "load more" pagination on top of a base notification list (e.g. the
 * shared provider's initial snapshot). Guards `loadMore` with refs, not just
 * state, since callers may invoke it repeatedly in quick succession (scroll
 * events) before a state update has re-rendered.
 */
export function useNotificationsPagination(
  baseNotifications: AppNotification[]
): UseNotificationsPaginationResult {
  const [extraNotifications, setExtraNotifications] = useState<
    AppNotification[]
  >([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const pageRef = useRef(page);
  pageRef.current = page;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;
  const isLoadingMoreRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) return;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(false);
    try {
      const nextPage = pageRef.current + 1;
      const result = await listNotificationsApi({
        page: nextPage,
        limit: NOTIFICATIONS_PAGE_SIZE,
      });
      setExtraNotifications((prev) => [...prev, ...result.items]);
      setPage(nextPage);
      if (result.items.length < NOTIFICATIONS_PAGE_SIZE) setHasMore(false);
    } catch {
      setLoadMoreError(true);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, []);

  const applyMarkRead = useCallback((ids: string[]) => {
    setExtraNotifications((prev) =>
      prev.map((notification) =>
        ids.includes(notification.id)
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const applyRemove = useCallback((ids: string[]) => {
    setExtraNotifications((prev) =>
      prev.filter((notification) => !ids.includes(notification.id))
    );
  }, []);

  const notifications = useMemo(() => {
    const seen = new Set<string>();
    return [...baseNotifications, ...extraNotifications].filter(
      (notification) => {
        if (seen.has(notification.id)) return false;
        seen.add(notification.id);
        return true;
      }
    );
  }, [baseNotifications, extraNotifications]);

  return {
    notifications,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
    applyMarkRead,
    applyRemove,
  };
}
