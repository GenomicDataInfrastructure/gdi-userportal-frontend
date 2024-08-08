// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-FileContributor: Stichting Health-RI
//
// SPDX-License-Identifier: Apache-2.0

import { jest } from "@jest/globals";
import { makePortalStatistics } from "../public/portalStatistics";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("makePortalStatistics", () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
    mockedAxios.post.mockResolvedValue({
      data: {
        facetGroups: [
          {
            key: "ckan",
            facets: [
              {
                key: "organization",
                label: "organization",
                values: [
                  {
                    value: "org1",
                    label: "organization",
                  },
                ],
              },
              {
                key: "theme",
                label: "theme",
                values: [
                  {
                    value: "theme1",
                    label: "theme",
                  },
                  {
                    value: "theme2",
                    label: "theme",
                  },
                ],
              },
              {
                key: "tags",
                label: "tags",
                values: [
                  {
                    value: "tag1",
                    label: "tag",
                  },
                  {
                    value: "tag2",
                    label: "tag",
                  },
                  {
                    value: "tag2",
                    label: "tag",
                  },
                ],
              },
            ],
          },
          {
            key: "beacon",
            facets: [
              {
                label: "org-beacon",
                value: "orgb-1",
              },
            ],
          },
        ],
      },
    });
  });

  test("fetches and returns the correct counts for portal statistics", async () => {
    const DMS_URL = "http://localhost:5500";
    const getPortalStatistics = makePortalStatistics(DMS_URL);

    const portalStatistics = await getPortalStatistics();

    expect(portalStatistics).toEqual({
      organization: 1,
      themes: 2,
      keywords: 3,
    });

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
