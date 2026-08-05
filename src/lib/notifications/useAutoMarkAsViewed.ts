// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from "react";
import { AppNotification } from "@/lib/notifications/types";

export const DEFAULT_MARK_VIEWED_DELAY_MS = 1200;

interface UseAutoMarkAsViewedOptions {
  enabled?: boolean;
  delayMs?: number;
}

/**
 * Marks currently-displayed unread notifications as read a short while
 * after they're shown, so "viewed" is signalled without an explicit click.
 * The scheduling effect intentionally never cancels its own timer on
 * re-render (only on unmount): a poll tick changes the `notifications`
 * array reference, and cancelling in-flight timers for ids already
 * recorded in `scheduledIdsRef` would mean they never get rescheduled.
 * `scheduledIdsRef` entries are cleared once `markRead` settles (success
 * or failure) so an id that becomes unread again later can be rescheduled.
 */
export function useAutoMarkAsViewed(
  notifications: AppNotification[],
  markRead: (ids: string[]) => Promise<void>,
  options?: UseAutoMarkAsViewedOptions
): void {
  const enabled = options?.enabled ?? true;
  const delayMs = options?.delayMs ?? DEFAULT_MARK_VIEWED_DELAY_MS;
  const scheduledIdsRef = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const idsToMark = notifications
      .filter(
        (notification) =>
          !notification.read && !scheduledIdsRef.current.has(notification.id)
      )
      .map((notification) => notification.id);
    if (idsToMark.length === 0) return;

    idsToMark.forEach((id) => scheduledIdsRef.current.add(id));
    const timeoutId = setTimeout(() => {
      timeoutsRef.current.delete(timeoutId);
      markRead(idsToMark).finally(() => {
        idsToMark.forEach((id) => scheduledIdsRef.current.delete(id));
      });
    }, delayMs);
    timeoutsRef.current.add(timeoutId);
  }, [notifications, markRead, enabled, delayMs]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
    };
  }, []);
}
