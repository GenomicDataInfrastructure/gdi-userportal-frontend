// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import { createEntitlementCardItems } from "../entitlementCardItems";

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
      keywords: [
        {
          label: "keyword1",
          value: "keyword1",
        },
        {
          label: "keyword2",
          value: "keyword2",
        },
      ],
      distributionsCount: 2,
      organization: {
        id: "1",
        title: "organization1",
        imageUrl: "",
        numberOfDatasets: 0,
        name: "organization1",
        description: "organization1 description",
      },
      createdAt: "2024-03-01T00:00:00.000Z",
      modifiedAt: "",
    };

    const items = createEntitlementCardItems(dataset, "2024-06-23", "");

    expect(items.length).toBe(7);
    expect(items[0].text).toBe("Created on 1 March 2024");
    expect(items[1].text).toBe("");
    expect(items[2].text).toBe("Published by organization1");
    expect(items[3].text).toBe("2 Distributions");
    expect(items[4].text).toBe("");
    expect(items[5].text).toBe("Start: 23 June 2024");
    expect(items[6].text).toBe("End: N/A");
  });
});
