// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import type * as RDF from "@rdfjs/types";

export class RdfGraph {
  private readonly quadsBySubject = new Map<string, RDF.Quad[]>();
  readonly baseIRI: string | undefined;

  constructor(quads: RDF.Quad[], baseIRI?: string) {
    this.baseIRI = baseIRI;
    for (const quad of quads) {
      const subjectKey = this.getSubjectKey(quad.subject);
      const subjectQuads = this.quadsBySubject.get(subjectKey) ?? [];
      subjectQuads.push(quad);
      this.quadsBySubject.set(subjectKey, subjectQuads);
    }
  }

  getSubjectsOfType(typeIri: string): RDF.Term[] {
    const subjects = new Map<string, RDF.Term>();

    for (const [subjectKey, quads] of this.quadsBySubject.entries()) {
      if (
        quads.some(
          (quad) =>
            quad.predicate.value === RDF_TYPE &&
            quad.object.termType === "NamedNode" &&
            quad.object.value === typeIri
        )
      ) {
        subjects.set(subjectKey, quads[0].subject);
      }
    }

    return Array.from(subjects.values());
  }

  getLiteral(subject: RDF.Term, predicate: string): string {
    const quad = this.getQuads(subject).find(
      (candidate) => candidate.predicate.value === predicate
    );

    return quad?.object.termType === "Literal" ? quad.object.value.trim() : "";
  }

  getFirstLiteral(subject: RDF.Term, predicates: string[]): string {
    for (const predicate of predicates) {
      const value = this.getLiteral(subject, predicate);
      if (value) {
        return value;
      }
    }

    return "";
  }

  getObjects(subject: RDF.Term, predicate: string): RDF.Term[] {
    return this.getQuads(subject)
      .filter((quad) => quad.predicate.value === predicate)
      .map((quad) => quad.object);
  }

  getObjectValues(subject: RDF.Term, predicate: string): string[] {
    const values = new Set<string>();

    for (const object of this.getObjects(subject, predicate)) {
      const value = object.value.trim();
      if (value) {
        values.add(value);
      }
    }

    return Array.from(values);
  }

  getNamedNodeValue(subject: RDF.Term): string {
    return subject.termType === "NamedNode" ? subject.value.trim() : "";
  }

  private getSubjectKey(subject: RDF.Term): string {
    return `${subject.termType}:${subject.value}`;
  }

  private getQuads(subject: RDF.Term): RDF.Quad[] {
    return this.quadsBySubject.get(this.getSubjectKey(subject)) ?? [];
  }
}

const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
