/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { marked, Tokens, RendererObject } from "marked";

interface Content {
  type?: string;
  text?: string;
  items?: Content[];
}

const stringifyContent = (
  content: Content | Content[] | string | number | boolean
): string => {
  if (typeof content === "object" && content !== null) {
    if (Array.isArray(content)) {
      return content.map(stringifyContent).join("");
    }
    if (content.type === "text") {
      return content.text ?? "";
    }
    if (content.type === "list" && content.items) {
      return content.items
        .map((item) => `<li>${stringifyContent(item)}</li>`)
        .join("");
    }
    return content.text ?? JSON.stringify(content);
  }
  return String(content);
};

const renderer: RendererObject = {
  heading({ text, depth }: Tokens.Heading): string {
    const className =
      depth === 1
        ? "text-left font-medium text-2xl sm:text-3xl mb-4"
        : "text-lg font-medium sm:text-xl my-4";
    return `<h${depth} class="${className}">${stringifyContent(text)}</h${depth}>`;
  },

  paragraph({ text }: Tokens.Paragraph): string {
    const parsedText = marked.parseInline(stringifyContent(text));
    return `<p class="mb-4">${parsedText}</p>`;
  },

  list({ items, ordered }: Tokens.List): string {
    const tag = ordered ? "ol" : "ul";
    const body = items
      .map((item) => `<li>${stringifyContent(item.text || "")}</li>`)
      .join("");
    return `<${tag} class="list-inside list-disc mb-4">${body}</${tag}>`;
  },

  listitem({ text }: Tokens.ListItem): string {
    return `<li class="mb-2">${marked.parseInline(stringifyContent(text))}</li>`;
  },

  link({ href, text }: Tokens.Link): string {
    return `<a href="${href}" class="text-info hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
  },
};

export default renderer;
