// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { DiscoverySearchedAiModel } from "@/app/api/discovery/providers/types";
import { createAiModelCardItems } from "../aiModelCardItems";

describe("createAiModelCardItems", () => {
  it("uses localized date labels", () => {
    const aiModel = {
      id: "ai-model-1",
      title: "Model",
      createdAt: "2024-02-09T10:27:47.585Z",
      modifiedAt: "2024-02-10T10:27:47.585Z",
      publishers: [],
      creators: [],
    } as DiscoverySearchedAiModel;

    expect(
      createAiModelCardItems(
        aiModel,
        {
          createdOn: "Créé le",
          modifiedOn: "Modifié le",
        },
        "Bibliothèques"
      )
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "Créé le 9 February 2024" }),
        expect.objectContaining({ text: "Modifié le 10 February 2024" }),
      ])
    );
  });

  it("includes libraries when present", () => {
    const aiModel = {
      id: "ai-model-1",
      title: "Model",
      publishers: [],
      creators: [],
      libraries: ["transformers", "spacy"],
    } as DiscoverySearchedAiModel;

    expect(
      createAiModelCardItems(
        aiModel,
        { createdOn: "Created on", modifiedOn: "Modified on" },
        "Libraries"
      )
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "Libraries: transformers, spacy" }),
      ])
    );
  });

  it("omits the libraries item when there are none", () => {
    const aiModel = {
      id: "ai-model-1",
      title: "Model",
      publishers: [],
      creators: [],
    } as DiscoverySearchedAiModel;

    expect(
      createAiModelCardItems(
        aiModel,
        { createdOn: "Created on", modifiedOn: "Modified on" },
        "Libraries"
      )
    ).toEqual(expect.arrayContaining([expect.objectContaining({ text: "" })]));
  });
});
