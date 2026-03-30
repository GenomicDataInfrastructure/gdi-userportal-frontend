// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  DATASET_EXPORT_PREFIXES,
  getDatasetNestedResourceUri,
  getLocalDiscoveryExportBaseUrl,
  toHttpUri,
  toMailtoUri,
} from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";
import { buildLocalDiscoveryDataset } from "@/app/api/discovery/test-utils/fixtures";

describe("dcat dataset rdf shared helpers", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
  });

  test("uses the default export base url when env is missing", () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;

    expect(getLocalDiscoveryExportBaseUrl()).toBe("http://localhost:3000");
  });

  test("normalizes mailto and http helpers for empty and populated values", () => {
    expect(toMailtoUri()).toBeUndefined();
    expect(toMailtoUri("   ")).toBeUndefined();
    expect(toMailtoUri("help@example.org")).toBe("mailto:help@example.org");
    expect(toMailtoUri("mailto:help@example.org")).toBe(
      "mailto:help@example.org"
    );

    expect(toHttpUri()).toBeUndefined();
    expect(toHttpUri(null)).toBeUndefined();
    expect(toHttpUri("   ")).toBeUndefined();
    expect(toHttpUri("https://example.org/docs")).toBe(
      "https://example.org/docs"
    );
  });

  test("builds nested resource uris from generated dataset export uris", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://portal.example.org///";

    const dataset = buildLocalDiscoveryDataset({
      id: "dataset 1",
      identifier: undefined,
    });

    expect(getDatasetNestedResourceUri(dataset, "distribution/1")).toBe(
      "https://portal.example.org/datasets/dataset%201#distribution%2F1"
    );
  });

  test("exports the expected RDF namespace prefixes", () => {
    expect(DATASET_EXPORT_PREFIXES).toEqual({
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      dcat: "http://www.w3.org/ns/dcat#",
      dct: "http://purl.org/dc/terms/",
      adms: "http://www.w3.org/ns/adms#",
      healthdcatap: "http://healthdataportal.eu/ns/health#",
      dcatap: "http://data.europa.eu/r5r/",
      skos: "http://www.w3.org/2004/02/skos/core#",
      dpv: "http://www.w3.org/ns/dpv#",
      foaf: "http://xmlns.com/foaf/0.1/",
      vcard: "http://www.w3.org/2006/vcard/ns#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
    });
  });
});
