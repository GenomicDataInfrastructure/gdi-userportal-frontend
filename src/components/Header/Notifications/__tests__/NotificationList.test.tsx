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

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

jest.mock("@/components/shadcn/scroll-area", () => ({
  ScrollArea: ({
    children,
    onViewportScroll,
  }: {
    children: React.ReactNode;
    onViewportScroll?: (event: unknown) => void;
  }) => (
    <div
      data-testid="scroll-area"
      onScroll={onViewportScroll as React.UIEventHandler<HTMLDivElement>}
    >
      {children}
    </div>
  ),
}));

jest.mock("@/lib/notifications/useAutoMarkAsViewed", () => ({
  useAutoMarkAsViewed: jest.fn(),
}));

const mockUseNotifications = jest.fn();
jest.mock("@/providers/notifications/NotificationsProvider", () => ({
  useNotifications: () => mockUseNotifications(),
}));

const mockUseNotificationsPagination = jest.fn();
jest.mock("@/lib/notifications/useNotificationsPagination", () => ({
  useNotificationsPagination: (base: AppNotification[]) =>
    mockUseNotificationsPagination(base),
}));

import NotificationList from "../NotificationList";

const notification = (id: string, read: boolean): AppNotification => ({
  id,
  title: `title-${id}`,
  message: `message-${id}`,
  createdAt: "2026-07-01T00:00:00.000Z",
  read,
});

describe("NotificationList", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const render = (
    state: Record<string, unknown>,
    paginationState: Record<string, unknown> = {}
  ) => {
    const baseNotifications = (state.notifications as AppNotification[]) ?? [];
    mockUseNotifications.mockReturnValue({
      notifications: baseNotifications,
      isLoading: false,
      error: false,
      refresh: jest.fn(),
      markRead: jest.fn(),
      remove: jest.fn(),
      ...state,
    });
    mockUseNotificationsPagination.mockReturnValue({
      notifications: baseNotifications,
      hasMore: false,
      isLoadingMore: false,
      loadMoreError: false,
      loadMore: jest.fn(),
      applyMarkRead: jest.fn(),
      applyRemove: jest.fn(),
      ...paginationState,
    });
    act(() => {
      root = createRoot(container);
      root.render(<NotificationList />);
    });
  };

  test("shows the loading state", () => {
    render({ isLoading: true });
    expect(container.textContent).toContain("notifications.loading");
  });

  test("shows an error state with a retry action", () => {
    const refresh = jest.fn();
    render({ error: true, refresh });

    expect(container.textContent).toContain("notifications.error");
    const retryButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "notifications.retry"
    );
    expect(retryButton).toBeTruthy();

    act(() => {
      retryButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(refresh).toHaveBeenCalled();
  });

  test("shows the empty state when there are genuinely no notifications", () => {
    render({ notifications: [] });
    expect(container.textContent).toContain("notifications.empty");
  });

  test("renders the notification list", () => {
    render({
      notifications: [notification("1", false), notification("2", true)],
    });
    expect(container.textContent).toContain("title-1");
    expect(container.textContent).toContain("title-2");
  });

  test("always renders a link to the full notifications page", () => {
    render({ notifications: [] });
    const link = container.querySelector('a[href="/notifications"]');
    expect(link).toBeTruthy();
    expect(link?.textContent).toBe("notifications.viewAll");
  });

  test("triggers loadMore when scrolled near the bottom", () => {
    const loadMore = jest.fn();
    render(
      { notifications: [notification("1", false)] },
      { hasMore: true, loadMore }
    );

    const scrollArea = container.querySelector(
      '[data-testid="scroll-area"]'
    ) as HTMLElement;
    Object.defineProperties(scrollArea, {
      scrollHeight: { value: 500, configurable: true },
      scrollTop: { value: 480, configurable: true },
      clientHeight: { value: 100, configurable: true },
    });

    act(() => {
      scrollArea.dispatchEvent(new Event("scroll", { bubbles: false }));
    });

    expect(loadMore).toHaveBeenCalled();
  });

  test("does not trigger loadMore when far from the bottom or hasMore is false", () => {
    const loadMore = jest.fn();
    render(
      { notifications: [notification("1", false)] },
      { hasMore: false, loadMore }
    );

    const scrollArea = container.querySelector(
      '[data-testid="scroll-area"]'
    ) as HTMLElement;
    Object.defineProperties(scrollArea, {
      scrollHeight: { value: 500, configurable: true },
      scrollTop: { value: 480, configurable: true },
      clientHeight: { value: 100, configurable: true },
    });

    act(() => {
      scrollArea.dispatchEvent(new Event("scroll", { bubbles: false }));
    });

    expect(loadMore).not.toHaveBeenCalled();
  });

  test("shows a loading-more indicator while fetching the next page", () => {
    render(
      { notifications: [notification("1", false)] },
      { isLoadingMore: true }
    );
    expect(container.textContent).toContain("notifications.loading");
  });

  test("shows a retry action when loading more fails", () => {
    const loadMore = jest.fn();
    render(
      { notifications: [notification("1", false)] },
      { loadMoreError: true, loadMore }
    );

    const retryButtons = Array.from(
      container.querySelectorAll("button")
    ).filter((button) => button.textContent === "notifications.retry");
    expect(retryButtons.length).toBeGreaterThan(0);

    act(() => {
      retryButtons[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(loadMore).toHaveBeenCalled();
  });
});
