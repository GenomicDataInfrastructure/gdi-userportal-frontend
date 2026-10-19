// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { DcatHarvesterService } from "@/app/api/discovery/harvester/dcat-harvester-service";
import { canonicalAiModelDiscoveryRdf } from "@/app/api/discovery/test-utils/fixtures";

jest.mock("@/app/api/discovery/harvester/shacl/shacl-validator", () => ({
  validateHealthDcatAp: jest.fn(() => Promise.resolve([])),
}));

describe("DcatHarvesterService — AI Model routing", () => {
  it("splits AI Model subjects from Dataset subjects in the same RDF feed", async () => {
    const service = new DcatHarvesterService();

    const { datasets, aiModels } = await service.parseCatalogueFromRdf(
      canonicalAiModelDiscoveryRdf
    );

    expect(aiModels.map((m) => m.id).sort()).toEqual([
      "ai-model-1",
      "ai-model-2",
    ]);
    expect(aiModels.every((m) => m.entityType === "AI_MODEL")).toBe(true);
    expect(datasets.map((d) => d.id)).toEqual(["plain-dataset-1"]);
  });

  it("does not map AI Models when the caller disables the feature", async () => {
    const service = new DcatHarvesterService();

    const { datasets, aiModels } = await service.parseCatalogueFromRdf(
      canonicalAiModelDiscoveryRdf,
      undefined,
      undefined,
      undefined,
      false
    );

    expect(aiModels).toEqual([]);
    expect(datasets.map((dataset) => dataset.id)).toEqual(["plain-dataset-1"]);
  });
});
