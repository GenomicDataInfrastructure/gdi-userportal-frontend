// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  decodeXmlEntities,
  extractDatasetBlocks,
  findFirstTagValue,
  normalizeXmlText,
} from "@/app/api/discovery/harvester/dcat-harvester-utils";

describe("dcat-harvester-utils", () => {
  test("decodeXmlEntities decodes common XML entities", () => {
    expect(
      decodeXmlEntities(
        "&lt;a&gt;Tom &amp; Jerry &quot;x&quot; &#39;y&#39;&lt;/a&gt;"
      )
    ).toBe("<a>Tom & Jerry \"x\" 'y'</a>");
  });

  test("normalizeXmlText trims, collapses whitespace and unwraps CDATA", () => {
    const input = "  <![CDATA[  Foo   &amp;   Bar  ]]>  ";
    expect(normalizeXmlText(input)).toBe("Foo & Bar");
  });

  test("findFirstTagValue returns first matching tag value", () => {
    const block = `
      <dcat:Dataset>
        <dc:title>DC title</dc:title>
        <dct:title>DCT title</dct:title>
      </dcat:Dataset>
    `;

    expect(findFirstTagValue(block, ["dct:title", "dc:title"])).toBe(
      "DCT title"
    );
    expect(findFirstTagValue(block, ["dc:title", "dct:title"])).toBe(
      "DC title"
    );
  });

  test("findFirstTagValue returns empty string when tag is missing", () => {
    const block =
      "<dcat:Dataset><dct:identifier>x</dct:identifier></dcat:Dataset>";
    expect(findFirstTagValue(block, ["dct:title", "dc:title"])).toBe("");
  });

  test("extractDatasetBlocks extracts all dcat dataset blocks", () => {
    const xml = `
      <rdf:RDF xmlns:dcat="http://www.w3.org/ns/dcat#">
        <dcat:Dataset rdf:about="a"><dct:title>A</dct:title></dcat:Dataset>
        <dcat:Dataset rdf:about="b"><dct:title>B</dct:title></dcat:Dataset>
      </rdf:RDF>
    `;

    const blocks = extractDatasetBlocks(xml);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toContain('rdf:about="a"');
    expect(blocks[1]).toContain('rdf:about="b"');
  });

  test("extractDatasetBlocks returns empty list when no dataset exists", () => {
    const xml = "<rdf:RDF></rdf:RDF>";
    expect(extractDatasetBlocks(xml)).toEqual([]);
  });
});
