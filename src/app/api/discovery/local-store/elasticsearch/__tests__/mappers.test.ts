// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  mapGetDocumentResponse,
  mapSearchResponse,
} from "@/app/api/discovery/local-store/elasticsearch/mappers";

describe("elasticsearch/mappers", () => {
  test("mapSearchResponse maps hits and falls back to _id", () => {
    const result = mapSearchResponse({
      hits: {
        total: { value: 2 },
        hits: [
          {
            _id: "a",
            _source: {
              id: "id-a",
              identifier: "identifier-a",
              title: "A",
              description: "desc-a",
              catalogue: "catalogue-a",
              languages: ["ENG"],
              createdAt: "2024-01-01T00:00:00.000Z",
              modifiedAt: "2024-03-10T00:00:00.000Z",
              version: "1.0.0",
              hasVersions: true,
              versionNotes: "Initial release",
            },
          },
          { _id: "b", _source: { title: "B" } },
        ],
      },
    });

    expect(result).toEqual({
      count: 2,
      results: [
        {
          id: "id-a",
          identifier: "identifier-a",
          title: "A",
          description: "desc-a",
          catalogue: "catalogue-a",
          languages: ["ENG"],
          createdAt: "2024-01-01T00:00:00.000Z",
          modifiedAt: "2024-03-10T00:00:00.000Z",
          version: "1.0.0",
          hasVersions: true,
          versionNotes: "Initial release",
        },
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

  test("mapSearchResponse handles missing hits/total", () => {
    const result = mapSearchResponse({});
    expect(result).toEqual({ count: 0, results: [] });
  });

  test("mapSearchResponse falls back when hit has no _source", () => {
    const result = mapSearchResponse({
      hits: {
        hits: [{ _id: "only-id" }],
      },
    });

    expect(result).toEqual({
      count: 1,
      results: [
        {
          id: "only-id",
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
        },
      ],
    });
  });

  test("mapGetDocumentResponse maps document and falls back to _id", () => {
    expect(
      mapGetDocumentResponse({
        _id: "doc-1",
        _source: {
          id: "id-1",
          identifier: "identifier-1",
          title: "Title",
          description: "Desc",
          catalogue: "main-catalogue",
          languages: ["ENG", "FRA"],
          createdAt: "2024-01-01T00:00:00.000Z",
          modifiedAt: "2024-03-10T00:00:00.000Z",
          version: "1.0.0",
          hasVersions: true,
          versionNotes: "Initial release",
        },
      })
    ).toEqual({
      id: "id-1",
      identifier: "identifier-1",
      title: "Title",
      description: "Desc",
      catalogue: "main-catalogue",
      languages: ["ENG", "FRA"],
      createdAt: "2024-01-01T00:00:00.000Z",
      modifiedAt: "2024-03-10T00:00:00.000Z",
      version: "1.0.0",
      hasVersions: true,
      versionNotes: "Initial release",
    });

    expect(
      mapGetDocumentResponse({
        _id: "doc-2",
        _source: { title: "Only title" },
      })
    ).toEqual({
      id: "doc-2",
      identifier: undefined,
      title: "Only title",
      description: undefined,
      catalogue: undefined,
      languages: undefined,
      createdAt: undefined,
      modifiedAt: undefined,
      version: undefined,
      hasVersions: undefined,
      versionNotes: undefined,
    });
  });

  test("mapGetDocumentResponse falls back when _source is missing", () => {
    expect(
      mapGetDocumentResponse({
        _id: "doc-3",
      })
    ).toEqual({
      id: "doc-3",
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
    });
  });
});
