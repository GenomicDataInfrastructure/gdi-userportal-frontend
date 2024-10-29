// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import axios from "axios";
import { makeFacetList } from "../filterList";
import { facetFixtures } from "../fixtures/facetFixtures";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const facetList = makeFacetList("https://mock-discovery-service.com");

describe("facetList", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(facetFixtures);
  });

  afterEach(() => {
    mockedAxios.post.mockClear();
  });

  test("maps and asserts the full server response", async () => {
    const response = await facetList(null);

    expect(response.data.length).toEqual(3);

    const ckanFacet = response.data[0];
    expect(ckanFacet.facetGroup).toEqual("ckan");
    expect(ckanFacet.key).toEqual("access_rights");
    expect(ckanFacet.label).toEqual("Access Rights");
    expect(ckanFacet.values.length).toEqual(2);
    expect(ckanFacet.values[0].value).toEqual(
      "https://staging-fdp.gdi.nbis.se/dataset/87495812-3201-4099-9478-1c60c9ef8c85#accessRights"
    );
    expect(ckanFacet.values[0].label).toEqual(
      "https://staging-fdp.gdi.nbis.se/dataset/87495812-3201-4099-9478-1c60c9ef8c85#accessRights"
    );

    const beaconFacet = response.data[2];
    expect(beaconFacet.facetGroup).toEqual("beacon");
    expect(beaconFacet.key).toEqual("Human Phenotype Ontology");
    expect(beaconFacet.label).toEqual("Human Phenotype Ontology");
    expect(beaconFacet.values.length).toEqual(1);
    expect(beaconFacet.values[0].value).toEqual("Motor delay");
    expect(beaconFacet.values[0].label).toEqual("Delay");
  });
});
