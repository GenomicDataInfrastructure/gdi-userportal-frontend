/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import renderer from "../renderer";
import { Tokens, RendererObject } from "marked";

describe("Renderer Tests", () => {
  type RendererContext = RendererObject;

  it("should render a heading correctly", () => {
    const token: Tokens.Heading = {
      type: "heading",
      depth: 1,
      text: "Heading 1",
      raw: "Heading 1",
      tokens: [],
    };

    if (renderer.heading) {
      // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
      const result = renderer.heading.call(renderer as RendererContext, token);
      const expected = `<h1 class="text-left font-medium text-2xl sm:text-3xl mb-4">Heading 1</h1>`;
      expect(result).toBe(expected);
    } else {
      throw new Error("renderer.heading is undefined");
    }
  });

  it("should render a paragraph correctly", () => {
    const token: Tokens.Paragraph = {
      type: "paragraph",
      text: "This is a paragraph.",
      raw: "This is a paragraph.",
      tokens: [],
    };

    if (renderer.paragraph) {
      const result = renderer.paragraph.call(
        // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
        renderer as RendererContext,
        token
      );
      const expected = `<p class="mb-4">This is a paragraph.</p>`;
      expect(result).toBe(expected);
    } else {
      throw new Error("renderer.paragraph is undefined");
    }
  });

  it("should render an unordered list correctly", () => {
    const token: {
      ordered: boolean;
      raw: string;
      type: string;
      items: {
        task: boolean;
        loose: boolean;
        raw: string;
        tokens: unknown[];
        text: string;
        type: string;
      }[];
    } = {
      type: "list",
      ordered: false,
      items: [
        {
          type: "list_item",
          text: "Item 1",
          raw: "Item 1",
          tokens: [],
          task: false,
          loose: false,
        },
        {
          type: "list_item",
          text: "Item 2",
          raw: "Item 2",
          tokens: [],
          task: false,
          loose: false,
        },
      ],
      raw: "Item 1\nItem 2",
    };

    if (renderer.list) {
      // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
      const result = renderer.list.call(renderer as RendererContext, token);
      const expected = `<ul class="list-inside list-disc mb-4"><li>Item 1</li><li>Item 2</li></ul>`;
      expect(result).toBe(expected);
    } else {
      throw new Error("renderer.list is undefined");
    }
  });

  it("should render a list item correctly", () => {
    const token: Tokens.ListItem = {
      type: "list_item",
      text: "List item",
      raw: "List item",
      tokens: [],
      task: false,
      loose: false,
    };

    if (renderer.listitem) {
      // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
      const result = renderer.listitem.call(renderer as RendererContext, token);
      const expected = `<li class="mb-2">List item</li>`;
      expect(result).toBe(expected);
    } else {
      throw new Error("renderer.listitem is undefined");
    }
  });

  it("should render a link correctly", () => {
    const token: Tokens.Link = {
      type: "link",
      href: "https://example.com",
      text: "Example",
      raw: "Example",
      tokens: [],
    };

    if (renderer.link) {
      // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
      const result = renderer.link.call(renderer as RendererContext, token);
      const expected = `<a href="https://example.com" class="text-info hover:underline" target="_blank" rel="noopener noreferrer">Example</a>`;
      expect(result).toBe(expected);
    } else {
      throw new Error("renderer.link is undefined");
    }
  });
});
