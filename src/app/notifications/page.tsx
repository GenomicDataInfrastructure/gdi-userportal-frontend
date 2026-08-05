// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { UrlSearchParams } from "@/app/params";
import PageContainer from "@/components/PageContainer";
import NotificationRow from "@/components/Header/Notifications/NotificationRow";
import { useAutoMarkAsViewed } from "@/lib/notifications/useAutoMarkAsViewed";
import { useNotificationsPagination } from "@/lib/notifications/useNotificationsPagination";
import { useNotifications } from "@/providers/notifications/NotificationsProvider";
import { useTranslations } from "next-intl";
import { use, useCallback } from "react";

type NotificationsPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const t = useTranslations();
  const _searchParams = use(searchParams);
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

  return (
    <PageContainer searchParams={_searchParams} className="pt-5">
      <h1 className="text-2xl font-semibold text-black mb-6">
        {t("notifications.label")}
      </h1>
      {isLoading ? (
        <p className="text-sm text-info text-center py-6">
          {t("notifications.loading")}
        </p>
      ) : error ? (
        <div className="text-center py-6">
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
        <p className="text-sm text-info text-center py-6">
          {t("notifications.empty")}
        </p>
      ) : (
        <>
          <ul className="border border-gray-100 rounded-md overflow-hidden">
            {allNotifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          {hasMore && (
            <div className="text-center py-4">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="text-sm font-semibold text-primary underline disabled:opacity-50"
              >
                {t("notifications.loadMore")}
              </button>
              {loadMoreError && (
                <p className="mt-2 text-sm text-secondary">
                  {t("notifications.error")}{" "}
                  <button
                    type="button"
                    onClick={loadMore}
                    className="underline"
                  >
                    {t("notifications.retry")}
                  </button>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}

export default NotificationsPage;
