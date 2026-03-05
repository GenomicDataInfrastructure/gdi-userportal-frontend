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
            _source: { id: "id-a", title: "A", description: "desc-a" },
          },
          { _id: "b", _source: { title: "B" } },
        ],
      },
    });

    expect(result).toEqual({
      count: 2,
      results: [
        { id: "id-a", title: "A", description: "desc-a" },
        { id: "b", title: "B", description: undefined },
      ],
    });
  });

  test("mapSearchResponse handles missing hits/total", () => {
    const result = mapSearchResponse({});
    expect(result).toEqual({ count: 0, results: [] });
  });

  test("mapGetDocumentResponse maps document and falls back to _id", () => {
    expect(
      mapGetDocumentResponse({
        _id: "doc-1",
        _source: { id: "id-1", title: "Title", description: "Desc" },
      })
    ).toEqual({
      id: "id-1",
      title: "Title",
      description: "Desc",
    });

    expect(
      mapGetDocumentResponse({
        _id: "doc-2",
        _source: { title: "Only title" },
      })
    ).toEqual({
      id: "doc-2",
      title: "Only title",
      description: undefined,
    });
  });
});
