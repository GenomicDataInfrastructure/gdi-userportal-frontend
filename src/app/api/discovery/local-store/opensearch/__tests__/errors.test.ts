// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { isIndexAlreadyExistsError } from "@/app/api/discovery/local-store/opensearch/errors";

describe("opensearch/errors", () => {
  test("returns true for resource_already_exists axios error", () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: { error: { type: "resource_already_exists_exception" } },
      },
    };

    expect(isIndexAlreadyExistsError(error)).toBe(true);
  });

  test("returns false for non matching errors", () => {
    expect(
      isIndexAlreadyExistsError({
        isAxiosError: true,
        response: { status: 500, data: {} },
      })
    ).toBe(false);

    expect(isIndexAlreadyExistsError(new Error("boom"))).toBe(false);
  });
});
