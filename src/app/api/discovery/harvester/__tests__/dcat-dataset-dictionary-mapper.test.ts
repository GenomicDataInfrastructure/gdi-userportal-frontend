// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import dataModel from "@rdfjs/data-model";
import { extractDataDictionary } from "@/app/api/discovery/harvester/dcat-dataset-dictionary-mapper";
import { RdfGraph } from "@/app/api/discovery/harvester/rdf-graph";

const namespace = (prefix: string) => (term: string) =>
  dataModel.namedNode(`${prefix}${term}`);
const rdf = namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const healthdcatap = namespace("http://healthdataportal.eu/ns/health#");
const csvw = namespace("http://www.w3.org/ns/csvw#");
const dct = namespace("http://purl.org/dc/terms/");

describe("extractDataDictionary", () => {
  test("extracts columns from a HealthDCAT-AP variables table group", () => {
    const dataset = dataModel.namedNode(
      "https://example.org/datasets/diabetes"
    );
    const tableGroup = dataModel.blankNode("table-group");
    const table = dataModel.blankNode("table");
    const column = dataModel.blankNode("column");
    const graph = new RdfGraph([
      dataModel.quad(dataset, healthdcatap("hasVariables"), tableGroup),
      dataModel.quad(tableGroup, rdf("type"), csvw("TableGroup")),
      dataModel.quad(tableGroup, csvw("table"), table),
      dataModel.quad(table, rdf("type"), csvw("Table")),
      dataModel.quad(table, csvw("column"), column),
      dataModel.quad(column, csvw("name"), dataModel.literal("Diabetes")),
      dataModel.quad(column, csvw("datatype"), dataModel.literal("string")),
      dataModel.quad(
        column,
        dct("description"),
        dataModel.literal(
          "This tells you if person has high sugar level or not",
          "en"
        )
      ),
      dataModel.quad(column, csvw("required"), dataModel.literal("false")),
      dataModel.quad(column, csvw("unit"), dataModel.literal("kg")),
    ]);

    expect(extractDataDictionary(dataset, graph)).toEqual([
      {
        name: "Diabetes",
        type: "string",
        description: "This tells you if person has high sugar level or not",
      },
    ]);
  });
});
