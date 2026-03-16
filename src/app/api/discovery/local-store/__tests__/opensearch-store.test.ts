// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import { jest } from "@jest/globals";
import { OpenSearchDiscoveryStore } from "@/app/api/discovery/local-store/opensearch-store";

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

describe("OpenSearchDiscoveryStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.put.mockResolvedValue({});
    mockClient.post.mockResolvedValue({ data: {} });
    mockClient.get.mockResolvedValue({ data: {} });
  });

  const createStore = () =>
    new OpenSearchDiscoveryStore({
      baseUrl: "https://localhost:9200",
      indexName: "discovery_datasets",
      username: "elastic",
      password: "secret",
      insecureTls: true,
    });

  test("ensureInitialized creates index once", async () => {
    const store = createStore();

    await store.ensureInitialized();
    await store.ensureInitialized();

    expect(mockClient.put).toHaveBeenCalledTimes(1);
    expect(mockClient.put).toHaveBeenCalledWith(
      "/discovery_datasets",
      expect.any(Object)
    );
  });

  test("ensureInitialized swallows already-exists error", async () => {
    const store = createStore();
    mockClient.put.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: { error: { type: "resource_already_exists_exception" } },
      },
    });

    await expect(store.ensureInitialized()).resolves.toBeUndefined();
  });

  test("ensureInitialized rethrows non-matching errors", async () => {
    const store = createStore();
    mockClient.put.mockRejectedValueOnce(new Error("boom"));

    await expect(store.ensureInitialized()).rejects.toThrow("boom");
  });

  test("clearDatasets issues delete_by_query", async () => {
    const store = createStore();

    await store.clearDatasets();

    expect(mockClient.post).toHaveBeenCalledWith(
      "/discovery_datasets/_delete_by_query",
      { query: { match_all: {} } }
    );
  });

  test("searchDatasets builds search and maps response", async () => {
    const store = createStore();
    mockClient.post.mockResolvedValueOnce({
      data: {
        hits: {
          total: { value: 1 },
          hits: [{ _id: "x", _source: { title: "Registry dataset" } }],
        },
      },
    });

    const result = await store.searchDatasets({
      query: "Regis",
      start: 0,
      rows: 10,
    });

    expect(mockClient.post).toHaveBeenCalledWith(
      "/discovery_datasets/_search",
      expect.any(Object)
    );
    expect(result.count).toBe(1);
    expect(result.results[0].id).toBe("x");
  });

  test("searchDatasets surfaces OpenSearch error details", async () => {
    const store = createStore();
    mockClient.post.mockRejectedValueOnce({
      isAxiosError: true,
      message: "Request failed with status code 400",
      response: {
        status: 400,
        data: {
          error: {
            type: "query_shard_exception",
            reason: "phrase prefix requires text field",
          },
        },
      },
    });

    await expect(store.searchDatasets({ query: "adminis" })).rejects.toThrow(
      'OpenSearch search request failed (400): {"type":"query_shard_exception","reason":"phrase prefix requires text field"}'
    );
  });

  test("searchDatasets falls back to axios message when no response reason exists", async () => {
    const store = createStore();
    mockClient.post.mockRejectedValueOnce({
      isAxiosError: true,
      message: "Request failed with status code 429",
      response: { status: 429, data: "too many requests" },
    });

    await expect(store.searchDatasets({ query: "adminis" })).rejects.toThrow(
      "OpenSearch search request failed (429): Request failed with status code 429"
    );
  });

  test("searchDatasets falls back to non-axios error messages", async () => {
    const store = createStore();
    mockClient.post.mockRejectedValueOnce(new Error("socket closed"));

    await expect(store.searchDatasets({ query: "adminis" })).rejects.toThrow(
      "socket closed"
    );
  });

  test("retrieveDataset returns null on 404", async () => {
    const store = createStore();
    mockClient.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 },
    });

    await expect(store.retrieveDataset("missing")).resolves.toBeNull();
  });

  test("retrieveDataset rethrows non-404 errors", async () => {
    const store = createStore();
    mockClient.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 500 },
    });

    await expect(store.retrieveDataset("boom")).rejects.toEqual({
      isAxiosError: true,
      response: { status: 500 },
    });
  });

  test("retrieveDataset returns mapped document", async () => {
    const store = createStore();
    mockClient.get.mockResolvedValueOnce({
      data: {
        _id: "dataset-1",
        _source: { title: "Dataset 1", description: "Desc" },
      },
    });

    await expect(store.retrieveDataset("dataset-1")).resolves.toEqual({
      id: "dataset-1",
      title: "Dataset 1",
      description: "Desc",
      publishers: [],
      hdab: [],
      creators: [],
    });
  });

  test("upsertDatasets no-op on empty input", async () => {
    const store = createStore();
    await store.upsertDatasets([]);

    expect(mockClient.post).not.toHaveBeenCalledWith(
      "/_bulk",
      expect.anything(),
      expect.anything()
    );
  });

  test("upsertDatasets sends bulk request and throws when OpenSearch reports errors", async () => {
    const store = createStore();
    mockClient.post.mockResolvedValueOnce({ data: { errors: false } });

    await expect(
      store.upsertDatasets([
        {
          id: "1",
          title: "A",
          description: "D",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    ).resolves.toBeUndefined();

    mockClient.post.mockResolvedValueOnce({ data: { errors: true } });
    await expect(
      store.upsertDatasets([
        {
          id: "2",
          title: "B",
          description: "E",
          publishers: [],
          hdab: [],
          creators: [],
        },
      ])
    ).rejects.toThrow("OpenSearch bulk upsert reported item-level errors");
  });

  test("constructor passes auth and tls options to axios.create", () => {
    createStore();

    expect((axios as any).create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://localhost:9200",
        auth: { username: "elastic", password: "secret" },
      })
    );
  });

  test("constructor sets ApiKey header when provided", () => {
    new OpenSearchDiscoveryStore({
      baseUrl: "https://localhost:9200",
      indexName: "discovery_datasets",
      apiKey: "abc123",
    });

    expect((axios as any).create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { Authorization: "ApiKey abc123" },
        auth: undefined,
      })
    );
  });
});
