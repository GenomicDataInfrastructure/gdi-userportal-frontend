// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

const mockIsHarvesterLoggingEnabled = jest.fn<() => boolean>();
const mockGetServerSession =
  jest.fn<(...args: unknown[]) => Promise<unknown>>();
const mockNotFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
const mockRedirect = jest.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`);
});

jest.mock("@/app/api/discovery/local-store/harvester-logs/factory", () => ({
  isHarvesterLoggingEnabled: mockIsHarvesterLoggingEnabled,
}));

jest.mock("next-auth", () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

jest.mock("next/navigation", () => ({
  notFound: () => mockNotFound(),
  redirect: (url: string) => mockRedirect(url),
}));

jest.mock("@/app/api/auth/config", () => ({ authOptions: {} }));

jest.mock("../HarvesterLogsPageClient", () => ({
  __esModule: true,
  default: () => null,
}));

import HarvesterLogsPage from "../page";

describe("HarvesterLogsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns not found when harvester logging is disabled", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(false);

    await expect(
      HarvesterLogsPage({ searchParams: Promise.resolve({ page: "1" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mockGetServerSession).not.toHaveBeenCalled();
  });

  test("redirects unauthenticated users to the homepage", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockGetServerSession.mockResolvedValueOnce(null);

    await expect(
      HarvesterLogsPage({ searchParams: Promise.resolve({ page: "1" }) })
    ).rejects.toThrow("NEXT_REDIRECT:/");
  });

  test("redirects to page=1 when no page query param is set", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockGetServerSession.mockResolvedValueOnce({ user: {} });

    await expect(
      HarvesterLogsPage({ searchParams: Promise.resolve({}) })
    ).rejects.toThrow("NEXT_REDIRECT:/harvester-logs?page=1");
  });

  test("renders the client page for authenticated users with a page param", async () => {
    mockIsHarvesterLoggingEnabled.mockReturnValue(true);
    mockGetServerSession.mockResolvedValueOnce({ user: {} });

    const result = await HarvesterLogsPage({
      searchParams: Promise.resolve({ page: "2" }),
    });

    expect(result).toBeTruthy();
    expect(mockNotFound).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
