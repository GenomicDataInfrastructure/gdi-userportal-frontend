/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

import { Renderer, marked } from "marked";

const renderer = new Renderer();

const stringifyContent = (content: any): string => {
  if (typeof content === "object" && content !== null) {
    if (content.type === "text") {
      return content.text || "";
    }
    if (content.type === "list") {
      return content.items
        .map((item: any) => `<li>${stringifyContent(item)}</li>`)
        .join("");
    }
    if (Array.isArray(content)) {
      return content.map(stringifyContent).join("");
    }
    return content.text || JSON.stringify(content);
  }
  return String(content);
};

renderer.heading = (text: any, level: number) => {
  const className =
    level === 1
      ? "text-left font-medium text-2xl sm:text-3xl mb-4"
      : "text-lg font-medium sm:text-xl my-4";
  return `<h${level} class="${className}">${stringifyContent(text)}</h${level}>`;
};

renderer.paragraph = (text: any) => {
  const parsedText = marked.parseInline(stringifyContent(text));
  return `<p class="mb-4">${parsedText}</p>`;
};

renderer.list = (body: any, ordered: boolean) => {
  const tag = ordered ? "ol" : "ul";
  return `<${tag} class="list-inside list-disc mb-4">${stringifyContent(body)}</${tag}>`;
};

renderer.listitem = (text: any) => {
  return `<li class="mb-2">${marked.parseInline(stringifyContent(text))}</li>`;
};

renderer.link = (hrefObj: any, title: any, text: any) => {
  const href = typeof hrefObj === "object" ? hrefObj.href : hrefObj;
  const linkText = text || (typeof hrefObj === "object" ? hrefObj.text : "");
  return `<a href="${href}" class="text-info hover:underline" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
};

export default renderer;
