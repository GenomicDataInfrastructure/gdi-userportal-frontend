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

/**
 * Uses a self-rescheduling `setTimeout` rather than `setInterval`: the next
 * tick is only scheduled once `refresh` settles, so a slow or failing
 * refresh can never overlap with another one already in flight.
 */
export function createNotificationsPoller({
  refresh,
  intervalMs = DEFAULT_NOTIFICATIONS_POLL_INTERVAL_MS,
}: NotificationsPollerOptions): NotificationsPoller {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;
  let stopped = true;

  const scheduleNext = () => {
    if (disposed || stopped) return;
    timer = setTimeout(runTick, intervalMs);
  };

  const runTick = () => {
    timer = null;
    Promise.resolve()
      .then(() => refresh())
      .catch(() => {})
      .finally(scheduleNext);
  };

  const stop = () => {
    stopped = true;
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const start = () => {
    if (disposed || !stopped) return;
    stopped = false;
    scheduleNext();
  };

  const dispose = () => {
    disposed = true;
    stop();
  };

  return { start, stop, dispose };
}
