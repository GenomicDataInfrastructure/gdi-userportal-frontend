// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import type { HelpdeskTopicRouting } from "@/app/api/helpdesk/config";

const mockGetHelpdeskTopicByValue =
  jest.fn<(value: string) => HelpdeskTopicRouting | undefined>();
const mockCreateZammadTicket =
  jest.fn<(input: unknown) => Promise<{ ticketId?: number }>>();

jest.mock("@/app/api/helpdesk/config", () => ({
  getHelpdeskTopicByValue: mockGetHelpdeskTopicByValue,
}));

jest.mock("@/app/api/helpdesk/zammad", () => ({
  createZammadTicket: mockCreateZammadTicket,
}));

import { POST } from "@/app/api/helpdesk/contact/route";

describe("POST /api/helpdesk/contact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 if firstName is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          lastName: "Doe",
          email: "john@example.org",
          topic: "general",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "firstName"',
    });
  });

  test("returns 400 if email is invalid", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "invalid-email",
          topic: "general",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Field "email" must be a valid email address',
    });
  });

  test("returns 400 if lastName is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          email: "john@example.org",
          topic: "general",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "lastName"',
    });
  });

  test("returns 400 if email is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          topic: "general",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "email"',
    });
  });

  test("returns 400 if topic is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "topic"',
    });
  });

  test("returns 400 if title is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          topic: "general",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "title"',
    });
  });

  test("returns 400 if title is too long", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          topic: "general",
          title: "A".repeat(161),
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Field "title" must not exceed 160 characters',
    });
  });

  test("returns 400 if message is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          topic: "general",
          title: "Need support",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing required field "message"',
    });
  });

  test("returns 400 if message is too long", async () => {
    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          topic: "general",
          title: "Need support",
          message: "A".repeat(4001),
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Field "message" must not exceed 4000 characters',
    });
  });

  test("returns 400 if topic is unknown", async () => {
    mockGetHelpdeskTopicByValue.mockReturnValueOnce(undefined);

    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          topic: "unknown",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Unknown topic "unknown"',
    });
  });

  test("creates zammad ticket when payload is valid", async () => {
    mockGetHelpdeskTopicByValue.mockReturnValueOnce({
      value: "general",
      label: "General inquiry",
      recipientEmail: "helpdesk@example.org",
      zammadGroup: "Users",
    });
    mockCreateZammadTicket.mockResolvedValueOnce({ ticketId: 42 });

    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          topic: "general",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(mockCreateZammadTicket).toHaveBeenCalledWith({
      title: "Need support",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.org",
      message: "Help",
      topicLabel: "General inquiry",
      topicValue: "general",
      recipientEmail: "helpdesk@example.org",
      group: "Users",
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      ticketId: 42,
    });
  });

  test("returns 500 when zammad integration fails", async () => {
    mockGetHelpdeskTopicByValue.mockReturnValueOnce({
      value: "general",
      label: "General inquiry",
      recipientEmail: "helpdesk@example.org",
      zammadGroup: "Users",
    });
    mockCreateZammadTicket.mockRejectedValueOnce(
      new Error("Zammad unavailable")
    );

    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          topic: "general",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Your request could not be submitted. Please try again.",
    });
  });

  test("returns generic 500 message when non-Error is thrown", async () => {
    mockGetHelpdeskTopicByValue.mockReturnValueOnce({
      value: "general",
      label: "General inquiry",
      recipientEmail: "helpdesk@example.org",
      zammadGroup: "Users",
    });
    mockCreateZammadTicket.mockRejectedValueOnce("boom");

    const response = await POST(
      new Request("http://localhost/api/helpdesk/contact", {
        method: "POST",
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.org",
          topic: "general",
          title: "Need support",
          message: "Help",
        }),
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Your request could not be submitted. Please try again.",
    });
  });
});
