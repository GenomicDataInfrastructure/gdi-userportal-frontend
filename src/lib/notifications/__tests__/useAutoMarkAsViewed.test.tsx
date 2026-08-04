/**
 * @jest-environment jsdom
 */

// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { jest } from "@jest/globals";
import type { AppNotification } from "@/lib/notifications/types";
import { useAutoMarkAsViewed } from "../useAutoMarkAsViewed";

const notification = (
  id: string,
  read: boolean
): AppNotification => ({
  id,
  title: "title",
  message: "message",
  createdAt: "2026-07-01T00:00:00.000Z",
  read,
});

describe("useAutoMarkAsViewed", () => {
  let container: HTMLDivElement;
  let root: Root;
  let isUnmounted: boolean;

  beforeEach(() => {
    jest.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
    isUnmounted = false;
  });

  const unmountRoot = () => {
    if (isUnmounted) return;
    isUnmounted = true;
    act(() => {
      root.unmount();
    });
  };

  afterEach(() => {
    unmountRoot();
    container.remove();
    jest.useRealTimers();
  });

  const Harness = ({
    notifications,
    markRead,
    enabled,
  }: {
    notifications: AppNotification[];
    markRead: (ids: string[]) => Promise<void>;
    enabled?: boolean;
  }) => {
    useAutoMarkAsViewed(notifications, markRead, { enabled, delayMs: 1000 });
    return null;
  };

  const render = (props: {
    notifications: AppNotification[];
    markRead: (ids: string[]) => Promise<void>;
    enabled?: boolean;
  }) => {
    act(() => {
      root = createRoot(container);
      root.render(<Harness {...props} />);
    });
  };

  const rerender = (props: {
    notifications: AppNotification[];
    markRead: (ids: string[]) => Promise<void>;
    enabled?: boolean;
  }) => {
    act(() => {
      root.render(<Harness {...props} />);
    });
  };

  test("marks unread notifications as read once the delay elapses", async () => {
    const markRead = jest.fn<(ids: string[]) => Promise<void>>(async () => {});
    render({ notifications: [notification("1", false)], markRead });

    expect(markRead).not.toHaveBeenCalled();

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
    });

    expect(markRead).toHaveBeenCalledWith(["1"]);
  });

  test("never schedules already-read notifications", async () => {
    const markRead = jest.fn<(ids: string[]) => Promise<void>>(async () => {});
    render({ notifications: [notification("1", true)], markRead });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(5000);
    });

    expect(markRead).not.toHaveBeenCalled();
  });

  test("does not schedule the same id twice across re-renders", async () => {
    const markRead = jest.fn<(ids: string[]) => Promise<void>>(async () => {});
    render({ notifications: [notification("1", false)], markRead });

    rerender({ notifications: [notification("1", false)], markRead });
    rerender({ notifications: [notification("1", false)], markRead });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
    });

    expect(markRead).toHaveBeenCalledTimes(1);
  });

  test("does not schedule anything while disabled", async () => {
    const markRead = jest.fn<(ids: string[]) => Promise<void>>(async () => {});
    render({
      notifications: [notification("1", false)],
      markRead,
      enabled: false,
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(5000);
    });

    expect(markRead).not.toHaveBeenCalled();
  });

  test("cancels the pending call when unmounted before the delay elapses", async () => {
    const markRead = jest.fn<(ids: string[]) => Promise<void>>(async () => {});
    render({ notifications: [notification("1", false)], markRead });

    unmountRoot();

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1000);
    });

    expect(markRead).not.toHaveBeenCalled();
  });
});
