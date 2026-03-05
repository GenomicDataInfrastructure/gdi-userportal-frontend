// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { BasePlaceholderDiscoveryProvider } from "@/app/api/discovery/providers/base-placeholder-provider";

class TestPlaceholderDiscoveryProvider extends BasePlaceholderDiscoveryProvider {
  readonly key = "test-provider";

  readonly capabilities = {
    supportsBeaconEnrichment: false,
    supportsGVariants: false,
    supportsFilterEntries: false,
  } as const;

  public exposeCreateNotImplementedError(operation: string): Error {
    return this.createNotImplementedError(operation);
  }
}

describe("BasePlaceholderDiscoveryProvider", () => {
  const provider = new TestPlaceholderDiscoveryProvider();

  test("creates not implemented error message with provider key", () => {
    const error = provider.exposeCreateNotImplementedError("searchDatasets");

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(
      'Discovery provider "test-provider" does not implement "searchDatasets" yet'
    );
  });

  test("throws for retrieveFilters", async () => {
    await expect(provider.retrieveFilters({})).rejects.toThrow(
      'Discovery provider "test-provider" does not implement "retrieveFilters" yet'
    );
  });

  test("throws for retrieveFilterValues", async () => {
    await expect(
      provider.retrieveFilterValues("publisher_name", {})
    ).rejects.toThrow(
      'Discovery provider "test-provider" does not implement "retrieveFilterValues" yet'
    );
  });

  test("throws for searchDatasets", async () => {
    await expect(provider.searchDatasets({}, {})).rejects.toThrow(
      'Discovery provider "test-provider" does not implement "searchDatasets" yet'
    );
  });

  test("throws for retrieveDataset", async () => {
    await expect(provider.retrieveDataset("id-1")).rejects.toThrow(
      'Discovery provider "test-provider" does not implement "retrieveDataset" yet'
    );
  });

  test("throws for retrieveDatasetInFormat", async () => {
    await expect(
      provider.retrieveDatasetInFormat("id-1", "rdf", {})
    ).rejects.toThrow(
      'Discovery provider "test-provider" does not implement "retrieveDatasetInFormat" yet'
    );
  });

  test("throws for searchGVariants", async () => {
    await expect(provider.searchGVariants({ params: {} })).rejects.toThrow(
      'Discovery provider "test-provider" does not implement "searchGVariants" yet'
    );
  });
});
