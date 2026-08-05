// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Link } from "@/i18n/navigation";
import { useAutoMarkAsViewed } from "@/lib/notifications/useAutoMarkAsViewed";
import { useNotificationsPagination } from "@/lib/notifications/useNotificationsPagination";
import { useNotifications } from "@/providers/notifications/NotificationsProvider";
import { useTranslations } from "next-intl";
import { UIEvent, useCallback } from "react";
import NotificationRow from "./NotificationRow";

const LOAD_MORE_SCROLL_THRESHOLD_PX = 32;

const NotificationList = () => {
  const t = useTranslations();
  const {
    notifications,
    isLoading,
    error,
    refresh,
    markRead,
    remove,
    snapshotVersion,
  } = useNotifications();

  const {
    notifications: allNotifications,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
    applyMarkRead,
    applyRemove,
  } = useNotificationsPagination(notifications, snapshotVersion);

  const handleMarkRead = useCallback(
    async (ids: string[]) => {
      await markRead(ids);
      applyMarkRead(ids);
    },
    [markRead, applyMarkRead]
  );

  const handleRemove = useCallback(
    async (ids: string[]) => {
      await remove(ids);
      applyRemove(ids);
    },
    [remove, applyRemove]
  );

  useAutoMarkAsViewed(allNotifications, handleMarkRead, {
    enabled: !isLoading && !error,
  });

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      if (!hasMore || isLoadingMore) return;
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom <= LOAD_MORE_SCROLL_THRESHOLD_PX) {
        void loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-black">
          {t("notifications.label")}
        </span>
      </div>
      <ScrollArea className="max-h-96" onViewportScroll={handleScroll}>
        {isLoading ? (
          <p className="px-4 py-6 text-sm text-info text-center">
            {t("notifications.loading")}
          </p>
        ) : error ? (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-info">{t("notifications.error")}</p>
            <button
              type="button"
              onClick={() => refresh()}
              className="mt-2 text-sm font-semibold text-primary underline"
            >
              {t("notifications.retry")}
            </button>
          </div>
        ) : allNotifications.length === 0 ? (
          <p className="px-4 py-6 text-sm text-info text-center">
            {t("notifications.empty")}
          </p>
        ) : (
          <>
            <ul>
              {allNotifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
            {isLoadingMore && (
              <p className="px-4 py-3 text-xs text-info text-center">
                {t("notifications.loading")}
              </p>
            )}
            {loadMoreError && (
              <div className="px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => loadMore()}
                  className="text-xs font-semibold text-primary underline"
                >
                  {t("notifications.retry")}
                </button>
              </div>
            )}
          </>
        )}
      </ScrollArea>
      <Link
        href="/notifications"
        className="block px-4 py-3 text-center text-sm font-semibold text-primary border-t border-gray-100 hover:underline"
      >
        {t("notifications.viewAll")}
      </Link>
    </div>
  );
};

export default NotificationList;
