// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export const decodeXmlEntities = (value: string): string =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

export const normalizeXmlText = (value: string): string =>
  decodeXmlEntities(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"))
    .replace(/\s+/g, " ")
    .trim();

export const findFirstTagValue = (
  block: string,
  tagNames: string[]
): string => {
  for (const tagName of tagNames) {
    const regex = new RegExp(
      `<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
      "i"
    );
    const match = block.match(regex);
    if (match && match[1]) {
      return normalizeXmlText(match[1]);
    }
  }

  return "";
};

export const extractDatasetBlocks = (xmlText: string): string[] =>
  xmlText.match(/<dcat:Dataset\b[\s\S]*?<\/dcat:Dataset>/gi) || [];
