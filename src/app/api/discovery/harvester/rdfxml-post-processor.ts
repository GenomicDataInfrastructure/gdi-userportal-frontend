// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Post-processing helpers for rdflib's RDF/XML serialization.
 *
 * rdflib always serializes named-node objects as the shorthand attribute form:
 *   <predicate rdf:resource="URI"/>
 *
 * Several HealthDCAT-AP predicates require a *typed nested element* instead.
 * These functions rewrite the serialized XML string into the required shape.
 */

/**
 * Rewrites `hasCodingSystem` shorthand references into typed nested elements:
 *
 *   Before: <healthdcatap:hasCodingSystem rdf:resource="URI"/>
 *   After:  <healthdcatap:hasCodingSystem>
 *             <dct:Standard rdf:about="URI"/>
 *           </healthdcatap:hasCodingSystem>
 */
export const rewriteCodingSystemNodes = (xml: string): string =>
  xml.replace(
    /<healthdcatap:hasCodingSystem rdf:resource="([^"]+)"\/>/g,
    (_, uri) =>
      `<healthdcatap:hasCodingSystem>\n      <dct:Standard rdf:about="${uri}"/>\n    </healthdcatap:hasCodingSystem>`
  );

/**
 * Rewrites `foaf:page` shorthand references into typed nested elements:
 *
 *   Before: <foaf:page rdf:resource="URI"/>
 *   After:  <foaf:page>
 *             <foaf:Document rdf:about="URI"/>
 *           </foaf:page>
 */
export const rewriteDocumentationNodes = (xml: string): string =>
  xml.replace(
    /<foaf:page rdf:resource="([^"]+)"\/>/g,
    (_, uri) =>
      `<foaf:page>\n      <foaf:Document rdf:about="${uri}"/>\n    </foaf:page>`
  );

/**
 * Rewrites `dct:accessRights` shorthand references into fully nested
 * `dct:RightsStatement` elements with an inline `skos:prefLabel`.
 *
 * rdflib emits two separate fragments:
 *   1. <dct:accessRights rdf:resource="URI"/>   ← inside the dataset block
 *   2. <dct:RightsStatement rdf:about="URI">    ← top-level detached block
 *        <skos:prefLabel xml:lang="eng">…</skos:prefLabel>
 *      </dct:RightsStatement>
 *
 * This function:
 *   1. Collects labels from all detached `<dct:RightsStatement>` blocks and
 *      removes them from the document.
 *   2. Replaces each `rdf:resource` shorthand with the nested inline form:
 *
 *   After:  <dct:accessRights>
 *             <dct:RightsStatement rdf:about="URI">
 *               <skos:prefLabel xml:lang="eng">Non public</skos:prefLabel>
 *             </dct:RightsStatement>
 *           </dct:accessRights>
 */
export const rewriteAccessRightsNodes = (xml: string): string => {
  const labelByUri = new Map<string, string>();

  // Pass 1 – harvest labels from detached blocks and remove those blocks.
  const stripped = xml.replace(
    /<dct:RightsStatement rdf:about="([^"]+)">([\s\S]*?)<\/dct:RightsStatement>/g,
    (_match, uri: string, inner: string) => {
      const labelMatch = inner.match(
        /<skos:prefLabel[^>]*>([^<]*)<\/skos:prefLabel>/
      );
      if (labelMatch) labelByUri.set(uri, labelMatch[1]);
      return "";
    }
  );

  // Pass 2 – replace the shorthand with the fully inlined nested element.
  return stripped.replace(
    /<dct:accessRights rdf:resource="([^"]+)"\/>/g,
    (_match, uri: string) => {
      const label = labelByUri.get(uri);
      const labelXml = label
        ? `\n        <skos:prefLabel xml:lang="eng">${label}</skos:prefLabel>\n      `
        : "";
      return (
        `<dct:accessRights>\n` +
        `      <dct:RightsStatement rdf:about="${uri}">${labelXml}</dct:RightsStatement>\n` +
        `    </dct:accessRights>`
      );
    }
  );
};

/**
 * Applies all RDF/XML post-processing rewrites in the correct order.
 */
export const applyRdfXmlPostProcessing = (xml: string): string =>
  rewriteAccessRightsNodes(
    rewriteDocumentationNodes(rewriteCodingSystemNodes(xml))
  );
