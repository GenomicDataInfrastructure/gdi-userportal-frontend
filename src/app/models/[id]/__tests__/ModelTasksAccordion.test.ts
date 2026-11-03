// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { DiscoveryModelTask } from "@/app/api/discovery/providers/types";
import { groupModelTasks } from "../ModelTasksAccordion";

describe("groupModelTasks", () => {
  it("groups and deduplicates modality/task/subtask triples", () => {
    const modelTasks: DiscoveryModelTask[] = [
      {
        modality: { value: "modality:text", label: "Text" },
        task: { value: "classification", label: "Classification" },
        subtask: { value: "sentiment", label: "Sentiment analysis" },
      },
      {
        modality: { value: "modality:text", label: "Text" },
        task: { value: "classification", label: "Classification" },
        subtask: { value: "sentiment", label: "Sentiment analysis" },
      },
      {
        modality: { value: "modality:text", label: "Text" },
        task: { value: "summarization", label: "Summarization" },
      },
    ];

    expect(groupModelTasks(modelTasks)).toEqual([
      {
        modality: { value: "modality:text", label: "Text" },
        tasks: [
          {
            task: { value: "classification", label: "Classification" },
            subtasks: [{ value: "sentiment", label: "Sentiment analysis" }],
          },
          {
            task: { value: "summarization", label: "Summarization" },
            subtasks: [],
          },
        ],
      },
    ]);
  });
});
