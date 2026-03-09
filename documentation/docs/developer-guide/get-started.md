---
title: Get started
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI
SPDX-FileContributor: PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Get started with development

Follow these quick setup instructions to begin developing with the GDI User Portal.

## Prerequisites

Before beginning, ensure you have:

- **Node.js and npm** installed
- **Docker** (for containerised development)
- **Git** for version control
- Basic understanding of Next.js (for frontend development)

## Quick setup options

Choose the setup option that best suits your development needs:

### Option 1: Local Development

For active frontend development with hot-reloading:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env.local` file in the root directory and copy the content of `.env.local.example` into the new file. Modify the environment variables as needed.

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000/`. The application will automatically reload when you change source files.

### Option 2: Docker Development

For a complete containerised instance:

```bash
docker compose up
```

Or depending on your Docker Compose version:

```bash
docker-compose up
```

## Discovery adapter setup (development)

You can switch the server-side discovery adapter via environment variables in `.env.local`:

- `DISCOVERY_PROVIDER=dds` uses the current DDS backend behaviour
- `DISCOVERY_PROVIDER=local-index` uses the local index adapter

### Using Local Index with Elasticsearch

If you choose the local index adapter with Elasticsearch, configure:

```bash
DISCOVERY_PROVIDER=local-index
LOCAL_DISCOVERY_STORE=elasticsearch
ELASTICSEARCH_URL=https://localhost:9200
ELASTICSEARCH_DISCOVERY_INDEX=discovery_datasets
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=<your-password>
ELASTICSEARCH_TLS_INSECURE=true
```

**Run Elasticsearch locally:**

```bash
docker network create elastic
docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:9.3.1
```

Then start the dev server:

```bash
npm run dev
```

## DCAT harvest from CLI

To trigger a DCAT harvest from command line:

```bash
npm run harvest:dcat -- --url https://letzdata.public.lu/content/dam/dga/ctie/c/catalogue.rdf
```

**For OIDC-protected DCAT URLs**, set:

```bash
HARVEST_OIDC_TOKEN_URL=<oidc-token-endpoint>
HARVEST_OIDC_CLIENT_ID=<client-id>
HARVEST_OIDC_CLIENT_SECRET=<client-secret>
```

## Working with OpenAPI specifications

When OpenAPI specifications change, upgrade the client and schemas:

```bash
npm run prebuild:service
```

Replace `service` with either `discovery` or `access-management`. The schemas will be automatically generated in `src/app/api/{service}/open-api/schemas.ts`.

**Note**: You must manually export all the types defined in `schemas.ts` (this cannot be done automatically).

## Build for production

To build the project:

```bash
npm run build
```

Build artefacts will be stored in the `.next/` directory.

## Running tests

### End-to-End Tests (Playwright)

Playwright E2E tests support two modes:

**Mocked mode** (recommended for local dev and PRs): uses a local mock API server.
```bash
E2E_MODE=mocked npx playwright test
```
Optional: set `MOCK_API_PORT` to change the mock server port (default: 4010).

**Real backend mode** (release pipeline): uses `.env.e2e.test` and hits DEV services.
```bash
E2E_MODE=real npx playwright test
```

**First time setup**: Install Playwright browsers:
```bash
npx playwright install --with-deps
```

## Next steps by role

### Frontend Developers
- Review the [customisation guide](../customize-platform/customize-frontend-theming.md)
- Explore the component structure in `src/components/`

### Backend Developers
- [Set up local CKAN development](../setup-environment/install-locally.md)
- Review the [DDS](https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service) and [AMS](https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service) repositories

### Extension Developers
- [Set up CKAN extension development](../develop-extensions/setup-local-development.md)
- [Understand CKAN schemas](../develop-extensions/understand-ckan-schemas.md)

### Platform Operators
- Review [deployment options](../deploy-production/index.md)
- Configure [authentication](../setup-environment/configure-authentication.md)

## Getting help

- **Next.js Documentation**: [Next JS API Reference](https://nextjs.org/docs/pages/api-reference)
- **CKAN Resources**: [CKAN documentation and community links](../develop-extensions/ckan-resources.md)
- **Component Repositories**: [View all GDI repositories](../reference/component-repositories.md)
