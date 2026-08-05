/**
 * @jest-environment jsdom
 */

// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, Suspense } from "react";
import { createRoot, type Root } from "react-dom/client";
import { jest } from "@jest/globals";
import type {
  AppNotification,
  ListNotificationsResult,
} from "@/lib/notifications/types";

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

jest.mock("@/components/PageContainer", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockListNotificationsApi =
  jest.fn<(params?: unknown) => Promise<ListNotificationsResult>>();
jest.mock("@/app/api/notifications", () => ({
  listNotificationsApi: (params?: unknown) => mockListNotificationsApi(params),
}));

const mockUseNotifications = jest.fn();
jest.mock("@/providers/notifications/NotificationsProvider", () => ({
  useNotifications: () => mockUseNotifications(),
}));

import NotificationsPage from "../page";

const notification = (id: string, read = false): AppNotification => ({
  id,
  title: `title-${id}`,
  message: `message-${id}`,
  createdAt: "2026-07-01T00:00:00.000Z",
  read,
});

const PAGE_SIZE = 20;
const fullPage = (prefix: string): AppNotification[] =>
  Array.from({ length: PAGE_SIZE }, (_, i) => notification(`${prefix}-${i}`));

describe("NotificationsPage", () => {
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

  const render = async (state: Record<string, unknown>) => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      isLoading: false,
      error: false,
      refresh: jest.fn(),
      markRead: jest.fn(async () => {}),
      remove: jest.fn(async () => {}),
      ...state,
    });
    await act(async () => {
      root = createRoot(container);
      root.render(
        <Suspense fallback={null}>
          <NotificationsPage searchParams={Promise.resolve({})} />
        </Suspense>
      );
      await Promise.resolve();
    });
  };

  test("renders the base list from the provider", async () => {
    await render({ notifications: [notification("1"), notification("2")] });

    expect(container.textContent).toContain("title-1");
    expect(container.textContent).toContain("title-2");
  });

  test("shows the error state with a working retry", async () => {
    const refresh = jest.fn();
    await render({ error: true, refresh });

    expect(container.textContent).toContain("notifications.error");
    const retryButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "notifications.retry"
    );
    act(() => {
      retryButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(refresh).toHaveBeenCalled();
  });

  test("load more appends a page and hides once a short page is returned", async () => {
    await render({ notifications: fullPage("base") });

    const loadMoreButton = Array.from(
      container.querySelectorAll("button")
    ).find((button) => button.textContent === "notifications.loadMore");
    expect(loadMoreButton).toBeTruthy();

    mockListNotificationsApi.mockResolvedValueOnce({
      items: [notification("extra-1")],
      total: PAGE_SIZE + 1,
    });

    await act(async () => {
      loadMoreButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockListNotificationsApi).toHaveBeenCalledWith({
      page: 2,
      limit: PAGE_SIZE,
    });
    expect(container.textContent).toContain("title-extra-1");
    expect(
      Array.from(container.querySelectorAll("button")).some(
        (button) => button.textContent === "notifications.loadMore"
      )
    ).toBe(false);
  });

  test("a failed load more shows an inline retry without disturbing the existing list", async () => {
    await render({ notifications: fullPage("base") });

    mockListNotificationsApi.mockRejectedValueOnce(new Error("down"));

    const loadMoreButton = Array.from(
      container.querySelectorAll("button")
    ).find((button) => button.textContent === "notifications.loadMore");

    await act(async () => {
      loadMoreButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.textContent).toContain("title-base-0");
    expect(
      Array.from(container.querySelectorAll("button")).some(
        (button) => button.textContent === "notifications.retry"
      )
    ).toBe(true);
  });

  test("marking a loaded-more item read triggers exactly one API call", async () => {
    const markRead = jest.fn(async () => {});
    await render({ notifications: fullPage("base"), markRead });

    mockListNotificationsApi.mockResolvedValueOnce({
      items: [notification("extra-1", false)],
      total: PAGE_SIZE + 1,
    });
    const loadMoreButton = Array.from(
      container.querySelectorAll("button")
    ).find((button) => button.textContent === "notifications.loadMore");
    await act(async () => {
      loadMoreButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await Promise.resolve();
      await Promise.resolve();
    });

    const markReadButton = container.querySelector(
      '[aria-label="notifications.markRead"]'
    ) as HTMLElement | null;
    await act(async () => {
      markReadButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await Promise.resolve();
    });

    expect(markRead).toHaveBeenCalledTimes(1);
  });
});
