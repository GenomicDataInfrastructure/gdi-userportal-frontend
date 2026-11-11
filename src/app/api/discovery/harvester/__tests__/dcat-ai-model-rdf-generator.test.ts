// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getLocalDiscoveryExportBaseUrl } from "@/app/api/discovery/harvester/dcat-dataset-rdf-shared";
import {
  getLocalDiscoveryAiModelExportMimeType,
  serializeLocalDiscoveryAiModel,
} from "@/app/api/discovery/harvester/dcat-ai-model-rdf-generator";
import { parseRdfXmlToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";
import { buildLocalDiscoveryAiModel } from "@/app/api/discovery/test-utils/fixtures";
import { LocalDiscoveryAiModel } from "@/app/api/discovery/local-store/types";

describe("DCAT AI Model export generator (reuses Dataset's shared quad mappers)", () => {
  const originalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
  const DCAT_RESOURCE = "http://www.w3.org/ns/dcat#Resource";
  const DCT_CONFORMS_TO = "http://purl.org/dc/terms/conformsTo";
  const DCT_TYPE = "http://purl.org/dc/terms/type";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://portal.example.org/";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = originalBaseUrl;
  });

  test("falls back to a /models export URI distinct from Dataset's /datasets", async () => {
    const aiModel = buildLocalDiscoveryAiModel({
      id: "ai-model-1",
      identifier: undefined,
    });

    expect(getLocalDiscoveryExportBaseUrl()).toBe("https://portal.example.org");

    const rdfXml = await serializeLocalDiscoveryAiModel(aiModel, "rdf");
    expect(rdfXml).toContain(
      'rdf:about="https://portal.example.org/models/ai-model-1"'
    );
  });

  test("serializes RDF/XML as rdf:type dcat:Resource with shared core, agent, and contact metadata", async () => {
    const aiModel = buildLocalDiscoveryAiModel({
      id: "https://example.org/models/export-1",
      title: "Sentiment Analyzer & Co",
      description: "Classifies <text> sentiment",
    });

    const rdfXml = await serializeLocalDiscoveryAiModel(aiModel, "rdf");

    expect(rdfXml).toContain("<rdf:RDF");
    expect(rdfXml).toContain(
      'rdf:about="https://example.org/models/export-1#publisher-1"'
    );

    const quads = await parseRdfXmlToQuads(rdfXml);
    const subject = "https://example.org/models/export-1";

    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === RDF_TYPE &&
          quad.object.value === DCAT_RESOURCE
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === "http://purl.org/dc/terms/title" &&
          quad.object.value === "Sentiment Analyzer & Co"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === "http://purl.org/dc/terms/accessRights"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === "http://www.w3.org/ns/dcat#contactPoint"
      )
    ).toBe(true);
  });

  test("serializes Libraries and Tasks as plain literals, not URI-identified resources", async () => {
    const aiModel = buildLocalDiscoveryAiModel({
      id: "https://example.org/models/export-1",
    });

    const rdfXml = await serializeLocalDiscoveryAiModel(aiModel, "rdf");
    const quads = await parseRdfXmlToQuads(rdfXml);
    const subject = "https://example.org/models/export-1";

    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === DCT_CONFORMS_TO &&
          quad.object.termType === "Literal" &&
          quad.object.value === "transformers"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === DCT_TYPE &&
          quad.object.termType === "Literal" &&
          quad.object.value === "Text Classification"
      )
    ).toBe(true);
  });

  test("preserves plain library and task labels alongside URI-backed resources", async () => {
    const aiModel = buildLocalDiscoveryAiModel({
      id: "https://example.org/models/mixed-export-1",
      libraries: ["Adapters", "Plain Library"],
      libraryResources: [
        {
          value: "https://github.com/Adapter-Hub/adapter-transformers",
          label: "Adapters",
        },
      ],
      tasks: ["Text Classification", "Plain Task"],
      taskResources: [
        {
          value: "https://huggingface.co/tasks/text-classification",
          label: "Text Classification",
        },
      ],
    });

    const quads = await parseRdfXmlToQuads(
      await serializeLocalDiscoveryAiModel(aiModel, "rdf")
    );
    const subject = "https://example.org/models/mixed-export-1";

    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === DCT_CONFORMS_TO &&
          quad.object.termType === "Literal" &&
          quad.object.value === "Plain Library"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === DCT_TYPE &&
          quad.object.termType === "Literal" &&
          quad.object.value === "Plain Task"
      )
    ).toBe(true);
  });

  test("preserves the RDF resource vocabulary received for AI-model fields", async () => {
    const aiModel = buildLocalDiscoveryAiModel({
      id: "https://example.org/models/export-1",
      title: "Sentiment Analysis Model",
      description: "Classifies text sentiment.",
      libraryResources: [
        {
          value: "https://github.com/Adapter-Hub/adapter-transformers",
          label: "Adapters",
        },
      ],
      taskResources: [
        {
          value: "https://huggingface.co/tasks/text-classification",
          label: "Text Classification",
        },
      ],
      publishers: [
        {
          name: "LIST",
        },
      ],
      creators: [
        {
          name: "LIST",
        },
      ],
      contacts: [
        {
          name: "LIST",
          email: "rania.hamdani@lnds.lu",
        },
      ],
    });

    const quads = await parseRdfXmlToQuads(
      await serializeLocalDiscoveryAiModel(aiModel, "rdf")
    );
    const subject = "https://example.org/models/export-1";

    expect(
      quads.some(
        (quad) =>
          quad.subject.value === subject &&
          quad.predicate.value === "http://purl.org/dc/terms/title" &&
          quad.object.termType === "Literal" &&
          quad.object.language === "eng"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.predicate.value === DCT_CONFORMS_TO &&
          quad.object.value ===
            "https://github.com/Adapter-Hub/adapter-transformers"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.subject.value ===
            "https://github.com/Adapter-Hub/adapter-transformers" &&
          quad.predicate.value === RDF_TYPE &&
          quad.object.value === "http://purl.org/dc/terms/Standard"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.subject.value ===
            "https://huggingface.co/tasks/text-classification" &&
          quad.predicate.value === RDF_TYPE &&
          quad.object.value === "http://www.w3.org/2004/02/skos/core#Concept"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.predicate.value === RDF_TYPE &&
          quad.object.value === "http://xmlns.com/foaf/0.1/Agent"
      )
    ).toBe(true);
    expect(
      quads.some(
        (quad) =>
          quad.predicate.value === RDF_TYPE &&
          quad.object.value === "http://www.w3.org/2006/vcard/ns#Kind"
      )
    ).toBe(true);
  });

  test("serializes Turtle and JSON-LD with the same shared metadata", async () => {
    const aiModel = buildLocalDiscoveryAiModel({
      id: "https://example.org/models/export-1",
      title: 'Sentiment "Analyzer"',
    });

    const turtle = await serializeLocalDiscoveryAiModel(aiModel, "ttl");
    expect(turtle).toContain('dct:title "Sentiment \\"Analyzer\\""');
    expect(turtle).toContain("dct:conformsTo");
    expect(turtle).toContain("transformers");

    const jsonLd = JSON.parse(
      await serializeLocalDiscoveryAiModel(aiModel, "jsonld")
    ) as Record<string, unknown>;
    const graph = jsonLd["@graph"] as Array<Record<string, unknown>>;
    expect(jsonLd["@context"]).toBeDefined();
    expect(
      graph.some(
        (item) => item["@id"] === "https://example.org/models/export-1"
      )
    ).toBe(true);
  });

  test("facade dispatches MIME types for all supported formats", () => {
    expect(getLocalDiscoveryAiModelExportMimeType("rdf")).toBe(
      "application/rdf+xml"
    );
    expect(getLocalDiscoveryAiModelExportMimeType("ttl")).toBe("text/turtle");
    expect(getLocalDiscoveryAiModelExportMimeType("jsonld")).toBe(
      "application/ld+json"
    );
  });

  test("handles missing optional export fields in all formats", async () => {
    const aiModel: LocalDiscoveryAiModel = {
      id: "ai-model-1",
      entityType: "AI_MODEL",
      title: "",
      publishers: [],
      creators: [],
    };

    const rdfXml = await serializeLocalDiscoveryAiModel(aiModel, "rdf");
    expect(rdfXml).toContain(
      'rdf:about="https://portal.example.org/models/ai-model-1"'
    );
    await expect(parseRdfXmlToQuads(rdfXml)).resolves.toEqual(
      expect.any(Array)
    );

    expect(await serializeLocalDiscoveryAiModel(aiModel, "ttl")).toContain(
      "<https://portal.example.org/models/ai-model-1> a dcat:Resource"
    );
  });

  test("emits documentation as nested foaf:Document element with rdf:about in RDF/XML", async () => {
    const aiModel = buildLocalDiscoveryAiModel({
      id: "https://example.org/models/export-1",
      documentation: ["https://example.org/docs/ai-model-1"],
    });

    const rdfXml = await serializeLocalDiscoveryAiModel(aiModel, "rdf");
    expect(rdfXml).toContain(
      '<foaf:page>\n      <foaf:Document rdf:about="https://example.org/docs/ai-model-1"/>\n    </foaf:page>'
    );
    expect(rdfXml).not.toContain("<foaf:page rdf:resource=");
  });
});
