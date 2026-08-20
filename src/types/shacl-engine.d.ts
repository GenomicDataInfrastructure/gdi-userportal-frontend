// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

declare module "@rdfjs/data-model" {
  import type { DataFactory } from "@rdfjs/types";

  const factory: DataFactory;
  export default factory;
}

declare module "@rdfjs/dataset" {
  import type { DatasetCore, DatasetCoreFactory, Quad } from "@rdfjs/types";

  const factory: DatasetCoreFactory & {
    dataset: (quads?: Iterable<Quad>) => DatasetCore;
  };
  export default factory;
}

declare module "shacl-engine" {
  import type { DataFactory, DatasetCore, NamedNode, Term } from "@rdfjs/types";

  // shacl-engine reports focusNode/value as GraphPointer-like objects
  // (from grapoi/clownface), not plain RDF/JS terms — the actual term is
  // reachable via `.term`.
  export type ShaclTermPointer = {
    term: Term;
  };

  export type ShaclValidationResult = {
    focusNode?: ShaclTermPointer;
    path?: { predicates?: Term[] }[];
    message?: { value: string }[];
    severity?: NamedNode;
    constraintComponent?: NamedNode;
  };

  export type ShaclValidationReport = {
    conforms: boolean;
    results: ShaclValidationResult[];
  };

  export class Validator {
    constructor(shapes: DatasetCore, options: { factory: DataFactory });
    validate(data: { dataset: DatasetCore }): Promise<ShaclValidationReport>;
  }
}
