// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import axios from "axios";
import { makeFilterList } from "../filterList";
import { filterFixtures } from "../fixtures/facetFixtures";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const filterList = makeFilterList("https://mock-discovery-service.com");

describe("filterList", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(filterFixtures);
  });

  afterEach(() => {
    mockedAxios.post.mockClear();
  });

  test("maps and asserts the full server response", async () => {
    const response = await filterList(null);

    expect(response.data.length).toEqual(3);

    const ckanFilter = response.data[0];
    expect(ckanFilter.source).toEqual("ckan");
    expect(ckanFilter.type).toEqual("DROPDOWN");
    expect(ckanFilter.key).toEqual("access_rights");
    expect(ckanFilter.label).toEqual("Access Rights");
    expect(ckanFilter.values!.length).toEqual(2);
    expect(ckanFilter.values![0].value).toEqual(
      "https://staging-fdp.gdi.nbis.se/dataset/87495812-3201-4099-9478-1c60c9ef8c85#accessRights"
    );
    expect(ckanFilter.values![0].label).toEqual(
      "https://staging-fdp.gdi.nbis.se/dataset/87495812-3201-4099-9478-1c60c9ef8c85#accessRights"
    );

    const beaconFilter = response.data[2];
    expect(beaconFilter.source).toEqual("beacon");
    expect(beaconFilter.type).toEqual("DROPDOWN");
    expect(beaconFilter.key).toEqual("Human Phenotype Ontology");
    expect(beaconFilter.label).toEqual("Human Phenotype Ontology");
    expect(beaconFilter.values!.length).toEqual(1);
    expect(beaconFilter.values![0].value).toEqual("Motor delay");
    expect(beaconFilter.values![0].label).toEqual("Delay");
  });
});
