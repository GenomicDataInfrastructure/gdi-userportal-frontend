// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { retrieveDatasetApi } from "@/app/api/discovery";
import { api } from "@/app/api/discovery/open-api/schemas";
import AxiosMockAdapter from "axios-mock-adapter";
import { discoveryAxiosInstance } from "@/app/api/shared/client";

const datasetSchema = api.api.find(
  (endpoint) => endpoint.alias === "retrieve_dataset"
)!.response;

describe("Retrieving a specific dataset", () => {
  const mockDiscoveryAdapter = new AxiosMockAdapter(discoveryAxiosInstance);

  beforeEach(() => {
    mockDiscoveryAdapter.reset();
  });

  test("Returns the specific dataset ", async () => {
    mockDiscoveryAdapter.onGet("/api/v1/datasets/99").reply(200, {
      id: "99",
      title: "Dataset 99",
      description: "This is dataset 99",
    });

    const response = await retrieveDatasetApi("99");

    expect(response).toBeDefined();
    expect(response.id).toEqual("99");
  });

  test("accepts legacy string help text returned by the live discovery API", async () => {
    mockDiscoveryAdapter.onGet("/api/v1/datasets/legacy-help-text").reply(200, {
      id: "legacy-help-text",
      title: "Dataset with legacy help text",
      description: "This is dataset legacy-help-text",
      helpText: {
        title: "A descriptive title for the dataset.",
      },
    });

    await expect(retrieveDatasetApi("legacy-help-text")).resolves.toMatchObject(
      {
        id: "legacy-help-text",
        helpText: {
          title: "A descriptive title for the dataset.",
        },
      }
    );
  });

  test.each([
    {},
    { id: "service-1" },
    { description: "Beacon service description" },
    { id: "service-1", description: "Beacon service description" },
  ])(
    "preserves access service metadata with optional fields %j",
    async (fields) => {
      const service = {
        title: "GoE BG Beacon",
        endpoint_url: ["https://beacon-af-staging.mmcbg.org/api/info"],
        ...fields,
      };
      mockDiscoveryAdapter
        .onGet("/api/v1/datasets/optional-service-fields")
        .reply(200, {
          id: "optional-service-fields",
          title: "Dataset with optional service fields",
          description: "Dataset description",
          distributions: [
            {
              id: "distribution-1",
              title: "Distribution title",
              description: "Distribution description",
              accessService: [service],
            },
          ],
        });

      const response = await retrieveDatasetApi("optional-service-fields");

      expect(datasetSchema.safeParse(response).success).toBe(true);
      expect(response.distributions?.[0]?.accessService?.[0]).toEqual(service);
    }
  );

  test.each(["dataset", "distribution", "service"])(
    "still rejects a missing required %s title",
    async (level) => {
      const dataset = {
        id: "required-fields",
        description: "Dataset description",
        ...(level !== "dataset" && { title: "Dataset title" }),
        distributions: [
          {
            id: "distribution-1",
            description: "Distribution description",
            ...(level !== "distribution" && { title: "Distribution title" }),
            accessService: [
              {
                id: "service-1",
                description: "Service description",
                ...(level !== "service" && { title: "Service title" }),
              },
            ],
          },
        ],
      };
      mockDiscoveryAdapter
        .onGet("/api/v1/datasets/required-fields")
        .reply(200, dataset);

      const response = await retrieveDatasetApi("required-fields");
      expect(datasetSchema.safeParse(response).success).toBe(false);
    }
  );

  test("accepts null data service fields returned by discovery backend", async () => {
    mockDiscoveryAdapter.onGet("/api/v1/datasets/100").reply(200, {
      id: "100",
      title: "Dataset 100",
      description: "This is dataset 100",
      distributions: [
        {
          description: "Distribution description",
          title: "Distribution title",
          id: "distribution-1",
          accessService: [
            {
              description: null,
              id: null,
              title: "",
              endpoint_url: [],
            },
          ],
        },
      ],
    });

    const response = await retrieveDatasetApi("100");

    expect(response.distributions?.[0]?.accessService?.[0]).toMatchObject({
      description: null,
      id: null,
    });
  });

  test("accepts value-label compression and packaging formats", async () => {
    mockDiscoveryAdapter.onGet("/api/v1/datasets/101").reply(200, {
      id: "101",
      title: "Dataset 101",
      description: "This is dataset 101",
      distributions: [
        {
          description: "Distribution description",
          title: "Distribution title",
          id: "distribution-1",
          compressionFormat: {
            value: "gzip",
            label: "gzip",
          },
          packagingFormat: {
            value: "tar",
            label: "TAR archive",
          },
        },
      ],
    });

    const response = await retrieveDatasetApi("101");

    expect(response.distributions?.[0]?.compressionFormat).toEqual({
      value: "gzip",
      label: "gzip",
    });
    expect(response.distributions?.[0]?.packagingFormat).toEqual({
      value: "tar",
      label: "TAR archive",
    });
  });

  test("accepts every DDS distribution license representation", async () => {
    mockDiscoveryAdapter.onGet("/api/v1/datasets/102").reply(200, {
      id: "102",
      title: "Dataset 102",
      description: "This is dataset 102",
      distributions: [
        {
          id: "distribution-value-label",
          title: "Value label license",
          description: "Distribution description",
          license: { value: "CC-BY-4.0", label: "CC BY 4.0" },
        },
        {
          id: "distribution-string",
          title: "String license",
          description: "Distribution description",
          license: "CC-BY-4.0",
        },
        {
          id: "distribution-array",
          title: "Array license",
          description: "Distribution description",
          license: ["CC-BY-4.0", { value: "CC0-1.0", label: "CC0 1.0" }],
        },
        {
          id: "distribution-null",
          title: "Null license",
          description: "Distribution description",
          license: null,
        },
      ],
    });

    const response = await retrieveDatasetApi("102");

    expect(
      response.distributions?.map((distribution) => distribution.license)
    ).toEqual([
      { value: "CC-BY-4.0", label: "CC BY 4.0" },
      "CC-BY-4.0",
      ["CC-BY-4.0", { value: "CC0-1.0", label: "CC0 1.0" }],
      null,
    ]);
  });
});
