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

export const serializeDatasetAsRdfXml = async (
  dataset: LocalDiscoveryDataset
): Promise<string> => {
  const xml = await serializeDatasetStore(dataset, "rdf");
  return rewriteCodingSystemNodes(xml);
};
