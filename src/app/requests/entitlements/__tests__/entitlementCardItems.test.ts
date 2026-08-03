// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  createEntitlementCardItems,
  formatEntitlementSourceLabel,
} from "../entitlementCardItems";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

describe("entitlementCardItems", () => {
  beforeEach(() => {
    global.window = {} as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    global.window = undefined as unknown as Window & typeof globalThis;
  });

  it("should return entitlement Card items", () => {
    const dataset: SearchedDataset = {
      id: "1",
      title: "",
      description: "dataset1 description",
      themes: [{ value: "theme1", label: "theme1" }],
      keywords: ["keyword1", "keyword2"],
      distributionsCount: 2,
      publishers: [
        {
          name: "publisher1",
          email: "publisher1@example.com",
          url: "https://publisher1.com",
          type: { value: "publisher", label: "Publisher" },
          identifier: "publisher1",
        },
      ],
      createdAt: "2024-03-01T00:00:00.000Z",
      modifiedAt: "",
    };

    const items = createEntitlementCardItems(dataset, "2024-06-23", "");

    expect(items.length).toBe(9);
    expect(items[0].text).toBe("Created on 1 March 2024");
    expect(items[1].text).toBe("");
    expect(items[2].text).toBe("");
    expect(items[3].text).toBe("Published by publisher1");
    expect(items[4].text).toBe("2 Distributions");
    expect(items[5].text).toBe("");
    expect(items[6].text).toBe("");
    expect(items[7].text).toBe("Start: 23 June 2024");
    expect(items[8].text).toBe("End: N/A");
  });
});

describe("formatEntitlementSourceLabel", () => {
  it("returns undefined when both source and by are undefined", () => {
    expect(formatEntitlementSourceLabel(undefined, undefined)).toBeUndefined();
  });

  it("returns undefined when both source and by are empty strings", () => {
    expect(formatEntitlementSourceLabel("", "")).toBeUndefined();
  });

  it("returns only the by part when source is absent", () => {
    expect(formatEntitlementSourceLabel(undefined, "REMS")).toBe(
      "Granted by: REMS"
    );
  });

  it("returns only the source part when by is absent", () => {
    expect(formatEntitlementSourceLabel("ckan", undefined)).toBe(
      "Source: ckan"
    );
  });

  it("returns combined label when both source and by are present", () => {
    expect(formatEntitlementSourceLabel("ckan", "REMS")).toBe(
      "Granted by: REMS | Source: ckan"
    );
  });

  it("uses translated messages when provided", () => {
    const messages = { grantedBy: "Accordé par", source: "Source" };
    expect(formatEntitlementSourceLabel("ckan", "REMS", messages)).toBe(
      "Accordé par: REMS | Source: ckan"
    );
  });

  it("falls back to English when messages are not provided", () => {
    expect(formatEntitlementSourceLabel("ckan", "REMS")).toBe(
      "Granted by: REMS | Source: ckan"
    );
  });
});
