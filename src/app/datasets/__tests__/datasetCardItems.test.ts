// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { createDatasetCardItems } from "../datasetCardItems";
import { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

describe("datasetCardItems", () => {
  beforeEach(() => {
    global.window = {} as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    global.window = undefined as unknown as Window & typeof globalThis;
  });

  it("should return dataset card items", () => {
    const dataset: SearchedDataset = {
      id: "1",
      title: "",
      description: "dataset1 description",
      themes: [{ value: "theme1", label: "theme1" }],
      keywords: ["keyword1", "keyword2"],
      distributionsCount: 1,
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
      recordsCount: 21,
    };

    const items = createDatasetCardItems(dataset);
    expect(items.length).toBe(5);
    expect(items[0].text).toBe("Created on 1 March 2024");
    expect(items[1].text).toBe("");
    expect(items[2].text).toBe("Published by publisher1");
    expect(items[3].text).toBe("1 Distribution");
    expect(items[4].text).toBe("21 Records");
  });
});
