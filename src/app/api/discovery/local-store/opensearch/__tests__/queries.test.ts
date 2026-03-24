// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  buildBulkUpsertBody,
  buildClearBody,
  buildFilterValuesBody,
  buildSearchBody,
  createIndexMappings,
} from "@/app/api/discovery/local-store/opensearch/queries";
import { buildLocalDiscoveryDataset } from "@/app/api/discovery/test-utils/fixtures";

const canonicalDataset = buildLocalDiscoveryDataset({
  id: "1",
  identifier: "IDENT-1",
  title: "A",
  description: "D1",
  catalogue: "catalogue-1",
  languages: ["ENG", "FRA"],
  populationCoverage: undefined,
  spatialCoverage: undefined,
  spatialResolutionInMeters: undefined,
});

describe("opensearch/queries", () => {
  test("createIndexMappings returns expected mapping structure", () => {
    expect(createIndexMappings()).toEqual({
      mappings: {
        properties: {
          id: { type: "keyword" },
          identifier: { type: "keyword" },
          title: {
            type: "text",
            fields: {
              keyword: { type: "keyword" },
            },
          },
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
          numberOfRecords: { type: "integer" },
          numberOfUniqueIndividuals: { type: "integer" },
          maxTypicalAge: { type: "integer" },
          minTypicalAge: { type: "integer" },
          populationCoverage: { type: "text" },
          spatialCoverage: { type: "object" },
          spatialResolutionInMeters: { type: "float" },
          temporalCoverage: { type: "object" },
          retentionPeriod: { type: "object" },
          temporalResolution: { type: "keyword" },
          frequency: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          themes: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          keywords: { type: "keyword" },
          healthTheme: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          healthCategory: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          dcatType: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          publishers: {
            type: "object",
            properties: {
              name: {
                type: "text",
                fields: {
                  keyword: { type: "keyword" },
                },
              },
              email: { type: "keyword" },
              url: { type: "keyword" },
              uri: { type: "keyword" },
              homepage: { type: "keyword" },
              identifier: { type: "keyword" },
              type: {
                properties: {
                  value: { type: "keyword" },
                  label: { type: "keyword" },
                },
              },
            },
          },
          hdab: {
            type: "object",
            properties: {
              name: {
                type: "text",
                fields: {
                  keyword: { type: "keyword" },
                },
              },
              email: { type: "keyword" },
              url: { type: "keyword" },
              uri: { type: "keyword" },
              homepage: { type: "keyword" },
              identifier: { type: "keyword" },
              type: {
                properties: {
                  value: { type: "keyword" },
                  label: { type: "keyword" },
                },
              },
            },
          },
          creators: {
            type: "object",
            properties: {
              name: {
                type: "text",
                fields: {
                  keyword: { type: "keyword" },
                },
              },
              email: { type: "keyword" },
              url: { type: "keyword" },
              uri: { type: "keyword" },
              homepage: { type: "keyword" },
              identifier: { type: "keyword" },
              type: {
                properties: {
                  value: { type: "keyword" },
                  label: { type: "keyword" },
                },
              },
            },
          },
          publisherType: {
            type: "object",
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          accessRights: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          conformsTo: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          legalBasis: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          applicableLegislation: {
            properties: {
              value: { type: "keyword" },
              label: { type: "keyword" },
            },
          },
          distributionsCount: { type: "integer" },
        },
      },
    });
  });

  test("buildSearchBody uses match_all when query is empty", () => {
    expect(buildSearchBody({ start: 2, rows: 5, query: "   " })).toEqual({
      from: 2,
      size: 5,
      query: { match_all: {} },
      sort: [
        { _score: "desc" },
        { modifiedAt: { order: "desc", missing: "_last" } },
        { id: "asc" },
      ],
    });
  });

  test("buildSearchBody supports newest sort mode", () => {
    expect(buildSearchBody({ sort: "newest" })).toMatchObject({
      sort: [{ createdAt: { order: "desc", missing: "_last" } }, { id: "asc" }],
    });
  });

  test("buildSearchBody falls back to relevance for unknown sort values", () => {
    expect(buildSearchBody({ sort: "issued desc" })).toMatchObject({
      sort: [
        { _score: "desc" },
        { modifiedAt: { order: "desc", missing: "_last" } },
        { id: "asc" },
      ],
    });
  });

  test("buildSearchBody uses fuzzy + phrase_prefix when query is provided", () => {
    const body = buildSearchBody({ query: "regis" });
    const shouldClauses = (body.query as any).bool.must[0].bool.should;

    expect(body.from).toBe(0);
    expect(body.size).toBe(20);
    expect(body.query).toHaveProperty("bool");
    expect((body.query as any).bool.must[0].bool.minimum_should_match).toBe(1);
    expect(shouldClauses).toHaveLength(2);
    expect(shouldClauses[0].multi_match.fields).toContain("identifier");
    expect(shouldClauses[0].multi_match.fields).toContain("version");
    expect(shouldClauses[0].multi_match.fields).toContain("versionNotes");
    expect(shouldClauses[1].multi_match.fields).not.toContain("identifier");
    expect(shouldClauses[1].multi_match.fields).not.toContain("catalogue");
    expect(shouldClauses[1].multi_match.fields).toContain("versionNotes");
  });

  test("buildSearchBody trims query before building clauses", () => {
    const body = buildSearchBody({ query: "  adminis  " });
    const shouldClauses = (body.query as any).bool.must[0].bool.should;

    expect(shouldClauses[0].multi_match.query).toBe("adminis");
    expect(shouldClauses[1].multi_match.query).toBe("adminis");
  });

  test("buildSearchBody adds AND facet filters", () => {
    const body = buildSearchBody({
      query: "registry",
      facets: [
        {
          type: "DROPDOWN",
          key: "publisherName",
          value: "PNED GIE",
        },
        {
          type: "DROPDOWN",
          key: "identifier",
          value: "IDENT-1",
        },
        {
          type: "NUMBER",
          key: "numberOfRecords",
          operator: ">=",
          value: "100",
        },
        {
          type: "FREE_TEXT",
          key: "publisherName",
          value: "health",
        },
        {
          type: "DATETIME",
          key: "modified",
          operator: "!",
          value: "2024-01-01T00:00:00.000Z",
        },
      ],
    });

    expect((body.query as any).bool.must).toHaveLength(1);
    expect((body.query as any).bool.filter).toEqual([
      {
        bool: {
          should: [
            { term: { "publishers.name.keyword": "PNED GIE" } },
            { match_phrase: { "publishers.name": "PNED GIE" } },
          ],
          minimum_should_match: 1,
        },
      },
      {
        bool: {
          should: [
            { term: { identifier: "IDENT-1" } },
            { term: { id: "IDENT-1" } },
          ],
          minimum_should_match: 1,
        },
      },
      { range: { numberOfRecords: { gte: 100 } } },
      {
        match_phrase_prefix: { "publishers.name": "health" },
      },
      {
        bool: {
          must_not: [{ term: { modifiedAt: "2024-01-01T00:00:00.000Z" } }],
        },
      },
    ]);
  });

  test("buildSearchBody adds OR facet filters", () => {
    const body = buildSearchBody({
      facets: [
        {
          type: "DROPDOWN",
          key: "identifier",
          value: "ID-1",
        },
        {
          type: "ENTRIES",
          key: "accessRights",
          entries: [
            { key: "public", value: "Public" },
            { key: "restricted", value: "Restricted" },
          ],
        },
      ],
      operator: "OR",
    });

    expect(body.query).toEqual({
      bool: {
        filter: [
          {
            bool: {
              should: [
                {
                  bool: {
                    should: [
                      { term: { identifier: "ID-1" } },
                      { term: { id: "ID-1" } },
                    ],
                    minimum_should_match: 1,
                  },
                },
                {
                  bool: {
                    should: [
                      {
                        bool: {
                          should: [
                            { term: { "accessRights.value": "Public" } },
                            { term: { "accessRights.label": "Public" } },
                          ],
                          minimum_should_match: 1,
                        },
                      },
                      {
                        bool: {
                          should: [
                            {
                              term: {
                                "accessRights.value": "Restricted",
                              },
                            },
                            {
                              term: {
                                "accessRights.label": "Restricted",
                              },
                            },
                          ],
                          minimum_should_match: 1,
                        },
                      },
                    ],
                    minimum_should_match: 1,
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
        ],
      },
    });
  });

  test("buildSearchBody ignores malformed and unsupported facets", () => {
    const body = buildSearchBody({
      facets: [
        {
          type: "NUMBER",
          key: "numberOfRecords",
          operator: ">",
          value: "10",
        },
        {
          type: "NUMBER",
          key: "numberOfRecords",
          operator: "<",
          value: "20",
        },
        {
          type: "DATETIME",
          key: "modified",
          operator: "<=",
          value: "2024-01-01",
        },
        {
          type: "DATETIME",
          key: "modified",
          operator: ">=",
          value: "not-a-date",
        },
        {
          type: "NUMBER",
          key: "numberOfRecords",
          value: "not-a-number",
        },
        {
          type: "ENTRIES",
          key: "accessRights",
          entries: [],
        },
        {
          type: "NOPE" as any,
          key: "identifier",
          value: "ignored",
        },
      ],
    });

    expect((body.query as any).bool.filter).toEqual([
      { range: { numberOfRecords: { gt: 10 } } },
      { range: { numberOfRecords: { lt: 20 } } },
      { range: { modifiedAt: { lte: "2024-01-01" } } },
    ]);
  });

  test("buildClearBody returns delete-all query", () => {
    expect(buildClearBody()).toEqual({
      query: { match_all: {} },
    });
  });

  test("buildFilterValuesBody returns terms aggregation query", () => {
    expect(buildFilterValuesBody("themes.label", 25)).toEqual({
      size: 0,
      aggs: {
        values: {
          terms: {
            field: "themes.label",
            size: 25,
            order: { _count: "desc" },
          },
        },
      },
    });
  });

  test("buildBulkUpsertBody builds ndjson payload", () => {
    const body = buildBulkUpsertBody("idx", [
      canonicalDataset,
      {
        id: "2",
        title: "B",
        catalogue: "catalogue-2",
        publishers: [],
        hdab: [],
        creators: [],
      },
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
    expect(body).toContain(
      '"accessRights":{"value":"http://publications.europa.eu/resource/authority/access-right/PUBLIC","label":"Public"}'
    );
    expect(body).toContain(
      '"conformsTo":[{"value":"https://example.org/spec/healthdcat-ap-v6","label":"HealthDCAT-AP v6"}]'
    );
    expect(body).toContain('"distributionsCount":3');
    expect(body).toContain(
      '"legalBasis":[{"value":"GDPR Art. 6(1)(e)","label":"GDPR Art. 6(1)(e)"},{"value":"GDPR Art. 6(1)(c)","label":"GDPR Art. 6(1)(c)"}]'
    );
    expect(body).toContain(
      '"applicableLegislation":[{"value":"http://data.europa.eu/eli/reg/2016/679","label":"GDPR"},{"value":"http://example.com/law/42","label":"Example Law 42"},{"value":"http://example.com/law/99","label":"99"}]'
    );
    expect(body).toContain('"index":{"_index":"idx","_id":"2"}');
    expect(body.endsWith("\n")).toBe(true);
  });
});
