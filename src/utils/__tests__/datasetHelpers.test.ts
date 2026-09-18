// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { extractHelpTextMap } from "@/utils/datasetHelpers";

describe("extractHelpTextMap", () => {
  it("normalizes legacy strings and structured help text", () => {
    expect(
      extractHelpTextMap({
        title: "Legacy dataset title help text",
        description: { text: "Structured dataset description help text" },
      })
    ).toEqual({
      title: "Legacy dataset title help text",
      description: "Structured dataset description help text",
    });
  });

  it("omits empty legacy strings and structured entries without text", () => {
    expect(
      extractHelpTextMap({
        title: "",
        description: {
          link: { label: ["More"], value: ["https://example.org"] },
        },
      })
    ).toEqual({});
  });
});
