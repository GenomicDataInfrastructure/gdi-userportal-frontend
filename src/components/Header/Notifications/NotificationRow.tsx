// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Link } from "@/i18n/navigation";
import { resolveNotificationLink } from "@/lib/notifications/resolveNotificationLink";
import { AppNotification } from "@/lib/notifications/types";
import { formatDateTime } from "@/utils/formatDate";
import { cn } from "@/utils/tailwindMerge";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

interface NotificationRowProps {
  notification: AppNotification;
  onMarkRead: (ids: string[]) => void | Promise<void>;
  onRemove: (ids: string[]) => void | Promise<void>;
}

const NotificationRow = ({
  notification,
  onMarkRead,
  onRemove,
}: NotificationRowProps) => {
  const t = useTranslations();
  const href = resolveNotificationLink(notification);

  const content = (
    <div className="flex flex-1 flex-col gap-y-1 min-w-0">
      <span
        className={cn(
          "text-sm text-primary",
          !notification.read && "font-semibold"
        )}
      >
        {notification.title}
      </span>
      <span className="text-sm text-black line-clamp-2">
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
            if (!notification.read) onMarkRead([notification.id]);
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
            onClick={() => onMarkRead([notification.id])}
            className="p-1 text-info hover:text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
        <button
          type="button"
          aria-label={t("notifications.delete")}
          title={t("notifications.delete")}
          onClick={() => onRemove([notification.id])}
          className="p-1 text-secondary hover:opacity-75 transition-opacity"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </li>
  );
};

export default NotificationRow;
