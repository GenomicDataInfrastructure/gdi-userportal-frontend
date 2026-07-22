// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { useNotifications } from "@/providers/notifications/NotificationsProvider";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import NotificationList from "./NotificationList";

const NotificationBell = () => {
  const t = useTranslations();
  const { enabled, unreadCount } = useNotifications();

  if (!enabled) return null;

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t("notifications.label")}
        className="relative flex items-center text-info hover:text-secondary transition-opacity duration-300 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <FontAwesomeIcon icon={faBell} className="text-2xl lg:text-3xl" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 inline-flex -translate-y-1/3 translate-x-1/2 transform items-center justify-center rounded-full bg-secondary px-2.5 py-1.5 text-sm font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
