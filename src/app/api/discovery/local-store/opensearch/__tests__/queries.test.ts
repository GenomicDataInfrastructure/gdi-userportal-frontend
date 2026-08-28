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
  languages: [
    { value: "ENG", label: "English" },
    { value: "FRA", label: "French" },
  ],
  populationCoverage: undefined,
  spatialCoverage: undefined,
  spatialResolutionInMeters: undefined,
});

describe("opensearch/queries", () => {
  test("createIndexMappings returns expected mapping structure", () => {
    const wordBoundaryText = {
      type: "text",
      analyzer: "word_boundary_analyzer",
    };
    const valueLabel = {
      properties: {
        value: { type: "keyword" },
        label: {
          type: "text",
          analyzer: "word_boundary_analyzer",
          fields: { keyword: { type: "keyword" } },
        },
      },
    };
    const agent = {
      type: "object",
      properties: {
        name: {
          type: "text",
          analyzer: "word_boundary_analyzer",
          fields: { keyword: { type: "keyword" } },
        },
        email: { type: "keyword" },
        url: { type: "keyword" },
        uri: { type: "keyword" },
        homepage: { type: "keyword" },
        identifier: { type: "keyword" },
        type: valueLabel,
      },
    };

    expect(createIndexMappings()).toEqual({
      settings: {
        analysis: {
          tokenizer: {
            word_boundary_tokenizer: {
              type: "pattern",
              pattern: "[^\\p{L}\\p{N}]+",
            },
          },
          analyzer: {
            word_boundary_analyzer: {
              type: "custom",
              tokenizer: "word_boundary_tokenizer",
              filter: ["lowercase"],
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: "keyword" },
          identifier: { type: "keyword" },
          title: {
            type: "text",
            analyzer: "word_boundary_analyzer",
            fields: {
              keyword: { type: "keyword" },
            },
          },
          description: wordBoundaryText,
          catalogue: {
            type: "text",
            analyzer: "word_boundary_analyzer",
            fields: { keyword: { type: "keyword" } },
          },
          codeValues: valueLabel,
          codingSystem: valueLabel,
          isReferencedBy: { type: "keyword" },
          documentation: { type: "keyword" },
          wasGeneratedBy: {
            type: "object",
            properties: {
              activityType: { type: "keyword" },
            },
          },
          languages: valueLabel,
          createdAt: { type: "date" },
          modifiedAt: { type: "date" },
          version: { type: "keyword" },
          hasVersions: valueLabel,
          versionNotes: wordBoundaryText,
          provenance: wordBoundaryText,
          numberOfRecords: { type: "integer" },
          numberOfUniqueIndividuals: { type: "integer" },
          maxTypicalAge: { type: "integer" },
          minTypicalAge: { type: "integer" },
          hasStructuredData: { type: "boolean" },
          populationCoverage: wordBoundaryText,
          spatialCoverage: {
            type: "object",
            properties: {
              uri: { type: "keyword" },
              text: wordBoundaryText,
              geom: { type: "keyword" },
              bbox: { type: "keyword" },
              centroid: { type: "keyword" },
            },
          },
          spatialResolutionInMeters: { type: "float" },
          temporalCoverage: { type: "object" },
          retentionPeriod: { type: "object" },
          temporalResolution: { type: "keyword" },
          frequency: valueLabel,
          themes: valueLabel,
          keywords: { type: "keyword" },
          healthTheme: valueLabel,
          healthCategory: valueLabel,
          dcatType: valueLabel,
          publishers: agent,
          hdab: agent,
          creators: agent,
          publisherType: valueLabel,
          accessRights: valueLabel,
          conformsTo: valueLabel,
          legalBasis: valueLabel,
          applicableLegislation: valueLabel,
          dataDictionary: {
            type: "object",
            properties: {
              name: {
                type: "text",
                analyzer: "word_boundary_analyzer",
                fields: { keyword: { type: "keyword" } },
              },
              type: { type: "keyword" },
              description: wordBoundaryText,
            },
          },
          personalData: valueLabel,
          purpose: valueLabel,
          distributionsCount: { type: "integer" },
          distributions: {
            type: "object",
            properties: {
              id: { type: "keyword" },
              title: {
                type: "text",
                analyzer: "word_boundary_analyzer",
                fields: { keyword: { type: "keyword" } },
              },
              description: wordBoundaryText,
              format: valueLabel,
              mediaType: valueLabel,
              license: valueLabel,
              rights: wordBoundaryText,
              status: valueLabel,
              conformsTo: valueLabel,
              applicableLegislation: valueLabel,
              byteSize: { type: "long" },
              accessUrl: { type: "keyword" },
              downloadUrl: { type: "keyword" },
              createdAt: { type: "date" },
            },
          },
          contacts: {
            type: "object",
            properties: {
              name: {
                type: "text",
                analyzer: "word_boundary_analyzer",
                fields: { keyword: { type: "keyword" } },
              },
              email: { type: "keyword" },
              uri: { type: "keyword" },
              url: { type: "keyword" },
              identifier: { type: "keyword" },
            },
          },
          datasetRelationships: {
            type: "object",
            properties: {
              relation: { type: "keyword" },
              target: { type: "keyword" },
            },
          },
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

  test("buildSearchBody uses cross_fields + fuzzy + keyword + phrase_prefix when query is provided", () => {
    const body = buildSearchBody({ query: "regis" });
    const shouldClauses = (body.query as any).bool.must[0].bool.should;

    expect(body.from).toBe(0);
    expect(body.size).toBe(20);
    expect(body.query).toHaveProperty("bool");
    expect((body.query as any).bool.must[0].bool.minimum_should_match).toBe(1);
    expect(shouldClauses).toHaveLength(4);

    const [crossFields, fuzzyTextFields, fuzzyKeywordFields, phrasePrefix] =
      shouldClauses;

    expect(crossFields.multi_match.type).toBe("cross_fields");
    expect(crossFields.multi_match.operator).toBe("and");
    expect(crossFields.multi_match.fields).toContain("versionNotes");
    expect(crossFields.multi_match.fields).toContain("provenance");
    expect(crossFields.multi_match.fields).not.toContain("identifier");

    expect(fuzzyTextFields.multi_match.fuzziness).toBe("AUTO");
    expect(fuzzyTextFields.multi_match.minimum_should_match).toBe("100%");
    expect(fuzzyTextFields.multi_match.fields).toContain("versionNotes");
    expect(fuzzyTextFields.multi_match.fields).not.toContain("identifier");

    expect(fuzzyKeywordFields.multi_match.fuzziness).toBe("AUTO");
    expect(fuzzyKeywordFields.multi_match.fields).toContain("identifier");
    expect(fuzzyKeywordFields.multi_match.fields).toContain("version");
    expect(fuzzyKeywordFields.multi_match.fields).not.toContain("versionNotes");

    expect(phrasePrefix.multi_match.type).toBe("phrase_prefix");
    expect(phrasePrefix.multi_match.fields).not.toContain("identifier");
    expect(phrasePrefix.multi_match.fields).not.toContain("catalogue");
    expect(phrasePrefix.multi_match.fields).toContain("versionNotes");
    expect(phrasePrefix.multi_match.fields).toContain("provenance");
  });

  test("buildSearchBody treats catalogue as free text, not an opaque keyword", () => {
    const body = buildSearchBody({ query: "some words" });
    const shouldClauses = (body.query as any).bool.must[0].bool.should;
    const [crossFields, , fuzzyKeywordFields] = shouldClauses;

    expect(crossFields.multi_match.fields).toContain("catalogue");
    expect(fuzzyKeywordFields.multi_match.fields).not.toContain("catalogue");
  });

  test("buildSearchBody includes health theme and category labels in the cross-field search", () => {
    const body = buildSearchBody({ query: "mental health" });
    const shouldClauses = (body.query as any).bool.must[0].bool.should;
    const [crossFields] = shouldClauses;

    expect(crossFields.multi_match.fields).toContain("themes.label");
    expect(crossFields.multi_match.fields).toContain("healthTheme.label");
    expect(crossFields.multi_match.fields).toContain("healthCategory.label");
  });

  test("buildSearchBody requires every query term to match via cross_fields AND, avoiding loosely-related matches", () => {
    const body = buildSearchBody({ query: "mental health" });
    const shouldClauses = (body.query as any).bool.must[0].bool.should;
    const [crossFields, fuzzyTextFields] = shouldClauses;

    expect(crossFields.multi_match.operator).toBe("and");
    expect(fuzzyTextFields.multi_match.minimum_should_match).toBe("100%");
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
                            {
                              term: {
                                "accessRights.label.keyword": "Public",
                              },
                            },
                            {
                              match_phrase: { "accessRights.label": "Public" },
                            },
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
                                "accessRights.label.keyword": "Restricted",
                              },
                            },
                            {
                              match_phrase: {
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

  test("buildSearchBody builds a matchable clause for the healthTheme dropdown filter", () => {
    const body = buildSearchBody({
      facets: [
        {
          type: "DROPDOWN",
          key: "healthTheme",
          value: "Mental Health",
        },
      ],
    });

    expect((body.query as any).bool.filter).toEqual([
      {
        bool: {
          should: [
            { term: { "healthTheme.value": "Mental Health" } },
            { term: { "healthTheme.label.keyword": "Mental Health" } },
            { match_phrase: { "healthTheme.label": "Mental Health" } },
          ],
          minimum_should_match: 1,
        },
      },
    ]);
  });

  test("buildSearchBody builds a matchable clause for the healthCategory dropdown filter", () => {
    const body = buildSearchBody({
      facets: [
        {
          type: "DROPDOWN",
          key: "healthCategory",
          value: "Registries",
        },
      ],
    });

    expect((body.query as any).bool.filter).toEqual([
      {
        bool: {
          should: [
            { term: { "healthCategory.value": "Registries" } },
            { term: { "healthCategory.label.keyword": "Registries" } },
            { match_phrase: { "healthCategory.label": "Registries" } },
          ],
          minimum_should_match: 1,
        },
      },
    ]);
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
    expect(body).toContain(
      '"languages":[{"value":"ENG","label":"English"},{"value":"FRA","label":"French"}]'
    );
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
