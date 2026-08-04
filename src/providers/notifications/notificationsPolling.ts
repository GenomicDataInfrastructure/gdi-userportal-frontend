// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export const DEFAULT_NOTIFICATIONS_POLL_INTERVAL_MS = 60000;

export interface NotificationsPollerOptions {
  refresh: () => void | Promise<void>;
  intervalMs?: number;
}

export interface NotificationsPoller {
  start: () => void;
  stop: () => void;
  dispose: () => void;
}

export function createNotificationsPoller({
  refresh,
  intervalMs = DEFAULT_NOTIFICATIONS_POLL_INTERVAL_MS,
}: NotificationsPollerOptions): NotificationsPoller {
  let timer: ReturnType<typeof setInterval> | null = null;
  let disposed = false;

  const stop = () => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    if (disposed || timer !== null) return;
    timer = setInterval(() => {
      void refresh();
    }, intervalMs);
  };

  const dispose = () => {
    disposed = true;
    stop();
  };

  return { start, stop, dispose };
}
