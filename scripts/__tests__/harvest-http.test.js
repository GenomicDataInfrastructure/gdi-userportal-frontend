// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

const {
  buildHarvestApiUrl,
  formatErrorDetails,
  requestHarvest,
  truncateText,
} = require("../harvest-http");

describe("harvest-http", () => {
  test("builds harvest API URLs without duplicate slashes", () => {
    expect(buildHarvestApiUrl("https://example.org///")).toBe(
      "https://example.org/api/discovery/harvest"
    );
  });

  test("formats nested error causes with network context", () => {
    const rootCause = new Error("lookup failed");
    rootCause.code = "ENOTFOUND";
    rootCause.errno = -3008;
    rootCause.syscall = "getaddrinfo";
    rootCause.hostname = "catalogue.example";
    rootCause.host = "catalogue.example";
    rootCause.port = 443;
    const error = new Error("fetch failed", { cause: rootCause });

    expect(formatErrorDetails(error)).toBe(
      "fetch failed | cause: lookup failed (code=ENOTFOUND, errno=-3008, syscall=getaddrinfo, hostname=catalogue.example, host=catalogue.example, port=443)"
    );
    expect(formatErrorDetails("plain failure")).toBe("plain failure");
  });

  test("formats nested error causes without network context", () => {
    const error = new Error("fetch failed", {
      cause: new Error("socket closed"),
    });

    expect(formatErrorDetails(error)).toBe(
      "fetch failed | cause: socket closed"
    );
  });

  test("truncates compacted response text", () => {
    expect(truncateText("  hello\n\nworld  ")).toBe("hello world");
    expect(truncateText("")).toBe("");
    expect(truncateText({})).toBe("");
    expect(truncateText("abcdef", 3)).toBe("abc...");
  });

  test("posts a harvest request and returns the harvested count", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(JSON.stringify({ count: 3 })),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).resolves.toBe(3);

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost:3000/api/discovery/harvest",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-harvest-secret": "secret",
        },
        body: JSON.stringify({ url: "https://catalogue.example/dcat" }),
      })
    );
  });

  test("posts a harvest file path when provided", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(JSON.stringify({ count: 1 })),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourcePath: "no-data-dict.rdf",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).resolves.toBe(1);

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost:3000/api/discovery/harvest",
      expect.objectContaining({
        body: JSON.stringify({ path: "no-data-dict.rdf" }),
      })
    );
  });

  test("reports fetch failures using the catalogue file when sourcePath is set", async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new Error("connect failed"));

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourcePath: "no-data-dict.rdf",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).rejects.toThrow("requested catalogue file: no-data-dict.rdf");
  });

  test("returns zero when the harvest response has no JSON body", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(""),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).resolves.toBe(0);
  });

  test("adds an undici dispatcher for HTTPS harvest API URLs", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue("{}"),
    });

    await requestHarvest(
      {
        apiUrl: " HTTPS://hub.example/api/discovery/harvest ",
        sourceUrl: "https://catalogue.example/dcat",
        secret: "secret",
      },
      { fetchImpl, timeoutMs: 10 }
    );

    expect(fetchImpl.mock.calls[0][1]).toEqual(
      expect.objectContaining({ dispatcher: expect.any(Object) })
    );
  });

  test("wraps fetch failures with request context", async () => {
    const error = new Error("connect failed");
    error.cause = new Error("socket closed");
    const fetchImpl = jest.fn().mockRejectedValue(error);

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).rejects.toThrow("Failed to call harvest API");
  });

  test("wraps response body read failures", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 502,
      statusText: "Bad Gateway",
      text: jest.fn().mockRejectedValue(new Error("stream failed")),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).rejects.toThrow("Failed to read harvest API response");
  });

  test("reports invalid JSON responses with a truncated body", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: jest.fn().mockResolvedValue("not json"),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).rejects.toThrow("returned invalid JSON");
  });

  test("reports blank invalid JSON responses as empty", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: jest.fn().mockResolvedValue("   "),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).rejects.toThrow("body: <empty>");
  });

  test("reports failed harvest responses using payload errors", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: jest.fn().mockResolvedValue(JSON.stringify({ error: "bad dcat" })),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl, timeoutMs: 10 }
      )
    ).rejects.toThrow("error: bad dcat");
  });

  test("reports failed harvest responses using text or status fallback", async () => {
    const textErrorFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: jest.fn().mockResolvedValue(JSON.stringify({ message: "ignored" })),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl: textErrorFetch, timeoutMs: 10 }
      )
    ).rejects.toThrow('error: {"message":"ignored"}');

    const statusFallbackFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      text: jest.fn().mockResolvedValue(""),
    });

    await expect(
      requestHarvest(
        {
          apiUrl: "http://localhost:3000/api/discovery/harvest",
          sourceUrl: "https://catalogue.example/dcat",
          secret: "secret",
        },
        { fetchImpl: statusFallbackFetch, timeoutMs: 10 }
      )
    ).rejects.toThrow("error: Bad Gateway");
  });
});
