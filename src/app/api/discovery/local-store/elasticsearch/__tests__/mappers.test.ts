// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  mapGetDocumentResponse,
  mapSearchResponse,
} from "@/app/api/discovery/local-store/elasticsearch/mappers";

describe("elasticsearch/mappers", () => {
  test("maps all fields correctly", () => {
    const source = {
      id: "id-a",
      identifier: "identifier-a",
      title: "A",
      description: "desc-a",
      catalogue: "catalogue-a",
      languages: ["ENG"],
      createdAt: "2024-01-01T00:00:00.000Z",
      modifiedAt: "2024-03-10T00:00:00.000Z",
      version: "1.0.0",
      hasVersions: [{ value: "v1", label: "Version 1" }],
      versionNotes: "Initial release",
    };

    expect(
      mapSearchResponse({
        hits: { total: { value: 1 }, hits: [{ _id: "a", _source: source }] },
      })
    ).toEqual({ count: 1, results: [source] });

    expect(mapGetDocumentResponse({ _id: "a", _source: source })).toEqual(
      source
    );
  });

  test("falls back gracefully when fields are missing", () => {
    const expected = {
      id: "fallback-id",
      identifier: undefined,
      title: "",
      description: undefined,
      catalogue: undefined,
      languages: undefined,
      createdAt: undefined,
      modifiedAt: undefined,
      version: undefined,
      hasVersions: undefined,
      versionNotes: undefined,
    };

    expect(
      mapSearchResponse({ hits: { hits: [{ _id: "fallback-id" }] } })
    ).toEqual({ count: 1, results: [expected] });

    expect(mapGetDocumentResponse({ _id: "fallback-id" })).toEqual(expected);
  });

  test("mapSearchResponse handles empty response", () => {
    expect(mapSearchResponse({})).toEqual({ count: 0, results: [] });
  });

  test("mapSearchResponse falls back _source.id to _id", () => {
    expect(
      mapSearchResponse({
        hits: { hits: [{ _id: "b", _source: { title: "B" } }] },
      })
    ).toEqual({
      count: 1,
      results: [
        {
          id: "b",
          identifier: undefined,
          title: "B",
          description: undefined,
          catalogue: undefined,
          languages: undefined,
          createdAt: undefined,
          modifiedAt: undefined,
          version: undefined,
          hasVersions: undefined,
          versionNotes: undefined,
        },
      ],
    });
  });
});
