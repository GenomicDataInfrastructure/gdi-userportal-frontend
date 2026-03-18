// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  buildBulkUpsertBody,
  buildClearBody,
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
          numberOfRecords: { type: "integer" },
          numberOfUniqueIndividuals: { type: "integer" },
          maxTypicalAge: { type: "integer" },
          minTypicalAge: { type: "integer" },
          populationCoverage: { type: "text" },
          spatialCoverage: { type: "object" },
          spatialResolutionInMeters: { type: "keyword" },
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
          accessRights: {
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
    const shouldClauses = (body.query as any).bool.should;

    expect(body.from).toBe(0);
    expect(body.size).toBe(20);
    expect(body.query).toHaveProperty("bool");
    expect((body.query as any).bool.minimum_should_match).toBe(1);
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
    const shouldClauses = (body.query as any).bool.should;

    expect(shouldClauses[0].multi_match.query).toBe("adminis");
    expect(shouldClauses[1].multi_match.query).toBe("adminis");
  });

  test("buildClearBody returns delete-all query", () => {
    expect(buildClearBody()).toEqual({
      query: { match_all: {} },
    });
  });

  test("buildBulkUpsertBody builds ndjson payload", () => {
    const body = buildBulkUpsertBody("idx", [
      canonicalDataset,
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
    expect(body).toContain(
      '"accessRights":{"value":"http://publications.europa.eu/resource/authority/access-right/PUBLIC","label":"Public"}'
    );
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
