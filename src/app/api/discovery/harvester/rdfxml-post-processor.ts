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
 * Applies all RDF/XML post-processing rewrites in the correct order.
 */
export const applyRdfXmlPostProcessing = (xml: string): string =>
  rewriteDocumentationNodes(rewriteCodingSystemNodes(xml));
