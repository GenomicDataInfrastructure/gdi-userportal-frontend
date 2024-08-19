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

describe("stringifyContent function", () => {
  it("should return text content when content type is 'text'", () => {
    const content = { type: "text", text: "Sample Text" };
    // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
    const result = renderer.heading?.({ text: content.text, depth: 1 });
    expect(result).toContain("Sample Text");
  });

  it("should return a list when content type is 'list' and items are defined", () => {
    const content = {
      type: "list",
      items: [
        { type: "text", text: "Item 1" },
        { type: "text", text: "Item 2" },
      ],
    };
    // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
    const result = renderer.list?.({
      type: "list",
      ordered: false,
      raw: "",
      items:
        content.items?.map((item) => ({
          raw: "",
          tokens: [],
          text: item.text,
          type: "list_item",
          task: false,
          loose: false,
        })) || [],
    } as Tokens.List);
    expect(result).toContain("<ul");
    expect(result).toContain("<li>Item 1</li>");
    expect(result).toContain("<li>Item 2</li>");
  });

  it("should stringify unknown content types", () => {
    const content = { type: "unknown", text: "Unknown Content" };
    // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
    const result = renderer.heading?.({
      text: JSON.stringify(content),
      depth: 1,
    });
    expect(result).toContain("Unknown Content");
  });

  it("should return the string representation of non-object content", () => {
    const contentString = "Simple string content";
    // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
    const result = renderer.heading?.({ text: contentString, depth: 1 });
    expect(result).toContain("Simple string content");

    const contentNumber = 12345;
    // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
    const resultNumber = renderer.heading?.({
      text: contentNumber.toString(),
      depth: 1,
    });
    expect(resultNumber).toContain("12345");

    const contentBoolean = true;
    // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
    const resultBoolean = renderer.heading?.({
      text: contentBoolean.toString(),
      depth: 1,
    });
    expect(resultBoolean).toContain("true");
  });
});

describe("Renderer Tests - List Handling", () => {
  type RendererContext = RendererObject;

  it("should render an ordered list correctly", () => {
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
      ordered: true,
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
      expect(result).toContain("<ol"); // Check if "ol" is used
      expect(result).toContain("<li>Item 1</li>");
      expect(result).toContain("<li>Item 2</li>");
    } else {
      throw new Error("renderer.list is undefined");
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
      expect(result).toContain("<ul"); // Check if "ul" is used
      expect(result).toContain("<li>Item 1</li>");
      expect(result).toContain("<li>Item 2</li>");
    } else {
      throw new Error("renderer.list is undefined");
    }
  });
});

describe("Renderer Tests - Heading Handling", () => {
  type RendererContext = RendererObject;

  it("should render a heading with depth 1 correctly", () => {
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

  it("should render a heading with depth other than 1 correctly", () => {
    const token: Tokens.Heading = {
      type: "heading",
      depth: 2,
      text: "Heading 2",
      raw: "Heading 2",
      tokens: [],
    };

    if (renderer.heading) {
      // @ts-expect-error: Using `call` to bind custom `this` context for renderer method
      const result = renderer.heading.call(renderer as RendererContext, token);
      const expected = `<h2 class="text-lg font-medium sm:text-xl my-4">Heading 2</h2>`;
      expect(result).toBe(expected);
    } else {
      throw new Error("renderer.heading is undefined");
    }
  });
});
