// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { buildHarvestRequestInit } from "@/app/api/discovery/harvester/fetch-options";

describe("buildHarvestRequestInit", () => {
  test("sets accept-encoding when no init is given", () => {
    expect(buildHarvestRequestInit()).toEqual({
      headers: { "accept-encoding": "gzip, deflate" },
    });
  });

  test("keeps caller headers and other options", () => {
    expect(
      buildHarvestRequestInit({
        method: "POST",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "a=b",
      })
    ).toEqual({
      method: "POST",
      headers: {
        Authorization: "Bearer token",
        "Content-Type": "application/x-www-form-urlencoded",
        "accept-encoding": "gzip, deflate",
      },
      body: "a=b",
    });
  });

  test("keeps headers passed as a Headers instance or tuples", () => {
    expect(
      buildHarvestRequestInit({
        headers: new Headers({ Authorization: "Bearer token" }),
      }).headers
    ).toEqual({
      authorization: "Bearer token",
      "accept-encoding": "gzip, deflate",
    });
    expect(
      buildHarvestRequestInit({ headers: [["Authorization", "Bearer token"]] })
        .headers
    ).toEqual({
      Authorization: "Bearer token",
      "accept-encoding": "gzip, deflate",
    });
  });

  test("replaces an accept-encoding header that asks for Brotli", () => {
    expect(
      buildHarvestRequestInit({
        headers: { "Accept-Encoding": "br, gzip, deflate" },
      }).headers
    ).toEqual({ "accept-encoding": "gzip, deflate" });
  });

  test("never adds a dispatcher that disables TLS verification", () => {
    expect(buildHarvestRequestInit({ method: "GET" })).not.toHaveProperty(
      "dispatcher"
    );
  });
});
