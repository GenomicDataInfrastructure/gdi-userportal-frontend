// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { LocalDiscoveryDataset } from "@/app/api/discovery/local-store/types";
import { serializeDatasetStore } from "@/app/api/discovery/harvester/dcat-dataset-rdf-serializer";

/**
 * rdflib serializes named nodes used as objects of a predicate as
 * `<predicate rdf:resource="URI"/>`. The HealthDCAT-AP spec requires
 * `hasCodingSystem` to nest a typed `dct:Standard` element inline:
 *
 *   <healthdcatap:hasCodingSystem>
 *     <dct:Standard rdf:about="URI"/>
 *   </healthdcatap:hasCodingSystem>
 *
 * We post-process the serialized RDF/XML to rewrite the shorthand form
 * into the nested typed-node form.
 */
const rewriteCodingSystemNodes = (xml: string): string =>
  xml.replace(
    /<healthdcatap:hasCodingSystem rdf:resource="([^"]+)"\/>/g,
    (_, uri) =>
      `<healthdcatap:hasCodingSystem>\n      <dct:Standard rdf:about="${uri}"/>\n    </healthdcatap:hasCodingSystem>`
  );

const rewriteDocumentationNodes = (xml: string): string =>
  xml.replace(
    /<foaf:page rdf:resource="([^"]+)"\/>/g,
    (_, uri) =>
      `<foaf:page>\n      <foaf:Document rdf:about="${uri}"/>\n    </foaf:page>`
  );

const collapseEmptyFoafDocumentTags = (xml: string): string =>
  xml.replace(
    /<foaf:Document rdf:about="([^"]+)">\s*<\/foaf:Document>/g,
    (_, uri) => `<foaf:Document rdf:about="${uri}"/>`
  );

const removeTopLevelFoafDocumentNodes = (xml: string): string =>
  xml.replace(/\n?\s*<foaf:Document rdf:about="[^"]+"\/>(?!\s*<\/foaf:page>)/g, "");

export const serializeDatasetAsRdfXml = async (
  dataset: LocalDiscoveryDataset
): Promise<string> => {
  const xml = await serializeDatasetStore(dataset, "rdf");
  return removeTopLevelFoafDocumentNodes(
    rewriteDocumentationNodes(
      collapseEmptyFoafDocumentTags(rewriteCodingSystemNodes(xml))
    )
  );
};
