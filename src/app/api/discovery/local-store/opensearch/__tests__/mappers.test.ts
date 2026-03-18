// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  mapGetDocumentResponse,
  mapSearchResponse,
} from "@/app/api/discovery/local-store/opensearch/mappers";
import { buildLocalDiscoveryDataset } from "@/app/api/discovery/test-utils/fixtures";

const canonicalSource = buildLocalDiscoveryDataset({
  id: "id-a",
  identifier: "identifier-a",
  title: "A",
  description: "desc-a",
  catalogue: "catalogue-a",
  languages: ["ENG"],
  populationCoverage: undefined,
  spatialCoverage: undefined,
  spatialResolutionInMeters: undefined,
});

describe("opensearch/mappers", () => {
  test("maps a canonical stored document fixture for search and retrieval", () => {
    expect(
      mapSearchResponse({
        hits: {
          total: { value: 1 },
          hits: [{ _id: "a", _source: canonicalSource }],
        },
      })
    ).toEqual({ count: 1, results: [canonicalSource] });

    expect(
      mapGetDocumentResponse({ _id: "a", _source: canonicalSource })
    ).toEqual(canonicalSource);
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
      publishers: [],
      hdab: [],
      creators: [],
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
          publishers: [],
          hdab: [],
          creators: [],
        },
      ],
    });
  });
});
