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
          languages: { type: "keyword" },
          createdAt: { type: "date" },
          modifiedAt: { type: "date" },
          version: { type: "keyword" },
          hasVersions: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          versionNotes: { type: "text" },
          populationCoverage: { type: "text" },
          spatialResolutionInMeters: { type: "keyword" },
          spatialCoverage: { type: "keyword" },
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
        languages: ["ENG", "FRA"],
        createdAt: "2024-01-01T00:00:00.000Z",
        modifiedAt: "2024-03-10T00:00:00.000Z",
        version: "1.0.0",
        hasVersions: [{ value: "v1", label: "Version 1" }],
        versionNotes: "Initial release",
      },
      { id: "2", title: "B", catalogue: "catalogue-2" },
    ]);

    expect(body).toContain('"index":{"_index":"idx","_id":"1"}');
    expect(body).toContain('"id":"1"');
    expect(body).toContain('"identifier":"IDENT-1"');
    expect(body).toContain('"title":"A"');
    expect(body).toContain('"catalogue":"catalogue-1"');
    expect(body).toContain('"languages":["ENG","FRA"]');
    expect(body).toContain('"createdAt":"2024-01-01T00:00:00.000Z"');
    expect(body).toContain('"version":"1.0.0"');
    expect(body).toContain(
      '"hasVersions":[{"value":"v1","label":"Version 1"}]'
    );
    expect(body).toContain('"index":{"_index":"idx","_id":"2"}');
    expect(body.endsWith("\n")).toBe(true);
  });
});
