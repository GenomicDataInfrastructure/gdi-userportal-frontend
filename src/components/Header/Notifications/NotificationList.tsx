// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { ScrollArea } from "@/components/shadcn/scroll-area";
import { Link } from "@/i18n/navigation";
import { resolveNotificationLink } from "@/lib/notifications/resolveNotificationLink";
import { AppNotification } from "@/lib/notifications/types";
import { useNotifications } from "@/providers/notifications/NotificationsProvider";
import { formatDateTime } from "@/utils/formatDate";
import { cn } from "@/utils/tailwindMerge";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

const NotificationRow = ({
  notification,
}: {
  notification: AppNotification;
}) => {
  const t = useTranslations();
  const { markRead, remove } = useNotifications();
  const href = resolveNotificationLink(notification);

  const content = (
    <div className="flex flex-1 flex-col gap-y-1 min-w-0">
      <span className={cn("text-sm", !notification.read && "font-semibold")}>
        {notification.title}
      </span>
      <span className="text-sm text-info line-clamp-2">
        {notification.message}
      </span>
      <span className="text-xs text-info opacity-70">
        {formatDateTime(notification.createdAt)}
      </span>
    </div>
  );

  return (
    <li
      className={cn(
        "flex items-start gap-x-2 px-4 py-3 border-b border-gray-100 last:border-b-0",
        !notification.read && "bg-primary/5"
      )}
    >
      {href ? (
        <Link
          href={href}
          className="flex flex-1 min-w-0"
          onClick={() => {
            if (!notification.read) markRead([notification.id]);
          }}
        >
          {content}
        </Link>
      ) : (
        content
      )}
      <div className="flex flex-col gap-y-1 shrink-0">
        {!notification.read && (
          <button
            type="button"
            aria-label={t("notifications.markRead")}
            title={t("notifications.markRead")}
            onClick={() => markRead([notification.id])}
            className="p-1 text-info hover:text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
        <button
          type="button"
          aria-label={t("notifications.delete")}
          title={t("notifications.delete")}
          onClick={() => remove([notification.id])}
          className="p-1 text-info hover:text-secondary transition-colors"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </li>
  );
};

const NotificationList = () => {
  const t = useTranslations();
  const { notifications, isLoading } = useNotifications();

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-black">
          {t("notifications.label")}
        </span>
      </div>
      <ScrollArea className="max-h-96">
        {isLoading ? (
          <p className="px-4 py-6 text-sm text-info text-center">
            {t("notifications.loading")}
          </p>
        ) : notifications.length === 0 ? (
          <p className="px-4 py-6 text-sm text-info text-center">
            {t("notifications.empty")}
          </p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
              />
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationList;
