// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { OpenSearchAiModelStore } from "@/app/api/discovery/local-store/opensearch/ai-model-store";

const mockClient = {
  put: jest.fn<(_url: string, _body: unknown) => Promise<unknown>>(),
  post: jest.fn<
    (_url: string, _body?: unknown, _config?: unknown) => Promise<{ data: any }>
  >(),
  get: jest.fn<(_url: string) => Promise<{ data: any }>>(),
};

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn<() => typeof mockClient>(() => mockClient),
    isAxiosError: jest.fn((error: any) => Boolean(error?.isAxiosError)),
  },
}));

describe("OpenSearchAiModelStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.put.mockResolvedValue({});
    mockClient.post.mockResolvedValue({ data: {} });
    mockClient.get.mockResolvedValue({ data: {} });
  });

  const createStore = () =>
    new OpenSearchAiModelStore({
      baseUrl: "https://localhost:9200",
      indexName: "discovery_ai_models",
    });

  test("searchAiModels builds search and maps response", async () => {
    const store = createStore();
    mockClient.post.mockResolvedValueOnce({
      data: {
        hits: {
          total: { value: 1 },
          hits: [{ _id: "ai-model-1", _source: { title: "Chest X-Ray" } }],
        },
      },
    });

    const result = await store.searchAiModels({ query: "chest" });

    expect(mockClient.post).toHaveBeenCalledWith(
      "/discovery_ai_models/_search",
      expect.any(Object)
    );
    expect(result.count).toBe(1);
    expect(result.results[0].id).toBe("ai-model-1");
    expect(result.results[0].entityType).toBe("AI_MODEL");
  });

  test("retrieveAiModel returns the mapped document", async () => {
    const store = createStore();
    mockClient.get.mockResolvedValueOnce({
      data: { _id: "ai-model-1", _source: { title: "Chest X-Ray" } },
    });

    const result = await store.retrieveAiModel("ai-model-1");

    expect(mockClient.get).toHaveBeenCalledWith(
      "/discovery_ai_models/_doc/ai-model-1"
    );
    expect(result?.title).toBe("Chest X-Ray");
  });

  test("retrieveAiModel returns null on 404", async () => {
    const store = createStore();
    mockClient.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 },
    });

    await expect(store.retrieveAiModel("missing")).resolves.toBeNull();
  });

  test("upsertAiModels sends a bulk request", async () => {
    const store = createStore();

    await store.upsertAiModels([
      { id: "ai-model-1", title: "Model", entityType: "AI_MODEL", publishers: [], creators: [] },
    ]);

    expect(mockClient.post).toHaveBeenCalledWith(
      "/_bulk",
      expect.any(String),
      expect.objectContaining({
        headers: { "Content-Type": "application/x-ndjson" },
      })
    );
  });
});
