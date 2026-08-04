// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { createNotificationsPoller } from "../notificationsPolling";

describe("createNotificationsPoller", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test("start schedules repeating calls at the given interval", async () => {
    const refresh = jest.fn<() => void>();
    const poller = createNotificationsPoller({ refresh, intervalMs: 1000 });

    poller.start();
    expect(refresh).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1000);
    expect(refresh).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(2000);
    expect(refresh).toHaveBeenCalledTimes(3);
  });

  test("calling start twice does not schedule a second interval", async () => {
    const refresh = jest.fn<() => void>();
    const poller = createNotificationsPoller({ refresh, intervalMs: 1000 });

    poller.start();
    poller.start();
    await jest.advanceTimersByTimeAsync(1000);

    expect(refresh).toHaveBeenCalledTimes(1);
  });

  test("stop halts further calls without disposing", async () => {
    const refresh = jest.fn<() => void>();
    const poller = createNotificationsPoller({ refresh, intervalMs: 1000 });

    poller.start();
    await jest.advanceTimersByTimeAsync(1000);
    poller.stop();
    await jest.advanceTimersByTimeAsync(3000);
    expect(refresh).toHaveBeenCalledTimes(1);

    poller.start();
    await jest.advanceTimersByTimeAsync(1000);
    expect(refresh).toHaveBeenCalledTimes(2);
  });

  test("dispose is terminal: a subsequent start is a no-op", async () => {
    const refresh = jest.fn<() => void>();
    const poller = createNotificationsPoller({ refresh, intervalMs: 1000 });

    poller.start();
    poller.dispose();
    poller.start();
    await jest.advanceTimersByTimeAsync(3000);

    expect(refresh).not.toHaveBeenCalled();
  });
});
