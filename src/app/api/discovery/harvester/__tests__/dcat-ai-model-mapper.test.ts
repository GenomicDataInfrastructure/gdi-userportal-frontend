// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  isAiModelSubject,
  mapAiModel,
} from "@/app/api/discovery/harvester/dcat-ai-model-mapper";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";
import { parseRdfXmlToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";
import { canonicalAiModelDiscoveryRdf } from "@/app/api/discovery/test-utils/fixtures";

const DCAT_DATASET = "http://www.w3.org/ns/dcat#Dataset";

describe("dcat-ai-model-mapper", () => {
  it("identifies AI Model subjects via MDC's AI Model rdf:type signal and excludes plain datasets", async () => {
    const quads = await parseRdfXmlToQuads(canonicalAiModelDiscoveryRdf);
    const graph = new RdfGraph(quads);
    const subjects = graph.getSubjectsOfType(DCAT_DATASET);

    const aiModelSubjects = subjects.filter((subject) =>
      isAiModelSubject(subject, graph)
    );
    const plainSubjects = subjects.filter(
      (subject) => !isAiModelSubject(subject, graph)
    );

    expect(aiModelSubjects).toHaveLength(2);
    expect(plainSubjects).toHaveLength(1);
    expect(plainSubjects[0].value).toBe(
      "https://example.org/datasets/plain-1"
    );
  });

  it("maps all shared fields for a fully-populated AI Model record", async () => {
    const quads = await parseRdfXmlToQuads(canonicalAiModelDiscoveryRdf);
    const graph = new RdfGraph(quads);
    const subject = graph
      .getSubjectsOfType(DCAT_DATASET)
      .find((s) => s.value === "https://example.org/ai-models/1")!;

    expect(mapAiModel(subject, graph, 0)).toEqual({
      id: "ai-model-1",
      identifier: "ai-model-1",
      entityType: "AI_MODEL",
      title: "Chest X-Ray Classifier",
      description:
        "Deep learning model for detecting pneumonia from chest X-rays",
      createdAt: "2025-03-01T00:00:00.000Z",
      modifiedAt: "2026-01-10T09:00:00.000Z",
      version: "2.1.0",
      hasVersions: [
        { value: "https://example.org/ai-models/1/v1", label: "v1" },
      ],
      versionNotes: "Retrained on expanded dataset",
      keywords: ["radiology", "classification"],
      accessRights: {
        value: "http://publications.europa.eu/resource/authority/access-right/PUBLIC",
        label: "Public",
      },
      documentation: ["https://example.org/docs/ai-models/1"],
      contacts: [
        {
          name: "Support Team",
          email: "support@lnds.lu",
          uri: undefined,
          url: undefined,
          identifier: undefined,
        },
      ],
      publishers: [{ name: "LNDS AI Lab", email: "ai-lab@lnds.lu" }],
      creators: [{ name: "Dr. Jane Doe" }],
    });
  });

  it("maps a minimal AI Model record with only required fields cleanly, with no errors", async () => {
    const quads = await parseRdfXmlToQuads(canonicalAiModelDiscoveryRdf);
    const graph = new RdfGraph(quads);
    const subject = graph
      .getSubjectsOfType(DCAT_DATASET)
      .find((s) => s.value === "https://example.org/ai-models/2")!;

    expect(mapAiModel(subject, graph, 1)).toEqual({
      id: "ai-model-2",
      identifier: "ai-model-2",
      entityType: "AI_MODEL",
      title: "Minimal Model",
      description: "A model record with only the required fields",
      createdAt: undefined,
      modifiedAt: undefined,
      version: undefined,
      hasVersions: undefined,
      versionNotes: undefined,
      keywords: [],
      accessRights: undefined,
      documentation: undefined,
      contacts: undefined,
      publishers: [],
      creators: [],
    });
  });
});
