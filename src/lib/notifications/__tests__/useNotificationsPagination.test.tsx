/**
 * @jest-environment jsdom
 */

// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { jest } from "@jest/globals";
import type {
  AppNotification,
  ListNotificationsResult,
} from "@/lib/notifications/types";

const mockListNotificationsApi =
  jest.fn<(params?: unknown) => Promise<ListNotificationsResult>>();
jest.mock("@/app/api/notifications", () => ({
  listNotificationsApi: (params?: unknown) => mockListNotificationsApi(params),
}));

import { useNotificationsPagination } from "../useNotificationsPagination";

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

let latestState: ReturnType<typeof useNotificationsPagination> | undefined;

const Probe = ({ base }: { base: AppNotification[] }) => {
  const state = useNotificationsPagination(base);
  useEffect(() => {
    latestState = state;
  });
  return null;
};

describe("useNotificationsPagination", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    jest.clearAllMocks();
    latestState = undefined;
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const render = (base: AppNotification[]) => {
    act(() => {
      root = createRoot(container);
      root.render(<Probe base={base} />);
    });
  };

  test("starts with the base list and hasMore true", () => {
    render([notification("1")]);
    expect(latestState?.notifications.map((n) => n.id)).toEqual(["1"]);
    expect(latestState?.hasMore).toBe(true);
  });

  test("appends the next page on loadMore", async () => {
    render(fullPage("base"));
    mockListNotificationsApi.mockResolvedValueOnce({
      items: [notification("extra-1")],
      total: PAGE_SIZE + 1,
    });

    await act(async () => {
      await latestState?.loadMore();
    });

    expect(mockListNotificationsApi).toHaveBeenCalledWith({
      page: 2,
      limit: PAGE_SIZE,
    });
    expect(latestState?.notifications).toHaveLength(PAGE_SIZE + 1);
    expect(latestState?.hasMore).toBe(false);
  });

  test("keeps hasMore true when a full page comes back", async () => {
    render(fullPage("base"));
    mockListNotificationsApi.mockResolvedValueOnce({
      items: fullPage("extra"),
      total: PAGE_SIZE * 2,
    });

    await act(async () => {
      await latestState?.loadMore();
    });

    expect(latestState?.hasMore).toBe(true);
  });

  test("sets loadMoreError and preserves the existing list on failure", async () => {
    render([notification("1")]);
    mockListNotificationsApi.mockRejectedValueOnce(new Error("down"));

    await act(async () => {
      await latestState?.loadMore();
    });

    expect(latestState?.loadMoreError).toBe(true);
    expect(latestState?.notifications.map((n) => n.id)).toEqual(["1"]);
  });

  test("guards against overlapping loadMore calls", async () => {
    render(fullPage("base"));
    let resolveFirst!: (value: ListNotificationsResult) => void;
    mockListNotificationsApi.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFirst = resolve;
      })
    );

    let firstCall!: Promise<void>;
    let secondCall!: Promise<void>;
    act(() => {
      firstCall = latestState!.loadMore();
      secondCall = latestState!.loadMore();
    });

    expect(mockListNotificationsApi).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFirst({ items: [notification("extra-1")], total: PAGE_SIZE + 1 });
      await firstCall;
      await secondCall;
    });
  });

  test("applyMarkRead marks loaded-more items as read locally", async () => {
    render(fullPage("base"));
    mockListNotificationsApi.mockResolvedValueOnce({
      items: [notification("extra-1", false)],
      total: PAGE_SIZE + 1,
    });
    await act(async () => {
      await latestState?.loadMore();
    });

    act(() => {
      latestState?.applyMarkRead(["extra-1"]);
    });

    const extra = latestState?.notifications.find((n) => n.id === "extra-1");
    expect(extra?.read).toBe(true);
  });

  test("applyRemove removes loaded-more items locally", async () => {
    render(fullPage("base"));
    mockListNotificationsApi.mockResolvedValueOnce({
      items: [notification("extra-1")],
      total: PAGE_SIZE + 1,
    });
    await act(async () => {
      await latestState?.loadMore();
    });

    act(() => {
      latestState?.applyRemove(["extra-1"]);
    });

    expect(latestState?.notifications.some((n) => n.id === "extra-1")).toBe(
      false
    );
  });

  test("de-duplicates ids shared between the base list and loaded-more pages", async () => {
    render(fullPage("base"));
    mockListNotificationsApi.mockResolvedValueOnce({
      items: [notification("base-0")],
      total: PAGE_SIZE,
    });

    await act(async () => {
      await latestState?.loadMore();
    });

    const ids = latestState?.notifications.map((n) => n.id) ?? [];
    expect(ids.filter((id) => id === "base-0")).toHaveLength(1);
  });
});
