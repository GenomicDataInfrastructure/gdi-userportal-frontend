/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import axe from "axe-core";
import Card from "../Card";
import AddToBasketButton from "../AddToBasketButton";
import type { SearchedDataset } from "@/app/api/discovery/open-api/schemas";

let mockGranted = false;
const mockAdd = jest.fn();
jest.mock("@/providers/DatasetBasketProvider", () => ({
  useDatasetBasket: () => ({
    basket: [],
    isLoading: false,
    isAccessLoading: false,
    hasDatasetAccess: () => mockGranted,
    addDatasetToBasket: mockAdd,
    removeDatasetFromBasket: jest.fn(),
  }),
}));
jest.mock("@/config/contentConfig", () => ({
  __esModule: true,
  default: { showBasketAndLogin: true },
}));
jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: React.ComponentProps<"a">) =>
    createElement("a", props, children),
}));

it("separates navigation and actions and announces granted access as a status", async () => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("main");
  document.body.appendChild(container);
  const root = createRoot(container);
  const dataset = {
    id: "test",
    identifier: "test",
    title: "Test dataset",
  } as SearchedDataset;
  const render = () =>
    root.render(
      createElement(Card, {
        title: dataset.title,
        url: "/datasets/test",
        cardItems: [],
        button: createElement(AddToBasketButton, { dataset }),
      })
    );
  try {
    await act(async () => render());
    expect(container.querySelector("a button")).toBeNull();
    expect(container.querySelector("a")?.textContent).toBe(dataset.title);
    const status = container.querySelector('[role="status"]');
    expect(status).not.toBeNull();
    await act(async () => container.querySelector("button")!.click());
    expect(mockAdd).toHaveBeenCalledWith(dataset);
    const audit = await axe.run(container, {
      runOnly: {
        type: "rule",
        values: [
          "nested-interactive",
          "button-name",
          "link-name",
          "aria-valid-attr",
          "aria-valid-attr-value",
        ],
      },
    });
    expect(audit.violations).toEqual([]);
    mockGranted = true;
    await act(async () => render());
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector('[role="status"]')).toBe(status);
    expect(status?.textContent).toContain("accessGranted");
    expect(status?.textContent).toContain(dataset.title);
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});

it("keeps an external access action visible after access is granted", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const dataset = {
    id: "external-test",
    identifier: "external-test",
    title: "External test dataset",
  } as SearchedDataset;
  mockGranted = true;

  try {
    await act(async () =>
      root.render(
        createElement(AddToBasketButton, {
          dataset,
          withoutAccessContent: createElement(
            "a",
            { href: "https://example.test/access" },
            "Open external portal"
          ),
        })
      )
    );

    expect(container.querySelector('[role="status"]')?.textContent).toContain(
      "accessGranted"
    );
    expect(container.querySelector("a")?.textContent).toBe(
      "Open external portal"
    );
  } finally {
    act(() => root.unmount());
    container.remove();
    mockGranted = false;
  }
});
