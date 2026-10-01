/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { act, createElement, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  DatasetBasketProvider,
  useDatasetBasket,
} from "../DatasetBasketProvider";
import type { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

const mockSession = { user: { email: "user@example.org" } };
let mockStatus = "authenticated";
const mockRetrieve = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: mockSession, status: mockStatus }),
}));
jest.mock("@/app/api/ga4gh/entitlements", () => ({
  retrieveEntitlements: () => mockRetrieve(),
}));

let basket: ReturnType<typeof useDatasetBasket>;
function Probe() {
  const state = useDatasetBasket();
  useEffect(() => {
    basket = state;
  });
  return null;
}

const dataset = { id: "catalog-id", identifier: "grant-id" } as SearchedDataset;

it("blocks adding granted datasets, ignores expired grants, and clears access on logout", async () => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear();
  mockRetrieve.mockResolvedValue({
    entitlements: [
      { datasetId: "grant-id", source: "https://data.example.org/dataset" },
      { datasetId: "expired-id", end: "2000-01-01T00:00:00Z" },
    ],
  });
  const root = createRoot(document.createElement("div"));
  const render = () =>
    root.render(
      createElement(DatasetBasketProvider, null, createElement(Probe))
    );
  try {
    await act(async () => render());
    expect(basket.hasDatasetAccess(dataset)).toBe(true);
    expect(
      basket.hasDatasetAccess({ id: "expired-id" } as SearchedDataset)
    ).toBe(false);
    act(() => basket.addDatasetToBasket(dataset));
    expect(basket.basket).toEqual([]);

    mockRetrieve.mockResolvedValue({ entitlements: [] });
    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });
    expect(basket.hasDatasetAccess(dataset)).toBe(false);

    mockRetrieve.mockResolvedValue({
      entitlements: [{ datasetId: "grant-id" }],
    });
    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });
    expect(basket.hasDatasetAccess(dataset)).toBe(true);
    mockStatus = "unauthenticated";
    await act(async () => render());
    expect(basket.hasDatasetAccess(dataset)).toBe(false);
  } finally {
    act(() => root.unmount());
  }
});
