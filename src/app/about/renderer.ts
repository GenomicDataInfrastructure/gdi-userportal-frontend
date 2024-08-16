/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { marked } from "marked";

interface Content {
  type?: string;
  text?: string;
  items?: Content[];
}

interface LinkObject {
  href: string;
  text?: string;
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

  link(
    hrefObj: string | LinkObject,
    title: string | null,
    text: string
  ): string {
    const href = typeof hrefObj === "object" ? hrefObj.href : hrefObj;
    const linkText = text || (typeof hrefObj === "object" ? hrefObj.text : "");
    return `<a href="${href}" class="text-info hover:underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  },
};

export default renderer;
