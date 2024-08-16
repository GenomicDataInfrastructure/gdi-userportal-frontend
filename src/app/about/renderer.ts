/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { Renderer, marked } from "marked";

const renderer = new Renderer();

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

renderer.heading = (text: string | Content, level: number) => {
  const className =
    level === 1
      ? "text-left font-medium text-2xl sm:text-3xl mb-4"
      : "text-lg font-medium sm:text-xl my-4";
  return `<h${level} class="${className}">${stringifyContent(text)}</h${level}>`;
};

renderer.paragraph = (text: string | Content) => {
  const parsedText = marked.parseInline(stringifyContent(text));
  return `<p class="mb-4">${parsedText}</p>`;
};

renderer.list = (body: string, ordered: boolean) => {
  const tag = ordered ? "ol" : "ul";
  return `<${tag} class="list-inside list-disc mb-4">${stringifyContent(body)}</${tag}>`;
};

renderer.listitem = (text: string | Content) => {
  return `<li class="mb-2">${marked.parseInline(stringifyContent(text))}</li>`;
};

interface LinkObject {
  href: string;
  text?: string;
}

renderer.link = (href: string | LinkObject, text: string) => {
  const linkHref = typeof href === "object" ? href.href : href;
  const linkText = text || (typeof href === "object" ? href.text : "");
  return `<a href="${linkHref}" class="text-info hover:underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
};

export default renderer;
