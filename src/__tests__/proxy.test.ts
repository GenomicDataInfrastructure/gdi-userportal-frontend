// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { proxy } from "../proxy";
import { adapter } from "next/dist/server/web/adapter";

// Next.js installs this Node runtime global before loading the proxy.
jest.mock("next/server", () => {
  Object.assign(globalThis, {
    AsyncLocalStorage: jest.requireActual("node:async_hooks").AsyncLocalStorage,
  });
  return jest.requireActual("next/server");
});

jest.mock("@/i18n/routing", () => ({ routing: { locales: ["en", "fr"] } }));
jest.mock("next-auth/jwt", () => ({ getToken: jest.fn() }));
jest.mock("next-intl/middleware", () => ({
  __esModule: true,
  default: () => () => mockLocaleResponse,
}));

const originalNextAuthUrl = process.env.NEXTAUTH_URL;

afterEach(() => {
  if (originalNextAuthUrl === undefined) delete process.env.NEXTAUTH_URL;
  else process.env.NEXTAUTH_URL = originalNextAuthUrl;
});

let mockLocaleResponse: NextResponse;
const mockGetToken = jest.mocked(getToken);

function expectRedirectResponse(response: NextResponse) {
  expect(response.status).toBeGreaterThanOrEqual(300);
  expect(response.status).toBeLessThan(400);
}

beforeEach(() => {
  delete process.env.NEXTAUTH_URL;
  jest.clearAllMocks();
  mockLocaleResponse = NextResponse.next();
  mockGetToken.mockResolvedValue(null);
});

test.each([
  "/requests?tab=applications",
  "/requests?tab=entitlements",
  "/requests/",
  "/applications/123",
  "/en/requests?tab=applications",
  "/en/requests?tab=entitlements",
  "/fr/requests?tab=entitlements",
  "/fr/applications/123",
])("requires sign-in for logged-out navigation to %s", async (path) => {
  const request = new NextRequest(`http://localhost:3000${path}`);
  const response = await proxy(request);
  expectRedirectResponse(response);
  const location = new URL(response.headers.get("location")!);
  expect(location.pathname).toBe("/login");
  expect(location.searchParams.get("callbackUrl")).toBe(
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  expect(mockGetToken).toHaveBeenCalledWith({
    req: request,
    secureCookie: false,
  });
});

test("passes secureCookie: true when the request arrives over HTTPS", async () => {
  const request = new NextRequest("https://portal.example.org/requests");
  await proxy(request);
  expect(mockGetToken).toHaveBeenCalledWith({
    req: request,
    secureCookie: true,
  });
});

test("passes secureCookie: true when forwarded by a TLS-terminating proxy", async () => {
  const request = new NextRequest("http://localhost:3000/requests", {
    headers: { "x-forwarded-proto": "https" },
  });
  await proxy(request);
  expect(mockGetToken).toHaveBeenCalledWith({
    req: request,
    secureCookie: true,
  });
});

test("passes secureCookie: true for the client-facing protocol in a forwarded-proto chain", async () => {
  const request = new NextRequest("http://localhost:3000/requests", {
    headers: { "x-forwarded-proto": "https, http" },
  });
  await proxy(request);
  expect(mockGetToken).toHaveBeenCalledWith({
    req: request,
    secureCookie: true,
  });
});

test("passes secureCookie: true when NEXTAUTH_URL is https, even without a forwarded header", async () => {
  const originalNextAuthUrl = process.env.NEXTAUTH_URL;
  process.env.NEXTAUTH_URL = "https://portal.example.org";
  try {
    const request = new NextRequest("http://localhost:3000/requests");
    await proxy(request);
    expect(mockGetToken).toHaveBeenCalledWith({
      req: request,
      secureCookie: true,
    });
  } finally {
    process.env.NEXTAUTH_URL = originalNextAuthUrl;
  }
});

test("locale redirects cannot bypass authentication", async () => {
  mockLocaleResponse = NextResponse.redirect(
    "http://localhost:3000/en/requests"
  );
  const response = await proxy(
    new NextRequest("http://localhost:3000/requests")
  );
  expectRedirectResponse(response);
  expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
});

test("authenticated navigation preserves locale routing", async () => {
  mockGetToken.mockResolvedValue({ sub: "user-1" });
  mockLocaleResponse = NextResponse.redirect(
    "http://localhost:3000/en/requests"
  );
  const response = await proxy(
    new NextRequest("http://localhost:3000/requests")
  );
  expect(response).toBe(mockLocaleResponse);
});

test.each(["/", "/datasets", "/en/datasets", "/requests-other"])(
  "public route %s remains accessible",
  async (path) => {
    expect(await proxy(new NextRequest(`http://localhost:3000${path}`))).toBe(
      mockLocaleResponse
    );
    expect(mockGetToken).not.toHaveBeenCalled();
  }
);

test.each(["applications", "entitlements"])(
  "redirects %s through the Next.js adapter using the configured public origin",
  async (tab) => {
    process.env.NEXTAUTH_URL = "https://portal.dev.gdi.lu";
    const { response, waitUntil } = await adapter({
      handler: proxy,
      page: "/proxy",
      request: {
        url: `http://internal:3000/requests?tab=${tab}`,
        method: "GET",
        headers: {
          host: "internal:3000",
          "x-forwarded-host": "untrusted.example",
          "x-forwarded-proto": "https",
        },
        signal: new AbortController().signal,
      },
    });
    await waitUntil;
    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("location")!);
    expect(location.origin).toBe("https://portal.dev.gdi.lu");
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("callbackUrl")).toBe(
      `/requests?tab=${tab}`
    );
  }
);

test("uses the request origin for local development without NEXTAUTH_URL", async () => {
  const response = await proxy(
    new NextRequest("http://localhost:3000/requests?tab=entitlements")
  );
  const location = new URL(response.headers.get("location")!);
  expect(location.origin).toBe("http://localhost:3000");
  expect(location.pathname).toBe("/login");
  expect(location.searchParams.get("callbackUrl")).toBe(
    "/requests?tab=entitlements"
  );
});
