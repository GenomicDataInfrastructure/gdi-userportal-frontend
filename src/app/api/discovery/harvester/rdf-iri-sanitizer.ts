// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

// Some upstream catalogues emit IRIs that break RDF parsing outright:
//   - forbidden characters (RFC 3987), most often a literal space, e.g.
//       http://publications.europa.eu/resource/authority/distribution-status/UNDER DEVELOPMENT
//   - a mangled scheme that is neither a valid absolute IRI nor a valid
//     relative reference, e.g.  htttp//:documentaiondistribution.lu
// A single bad IRI makes the whole document unparseable and aborts the harvest.
// Repair the first kind by percent-encoding; replace the second kind with a
// traceable urn:x-invalid: placeholder so the rest of the catalogue still loads.

const FORBIDDEN_RE = /[ \t\r\n\f\\^`{|}"<>]/;
const FORBIDDEN_RE_G = /[ \t\r\n\f\\^`{|}"<>]/g;
const ABSOLUTE_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

const encodeForbidden = (iri: string): string =>
  iri.replace(FORBIDDEN_RE_G, (char) => encodeURIComponent(char));

// A relative reference (no colon) is fine; an absolute IRI must start with a
// real scheme. A colon that is not part of a scheme means the IRI is malformed.
const isResolvableIri = (value: string): boolean =>
  !value.includes(":") || ABSOLUTE_SCHEME_RE.test(value);

const repairIri = (raw: string): string => {
  const encoded = FORBIDDEN_RE.test(raw) ? encodeForbidden(raw) : raw;
  return isResolvableIri(encoded)
    ? encoded
    : `urn:x-invalid:${encodeURIComponent(raw)}`;
};

const isTurtleLike = (contentType: string): boolean =>
  /turtle|n3|n-triples|n-quads|trig/i.test(contentType);

/**
 * Make every IRI in an external RDF document parseable. No-op when the document
 * is already clean.
 */
export const sanitizeRdfIris = (rdf: string, contentType: string): string => {
  if (isTurtleLike(contentType)) {
    return rdf.replace(/<([^<>]*)>/g, (match, iri: string) => {
      const fixed = repairIri(iri);
      return fixed === iri ? match : `<${fixed}>`;
    });
  }

  // RDF/XML and other XML serialisations: IRIs live in these attributes.
  return rdf.replace(
    /\b(about|resource|datatype)=(["'])(.*?)\2/gi,
    (match, attr: string, quote: string, value: string) => {
      const fixed = repairIri(value);
      return fixed === value ? match : `${attr}=${quote}${fixed}${quote}`;
    }
  );
};
