/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { marked } from "marked";

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
      return content.text || "";
    }
    if (content.type === "list" && content.items) {
      return content.items
        .map((item) => `<li>${stringifyContent(item)}</li>`)
        .join("");
    }
    return content.text || JSON.stringify(content);
  }
  return String(content);
};

const renderer = {
  heading(text: string, level: number): string {
    const className =
      level === 1
        ? "text-left font-medium text-2xl sm:text-3xl mb-4"
        : "text-lg font-medium sm:text-xl my-4";
    return `<h${level} class="${className}">${stringifyContent(text)}</h${level}>`;
  },

  paragraph(text: string): string {
    const parsedText = marked.parseInline(stringifyContent(text));
    return `<p class="mb-4">${parsedText}</p>`;
  },

  list(body: string, ordered: boolean): string {
    const tag = ordered ? "ol" : "ul";
    return `<${tag} class="list-inside list-disc mb-4">${stringifyContent(body)}</${tag}>`;
  },

  listitem(text: string): string {
    return `<li class="mb-2">${marked.parseInline(stringifyContent(text))}</li>`;
  },

  link(href: string | null, title: string | null, text: string): string {
    const linkHref = href || "";
    return `<a href="${linkHref}" class="text-info hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
  },
};

export default renderer;
