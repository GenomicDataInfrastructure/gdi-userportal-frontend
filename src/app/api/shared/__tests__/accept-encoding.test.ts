// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { enforceAcceptEncoding } from "@/app/api/shared/accept-encoding";

describe("enforceAcceptEncoding", () => {
  const sentHeaders = async (
    requestHeaders?: Record<string, string>,
    instanceHeaders?: Record<string, string>
  ): Promise<AxiosHeaders> => {
    let captured: InternalAxiosRequestConfig | undefined;
    const instance = enforceAcceptEncoding(
      axios.create({
        headers: instanceHeaders,
        adapter: async (config) => {
          captured = config;
          return {
            data: {},
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          };
        },
      })
    );
    await instance.get("https://example.org/api", { headers: requestHeaders });
    return captured!.headers;
  };

  test("sets accept-encoding when nothing else does", async () => {
    const headers = await sentHeaders();
    expect(headers.get("Accept-Encoding")).toBe("gzip, deflate");
  });

  test("replaces a per-request accept-encoding that asks for Brotli", async () => {
    const headers = await sentHeaders({ "accept-encoding": "br" });
    expect(headers.get("Accept-Encoding")).toBe("gzip, deflate");
    expect(headers.toJSON()).not.toHaveProperty("accept-encoding", "br");
  });

  test("replaces an instance default and keeps other headers", async () => {
    const headers = await sentHeaders(
      { Authorization: "Bearer token" },
      { "Accept-Encoding": "gzip, br" }
    );
    expect(headers.get("Accept-Encoding")).toBe("gzip, deflate");
    expect(headers.get("Authorization")).toBe("Bearer token");
  });
});
