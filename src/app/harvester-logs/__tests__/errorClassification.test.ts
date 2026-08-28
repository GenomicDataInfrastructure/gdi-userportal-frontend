// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { classifyHarvesterError } from "../errorClassification";

describe("classifyHarvesterError", () => {
  test("classifies a missing file error", () => {
    expect(
      classifyHarvesterError(
        "Failed to harvest datasets from file test-harvest-fixtures/does-not-exist.rdf: Failed to read DCAT catalogue file from /repo/test-harvest-fixtures/does-not-exist.rdf: ENOENT: no such file or directory, open '/repo/test-harvest-fixtures/does-not-exist.rdf'"
      )
    ).toBe("sourceNotFound");
  });

  test("classifies malformed XML errors", () => {
    expect(
      classifyHarvesterError(
        "Failed to harvest datasets from file test-harvest-fixtures/broken-xml-syntax.rdf: Failed to parse RDF from /repo/test-harvest-fixtures/broken-xml-syntax.rdf: 14:21: unexpected close tag."
      )
    ).toBe("invalidXml");
  });

  test("classifies unreachable URL errors", () => {
    expect(
      classifyHarvesterError(
        "Failed to harvest datasets from https://example.org/catalogue.rdf: Failed to download DCAT catalogue from https://example.org/catalogue.rdf: connect ECONNREFUSED"
      )
    ).toBe("sourceUnreachable");
  });

  test("classifies authorization failures", () => {
    expect(
      classifyHarvesterError(
        "Failed to prepare authorization for harvesting https://example.org/catalogue.rdf: token lookup failed"
      )
    ).toBe("authorizationFailed");
  });

  test("classifies OpenSearch indexing failures", () => {
    expect(
      classifyHarvesterError(
        "Failed to index 2 harvested datasets from https://example.org/catalogue.rdf: OpenSearch bulk upsert reported item-level errors"
      )
    ).toBe("indexUnavailable");
  });

  test("classifies per-dataset mapping errors by the presence of a subjectId", () => {
    expect(
      classifyHarvesterError(
        "Cannot read properties of undefined",
        "dataset-42"
      )
    ).toBe("datasetMappingFailed");
  });

  test("falls back to unknown for unrecognized messages", () => {
    expect(classifyHarvesterError("something completely unexpected")).toBe(
      "unknown"
    );
  });
});
