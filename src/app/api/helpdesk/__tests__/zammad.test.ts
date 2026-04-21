// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { createZammadTicket } from "@/app/api/helpdesk/zammad";

describe("createZammadTicket", () => {
  const originalBaseUrl = process.env.HELPDESK_ZAMMAD_URL;
  const originalApiToken = process.env.HELPDESK_ZAMMAD_API_TOKEN;
  const originalDefaultGroup = process.env.HELPDESK_ZAMMAD_DEFAULT_GROUP;
  const originalTlsInsecure = process.env.HELPDESK_ZAMMAD_TLS_INSECURE;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.HELPDESK_ZAMMAD_URL = "http://localhost:8080";
    process.env.HELPDESK_ZAMMAD_API_TOKEN = "test-token";
    process.env.HELPDESK_ZAMMAD_DEFAULT_GROUP = "Users";
    process.env.HELPDESK_ZAMMAD_TLS_INSECURE = "false";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
    process.env.HELPDESK_ZAMMAD_URL = originalBaseUrl;
    process.env.HELPDESK_ZAMMAD_API_TOKEN = originalApiToken;
    process.env.HELPDESK_ZAMMAD_DEFAULT_GROUP = originalDefaultGroup;
    process.env.HELPDESK_ZAMMAD_TLS_INSECURE = originalTlsInsecure;
  });

  test("uses customer_id guess to allow unknown sender emails", async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: async () => '{"id":73,"customer_id":12}',
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '{"id":12}',
      } as Response);
    global.fetch = fetchMock as typeof fetch;

    const result = await createZammadTicket({
      title: "Portal issue",
      firstName: "Safe",
      lastName: "User",
      email: "safe@lnds.lu",
      topicLabel: "General inquiry",
      topicValue: "general",
      recipientEmail: "bechkal198@gmail.com",
      message: "I cannot see datasets",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/tickets",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Token token=test-token",
          "Content-Type": "application/json",
        }),
      })
    );

    const [, requestInit] = fetchMock.mock.calls[0];
    const payload = JSON.parse((requestInit?.body as string) ?? "{}");

    expect(payload).toEqual(
      expect.objectContaining({
        title: "Portal issue",
        group: "Users",
        customer_id: "guess:safe@lnds.lu",
        article: expect.objectContaining({
          type: "email",
          sender: "Agent",
          to: "bechkal198@gmail.com",
          reply_to: "safe@lnds.lu",
        }),
      })
    );
    expect(payload).not.toHaveProperty("customer");

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://localhost:8080/api/v1/users/12",
      expect.objectContaining({
        method: "PUT",
      })
    );
    const [, userUpdateInit] = fetchMock.mock.calls[1];
    const userUpdatePayload = JSON.parse(
      (userUpdateInit?.body as string) ?? "{}"
    );
    expect(userUpdatePayload).toEqual({
      firstname: "Safe",
      lastname: "User",
      email: "safe@lnds.lu",
    });
    expect(result).toEqual({ ticketId: 73 });
  });

  test("normalizes sender email before guess/reply-to", async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: async () => '{"id":74,"customer_id":13}',
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '{"id":13}',
      } as Response);
    global.fetch = fetchMock as typeof fetch;

    await createZammadTicket({
      title: "Portal issue",
      firstName: "Safe",
      lastName: "User",
      email: "Safe.User@LNDS.LU",
      topicLabel: "General inquiry",
      topicValue: "general",
      recipientEmail: "bechkal198@gmail.com",
      message: "I cannot see datasets",
    });

    const [, requestInit] = fetchMock.mock.calls[0];
    const payload = JSON.parse((requestInit?.body as string) ?? "{}");

    expect(payload).toEqual(
      expect.objectContaining({
        customer_id: "guess:safe.user@lnds.lu",
        article: expect.objectContaining({
          reply_to: "safe.user@lnds.lu",
        }),
      })
    );

    const [, userUpdateInit] = fetchMock.mock.calls[1];
    const userUpdatePayload = JSON.parse(
      (userUpdateInit?.body as string) ?? "{}"
    );
    expect(userUpdatePayload).toEqual(
      expect.objectContaining({
        email: "safe.user@lnds.lu",
      })
    );
  });

  test("falls back to web article when group has no sender email", async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () =>
          `{"error":"No email address found for group 'Users' (1)"}`,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: async () => '{"id":75,"customer_id":14}',
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '{"id":14}',
      } as Response);
    global.fetch = fetchMock as typeof fetch;

    const result = await createZammadTicket({
      title: "Portal issue",
      firstName: "Safe",
      lastName: "User",
      email: "safe@lnds.lu",
      topicLabel: "General inquiry",
      topicValue: "general",
      recipientEmail: "bechkal198@gmail.com",
      message: "I cannot see datasets",
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);

    const [, firstRequestInit] = fetchMock.mock.calls[0];
    const firstPayload = JSON.parse((firstRequestInit?.body as string) ?? "{}");
    expect(firstPayload).toEqual(
      expect.objectContaining({
        article: expect.objectContaining({
          type: "email",
          sender: "Agent",
        }),
      })
    );

    const [, secondRequestInit] = fetchMock.mock.calls[1];
    const secondPayload = JSON.parse(
      (secondRequestInit?.body as string) ?? "{}"
    );
    expect(secondPayload).toEqual(
      expect.objectContaining({
        customer_id: "guess:safe@lnds.lu",
        article: expect.objectContaining({
          type: "web",
          sender: "Customer",
        }),
      })
    );
    expect(secondPayload.article).not.toHaveProperty("to");
    expect(secondPayload.article).not.toHaveProperty("reply_to");

    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "http://localhost:8080/api/v1/users/14",
      expect.objectContaining({
        method: "PUT",
      })
    );
    expect(result).toEqual({ ticketId: 75 });
  });

  test("throws useful error when zammad returns failure response", async () => {
    const fetchMock = jest.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 422,
      text: async () => '{"error":"No lookup value found"}',
    } as Response);
    global.fetch = fetchMock as typeof fetch;

    await expect(
      createZammadTicket({
        title: "Portal issue",
        firstName: "Safe",
        lastName: "User",
        email: "safe@lnds.lu",
        topicLabel: "General inquiry",
        topicValue: "general",
        recipientEmail: "bechkal198@gmail.com",
        message: "I cannot see datasets",
      })
    ).rejects.toThrow(
      'Zammad ticket creation failed with status 422: {"error":"No lookup value found"}'
    );
  });

  test("throws clear connectivity guidance when fetch throws", async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new Error("certificate has expired"));
    global.fetch = fetchMock as typeof fetch;

    await expect(
      createZammadTicket({
        title: "Portal issue",
        firstName: "Safe",
        lastName: "User",
        email: "safe@lnds.lu",
        topicLabel: "General inquiry",
        topicValue: "general",
        recipientEmail: "bechkal198@gmail.com",
        message: "I cannot see datasets",
      })
    ).rejects.toThrow(
      "If this host uses an internal/self-signed certificate, set HELPDESK_ZAMMAD_TLS_INSECURE=true."
    );
  });

  test("mentions disabled TLS verification when configured insecure", async () => {
    process.env.HELPDESK_ZAMMAD_URL = "https://zammad.example.org";
    process.env.HELPDESK_ZAMMAD_TLS_INSECURE = "true";

    const fetchMock = jest
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new Error("fetch failed"));
    global.fetch = fetchMock as typeof fetch;

    await expect(
      createZammadTicket({
        title: "Portal issue",
        firstName: "Safe",
        lastName: "User",
        email: "safe@lnds.lu",
        topicLabel: "General inquiry",
        topicValue: "general",
        recipientEmail: "bechkal198@gmail.com",
        message: "I cannot see datasets",
      })
    ).rejects.toThrow(
      "TLS verification is disabled via HELPDESK_ZAMMAD_TLS_INSECURE=true."
    );
  });

  test("handles non-JSON success response from ticket create", async () => {
    const fetchMock = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      status: 201,
      text: async () => "<html>ok</html>",
    } as Response);
    global.fetch = fetchMock as typeof fetch;

    await expect(
      createZammadTicket({
        title: "Portal issue",
        firstName: "Safe",
        lastName: "User",
        email: "safe@lnds.lu",
        topicLabel: "General inquiry",
        topicValue: "general",
        recipientEmail: "bechkal198@gmail.com",
        message: "I cannot see datasets",
      })
    ).rejects.toThrow("response was not valid JSON");
  });

  test("throws fallback failure when fallback ticket creation fails", async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () =>
          `{"error":"No email address found for group 'Users' (1)"}`,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () => '{"error":"service unavailable"}',
      } as Response);
    global.fetch = fetchMock as typeof fetch;

    await expect(
      createZammadTicket({
        title: "Portal issue",
        firstName: "Safe",
        lastName: "User",
        email: "safe@lnds.lu",
        topicLabel: "General inquiry",
        topicValue: "general",
        recipientEmail: "bechkal198@gmail.com",
        message: "I cannot see datasets",
      })
    ).rejects.toThrow(
      'Zammad ticket creation failed with status 503: {"error":"service unavailable"}'
    );
  });

  test("does not fail when user profile sync request fails", async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        text: async () => '{"id":80,"customer_id":40}',
      } as Response)
      .mockRejectedValueOnce(new Error("user update failed"));
    global.fetch = fetchMock as typeof fetch;

    await expect(
      createZammadTicket({
        title: "Portal issue",
        firstName: "Safe",
        lastName: "User",
        email: "safe@lnds.lu",
        topicLabel: "General inquiry",
        topicValue: "general",
        recipientEmail: "bechkal198@gmail.com",
        message: "I cannot see datasets",
      })
    ).resolves.toEqual({ ticketId: 80 });
  });

  test("skips profile sync when ticket response has no customer_id", async () => {
    const fetchMock = jest.fn<typeof fetch>().mockResolvedValueOnce({
      ok: true,
      status: 201,
      text: async () => '{"id":81}',
    } as Response);
    global.fetch = fetchMock as typeof fetch;

    const result = await createZammadTicket({
      title: "Portal issue",
      firstName: "Safe",
      lastName: "User",
      email: "safe@lnds.lu",
      topicLabel: "General inquiry",
      topicValue: "general",
      recipientEmail: "bechkal198@gmail.com",
      message: "I cannot see datasets",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ticketId: 81 });
  });
});
