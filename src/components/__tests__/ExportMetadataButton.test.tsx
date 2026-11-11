/** @jest-environment jsdom */
// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import ExportMetadataButton from "../ExportMetadataButton";
import { exportMetadataFormats } from "../ExportMetadataFormats";

jest.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: React.ComponentProps<"a">) =>
    createElement("a", props, children),
}));

describe("ExportMetadataButton", () => {
  beforeAll(() => {
    (
      globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
  });

  test("triggers a download via the provided retrieveInFormat callback", async () => {
    const blob = new Blob(["<rdf/>"], { type: "application/rdf+xml" });
    const retrieveInFormat = jest
      .fn<Promise<Blob>, [string, "rdf" | "ttl" | "jsonld"]>()
      .mockResolvedValue(blob);
    const createObjectURL = jest.fn().mockReturnValue("blob:mock-url");
    window.URL.createObjectURL = createObjectURL;
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        createElement(ExportMetadataButton, {
          id: "ai-model-1",
          item: exportMetadataFormats[0],
          retrieveInFormat,
        })
      );
    });

    const button = container.querySelector("button");
    expect(button).not.toBeNull();

    await act(async () => {
      button!.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    });

    expect(retrieveInFormat).toHaveBeenCalledWith("ai-model-1", "rdf");
    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
    act(() => root.unmount());
    container.remove();
  });

  test("logs instead of throwing when retrieveInFormat rejects", async () => {
    const retrieveInFormat = jest
      .fn<Promise<Blob>, [string, "rdf" | "ttl" | "jsonld"]>()
      .mockRejectedValue(new Error("export failed"));
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        createElement(ExportMetadataButton, {
          id: "ai-model-1",
          item: exportMetadataFormats[1],
          retrieveInFormat,
        })
      );
    });

    const button = container.querySelector("button");

    await act(async () => {
      button!.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    });

    expect(retrieveInFormat).toHaveBeenCalledWith("ai-model-1", "ttl");
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
    act(() => root.unmount());
    container.remove();
  });
});
