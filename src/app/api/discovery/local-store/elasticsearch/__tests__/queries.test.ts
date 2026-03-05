// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  buildBulkUpsertBody,
  buildClearBody,
  buildSearchBody,
  createIndexMappings,
} from "@/app/api/discovery/local-store/elasticsearch/queries";

describe("elasticsearch/queries", () => {
  test("createIndexMappings returns expected mapping structure", () => {
    expect(createIndexMappings()).toEqual({
      mappings: {
        properties: {
          id: { type: "keyword" },
          identifier: { type: "keyword" },
          title: { type: "text" },
          description: { type: "text" },
          catalogue: { type: "keyword" },
        },
      },
    });
  });

  test("buildSearchBody uses match_all when query is empty", () => {
    expect(buildSearchBody({ start: 2, rows: 5, query: "   " })).toEqual({
      from: 2,
      size: 5,
      query: { match_all: {} },
      sort: [{ _score: "desc" }, { id: "asc" }],
    });
  });

  test("buildSearchBody uses fuzzy + phrase_prefix when query is provided", () => {
    const body = buildSearchBody({ query: "regis" });

    expect(body.from).toBe(0);
    expect(body.size).toBe(20);
    expect(body.query).toHaveProperty("bool");
    expect((body.query as any).bool.minimum_should_match).toBe(1);
    expect((body.query as any).bool.should).toHaveLength(2);
  });

  test("buildClearBody returns delete-all query", () => {
    expect(buildClearBody()).toEqual({
      query: { match_all: {} },
    });
  });

  test("buildBulkUpsertBody builds ndjson payload", () => {
    const body = buildBulkUpsertBody("idx", [
      {
        id: "1",
        identifier: "IDENT-1",
        title: "A",
        description: "D1",
        catalogue: "catalogue-1",
      },
      { id: "2", title: "B", catalogue: "catalogue-2" },
    ]);

    expect(body).toContain('"index":{"_index":"idx","_id":"1"}');
    expect(body).toContain(
      '"id":"1","identifier":"IDENT-1","title":"A","description":"D1","catalogue":"catalogue-1"'
    );
    expect(body).toContain('"index":{"_index":"idx","_id":"2"}');
    expect(body.endsWith("\n")).toBe(true);
  });
});
