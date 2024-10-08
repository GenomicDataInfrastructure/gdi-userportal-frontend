// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { createApplicationCardItems } from "../applicationCardItems";
import { ListedApplication } from "@/types/application.types";

describe("applicationCardItems", () => {
  beforeEach(() => {
    global.window = {} as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    global.window = undefined as unknown as Window & typeof globalThis;
  });

  it("should return application card items", () => {
    const application: ListedApplication = {
      id: 1,
      title: "application1",
      description: "app 1 description",
      datasets: [],
      currentState: "submitted",
      createdAt: "2024-07-12",
      stateChangedAt: "2024-08-03",
    };

    const items = createApplicationCardItems(application);
    expect(items.length).toBe(2);
    expect(items[0].text).toBe("Created on 12 July 2024");
    expect(items[1].text).toBe("Modified on 3 August 2024");
  });
  it("should return applicationCardItems with empty strings when dates are not empty", () => {
    const application: ListedApplication = {
      id: 1,
      title: "application1",
      description: "app 1 description",
      datasets: [],
      currentState: "submitted",
      createdAt: "",
      stateChangedAt: "",
    };

    const items = createApplicationCardItems(application);
    expect(items.length).toBe(2);
    expect(items[0].text).toBe("");
    expect(items[1].text).toBe("");
  });
});
