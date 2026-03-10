<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI
SPDX-FileContributor: PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

[![REUSE status](https://api.reuse.software/badge/github.com/GenomicDataInfrastructure/gdi-userportal-frontend)](https://api.reuse.software/info/github.com/GenomicDataInfrastructure/gdi-userportal-frontend)
![example workflow](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/actions/workflows/main.yml/badge.svg)
![example workflow](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/actions/workflows/test.yml/badge.svg)
![example workflow](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/actions/workflows/release.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=GenomicDataInfrastructure_gdi-userportal-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=GenomicDataInfrastructure_gdi-userportal-frontend)
[![GitHub contributors](https://img.shields.io/github/contributors/GenomicDataInfrastructure/gdi-userportal-frontend)](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/graphs/contributors)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

# GDI User Portal Front-end

The GDI User Portal Front-end is a crucial component of the Genomic Data Infrastructure (GDI) project, which aims to facilitate access to genomic, phenotypic, and clinical data across Europe. The GDI project is committed to establishing a federated, sustainable, and secure infrastructure to enable seamless data access. Leveraging the outcomes of the Beyond 1 Million Genomes (B1MG) project, the GDI project is actively realizing the ambitious goals set forth by the 1+Million Genomes (1+MG) initiative.

The GDI User Portal Front-end serves as the user-friendly interface for this initiative, utilizing [Angular CLI](https://github.com/angular/angular-cli) version 16.2.3. This frontend application plays a crucial role in enhancing user experience and ensuring efficient interaction with the genomic data infrastructure.

- **Status**: 1.0.0
- **Demo Link**: [Demo Website](https://catalogue-test.azurewebsites.net/)
- **Related Project**: [1+ Million Genomes Project](https://gdi.onemilliongenomes.eu/)

## Installation

### Locally

Before using the GDI User Portal Front-end, make sure you have the required dependencies installed. Follow the installation instructions below:

`npm install`

You also have to create a new `.env.local` file in the root directory, and copy the content of `.env.local.example` into the new file. Feel free to modify the environment variables as you wish.

### Using Docker

Alternatively, you can run the docker-compose file that provides a running instance of the application. Use the following command to run docker-compose:

`docker compose up` or `docker-compose up` depending on your docker compose version.

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The application will automatically reload if you change any of the source files.

## Discovery Adapter Setup (Development)

You can switch the server-side discovery adapter via environment variables in `.env.local`.

- `DISCOVERY_PROVIDER=dds` uses the current DDS backend behavior.
- `DISCOVERY_PROVIDER=local-index` uses the local index adapter.

If you choose the local index adapter with Elasticsearch, set:

```bash
DISCOVERY_PROVIDER=local-index
LOCAL_DISCOVERY_STORE=elasticsearch
ELASTICSEARCH_URL=https://localhost:9200
ELASTICSEARCH_DISCOVERY_INDEX=discovery_datasets
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=<your-password>
ELASTICSEARCH_TLS_INSECURE=true
```

To run Elasticsearch locally:

```bash
docker network create elastic
docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB -e "ELASTIC_PASSWORD=myStrongPassword123" docker.elastic.co/elasticsearch/elasticsearch:9.3.1
```

Then start the dev server:

```bash
npm run dev
```

To trigger a DCAT harvest from CLI:

```bash
npm run harvest:dcat -- --url https://letzdata.public.lu/content/dam/dga/ctie/c/catalogue.rdf
```

If the DCAT URL is protected by OIDC client-credentials, set:

```bash
HARVEST_OIDC_TOKEN_URL=<oidc-token-endpoint>
HARVEST_OIDC_CLIENT_ID=<client-id>
HARVEST_OIDC_CLIENT_SECRET=<client-secret>
```

## Modifying Open API Specifications

In case of changes in the OpenAPI specifications, you must upgrade the client and schemas by running `npm run prebuild:service` where service is either `discovery` or `access-management`. The schemas will be automatically generated in `src/app/api/{service}/open-api/schemas.ts`.

Additionally, you must export all the types defined in `schemas.ts` (can not be done automatically).

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `.next/` directory.

## Running unit tests

TODO

## Running end-to-end tests

Playwright E2E tests support two modes:

- Mocked mode (recommended for local dev and PRs): uses a local mock API server.
  - `E2E_MODE=mocked npx playwright test`
  - Optional: set `MOCK_API_PORT` to change the mock server port (default: 4010).
- Real backend mode (release pipeline): uses `.env.e2e.test` and hits DEV services.
  - `E2E_MODE=real npx playwright test`

If this is your first time running Playwright, install the browsers:

`npx playwright install --with-deps`

## Further help

To get more help on Next JS, go check out the [Next JS API Reference](https://nextjs.org/docs/pages/api-reference) page.

## Frontend Customization

For detailed information on how to customize the GDI User Portal Front-end, including environment variables and additional customization options, please refer to the [Frontend Customization Documentation](Frontend_customization.md).

## License

- All original source code is licensed under [Apache-2.0](./LICENSES/Apache-2.0.txt).
- All documentation is licensed under [CC-BY-4.0](./LICENSES/CC-BY-4.0.txt).
- All the fonts are licensed under [OFL-1.1](./LICENSES/OFL-1.1.txt).
- Some configuration and data files are licensed under [CC-BY-4.0](./LICENSES/CC-BY-4.0.txt).
- For more accurate information, check the individual files.
