// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { readFile } from "node:fs/promises";
import path from "node:path";
import type * as RDF from "@rdfjs/types";
import rdfDataModel from "@rdfjs/data-model";
import DatasetFactory from "@rdfjs/dataset";
import { ShaclTermPointer, Validator } from "shacl-engine";
import { parseRdfToQuads } from "@/app/api/discovery/harvester/rdf-quad-loader";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

export type ShaclViolation = {
  subjectId?: string;
  datasetTitle?: string;
  field?: string;
  message: string;
};

const SHAPES_FILE_PATH = path.join(
  process.cwd(),
  "src/app/api/discovery/harvester/shacl/healthdcat-ap.shapes.ttl"
);

const DCT_TITLE = "http://purl.org/dc/terms/title"; // NOSONAR
const DC_TITLE = "http://purl.org/dc/elements/1.1/title"; // NOSONAR
const DCAT_DATASET = "http://www.w3.org/ns/dcat#Dataset";

let cachedValidator: Validator | null = null;

const loadValidator = async (): Promise<Validator> => {
  if (cachedValidator) return cachedValidator;

  const shapesText = await readFile(SHAPES_FILE_PATH, "utf8");
  const shapesQuads = await parseRdfToQuads(shapesText, "text/turtle");
  const shapesDataset = DatasetFactory.dataset(shapesQuads);

  cachedValidator = new Validator(shapesDataset, { factory: rdfDataModel });
  return cachedValidator;
};

const extractSubjectId = (
  focusNode: ShaclTermPointer | undefined
): string | undefined =>
  focusNode?.term?.termType === "NamedNode" ? focusNode.term.value : undefined;

const extractPathUri = (result: {
  path?: { predicates?: RDF.Term[] }[];
}): string | undefined => result.path?.[0]?.predicates?.[0]?.value;

// Turns an RDF property URI into a readable field name, e.g.
// ".../health#minTypicalAge" -> "min typical age", ".../dc/terms/type" -> "type".
const toFieldLabel = (propertyUri: string): string => {
  const localName = propertyUri.split(/[#/]/).pop() ?? propertyUri;
  return localName.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
};

const extractMessage = (result: {
  message?: { value: string }[];
  constraintComponent?: RDF.Term;
}): string => {
  if (result.message?.length) {
    return result.message.map((m) => m.value).join("; ");
  }
  return result.constraintComponent
    ? `Failed constraint: ${result.constraintComponent.value.split("#").pop()}`
    : "SHACL validation failed";
};

export const validateHealthDcatAp = async (
  quads: RDF.Quad[]
): Promise<ShaclViolation[]> => {
  const validator = await loadValidator();
  const dataDataset = DatasetFactory.dataset(quads);
  const graph = new RdfGraph(quads);

  const titleBySubject = new Map<string, string>();
  for (const datasetSubject of graph.getSubjectsOfType(DCAT_DATASET)) {
    const title = graph.getFirstLiteral(datasetSubject, [DCT_TITLE, DC_TITLE]);
    if (title) {
      titleBySubject.set(datasetSubject.value, title);
    }
  }

  const report = await validator.validate({ dataset: dataDataset });

  return report.results.map((result) => {
    const subjectId = extractSubjectId(result.focusNode);
    const pathUri = extractPathUri(result);

    return {
      subjectId,
      datasetTitle: subjectId ? titleBySubject.get(subjectId) : undefined,
      field: pathUri ? toFieldLabel(pathUri) : undefined,
      message: extractMessage(result),
    };
  });
};
