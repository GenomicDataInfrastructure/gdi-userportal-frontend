// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";

const mockGetHelpdeskTopicOptions =
  jest.fn<() => Array<{ value: string; label: string }>>();

jest.mock("@/app/api/helpdesk/config", () => ({
  getHelpdeskTopicOptions: mockGetHelpdeskTopicOptions,
}));

import { GET } from "@/app/api/helpdesk/topics/route";

describe("GET /api/helpdesk/topics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns topics from configuration", async () => {
    mockGetHelpdeskTopicOptions.mockReturnValueOnce([
      { value: "general", label: "General inquiry" },
      { value: "technical", label: "Technical issue" },
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      topics: [
        { value: "general", label: "General inquiry" },
        { value: "technical", label: "Technical issue" },
      ],
    });
  });

  test("returns 500 when config loading fails", async () => {
    mockGetHelpdeskTopicOptions.mockImplementationOnce(() => {
      throw new Error("broken config");
    });

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "broken config",
    });
  });
});
