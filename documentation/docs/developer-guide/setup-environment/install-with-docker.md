---
title: Install with Docker
sidebar_position: 2
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI
SPDX-FileContributor: PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Install with Docker

Install Docker to set up a complete containerised development environment for the GDI User Portal.

## Quick start

Run the docker-compose file to provide a running instance of the application:

```bash
docker compose up
```

Or depending on your Docker Compose version:

```bash
docker-compose up
```

## Discovery adapter configuration

You can switch the server-side discovery adapter via environment variables in `.env.local`:

- `DISCOVERY_PROVIDER=dds` uses the current DDS backend behaviour
- `DISCOVERY_PROVIDER=local-index` uses the local index adapter

## Elasticsearch setup (optional)

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

### Run Elasticsearch container

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

### OIDC-protected DCAT URLs

If the DCAT URL requires OIDC client-credentials, set:

```bash
HARVEST_OIDC_TOKEN_URL=<oidc-token-endpoint>
HARVEST_OIDC_CLIENT_ID=<client-id>
HARVEST_OIDC_CLIENT_SECRET=<client-secret>
```

## Container management

View running containers:
```bash
docker compose ps
```

Stop containers:
```bash
docker compose down
```

View container logs:
```bash
docker compose logs -f <service-name>
```

Rebuild containers: After making changes to Dockerfiles or dependencies

```bash
docker compose build
docker compose up
```

## Next steps

- [Configure authentication](./configure-authentication.md) - Set up Keycloak and LS-AAI
- [Install locally](./install-locally.md) - Alternative local development setup
- [Troubleshooting setup](./troubleshooting-setup.md) - Resolve common issues
