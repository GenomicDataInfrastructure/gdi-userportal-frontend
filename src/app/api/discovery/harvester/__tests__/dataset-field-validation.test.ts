// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  collectDatasetFieldWarnings,
  findMissingRequiredFields,
} from "@/app/api/discovery/harvester/dataset-field-validation";
import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";

const completeDataset: LocalDiscoveryDataset = {
  id: "d1",
  identifier: "d1-identifier",
  title: "Dataset 1",
  description: "A complete dataset",
  publishers: [{ name: "Org" }],
  hdab: [],
  creators: [],
};

describe("findMissingRequiredFields", () => {
  test("returns an empty array for a fully populated dataset", () => {
    expect(findMissingRequiredFields(completeDataset)).toEqual([]);
  });

  test("flags a missing title", () => {
    const dataset = { ...completeDataset, title: "" };
    expect(findMissingRequiredFields(dataset)).toEqual(["title"]);
  });

  test("flags a missing description", () => {
    const dataset = { ...completeDataset, description: undefined };
    expect(findMissingRequiredFields(dataset)).toEqual(["description"]);
  });

  test("flags a missing identifier", () => {
    const dataset = { ...completeDataset, identifier: undefined };
    expect(findMissingRequiredFields(dataset)).toEqual(["identifier"]);
  });

  test("flags a missing publisher when the publishers array is empty", () => {
    const dataset = { ...completeDataset, publishers: [] };
    expect(findMissingRequiredFields(dataset)).toEqual(["publisher"]);
  });

  test("flags multiple missing fields together", () => {
    const dataset = {
      ...completeDataset,
      title: "",
      description: undefined,
      publishers: [],
    };
    expect(findMissingRequiredFields(dataset)).toEqual([
      "title",
      "description",
      "publisher",
    ]);
  });
});

describe("collectDatasetFieldWarnings", () => {
  test("returns no warnings when every dataset is complete", () => {
    expect(collectDatasetFieldWarnings([completeDataset])).toEqual([]);
  });

  test("returns one warning per dataset with missing fields, keeping successful datasets out", () => {
    const incomplete: LocalDiscoveryDataset = {
      ...completeDataset,
      id: "d2",
      title: "Incomplete Dataset",
      description: undefined,
      publishers: [],
    };

    const warnings = collectDatasetFieldWarnings([completeDataset, incomplete]);

    expect(warnings).toEqual([
      {
        subjectId: "d2",
        datasetTitle: "Incomplete Dataset",
        type: "missingFields",
        details: ["description", "publisher"],
      },
    ]);
  });

  test("omits datasetTitle when the title itself is missing", () => {
    const noTitle: LocalDiscoveryDataset = {
      ...completeDataset,
      id: "d3",
      title: "",
    };

    const warnings = collectDatasetFieldWarnings([noTitle]);

    expect(warnings).toEqual([
      {
        subjectId: "d3",
        datasetTitle: undefined,
        type: "missingFields",
        details: ["title"],
      },
    ]);
  });
});
