---
title: Install locally
sidebar_position: 1
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Install components locally

Install GDI User Portal components directly on your local machine for development purposes.

## User Portal Frontend

The User Portal Frontend, built with **Next.js**, provides a web interface for interacting with key services, including the **Dataset Discovery Service (DDS)** and the **Access Management Service (AMS)**.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the environment: Create a `.env.local` file in the root directory and copy the content of `.env.local.example` into the new file. Modify the environment variables as needed.

3. Run the development server:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000/`. The application will automatically reload when you change source files.

**Full installation guide**: [User Portal Frontend README](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend?tab=readme-ov-file#gdi-user-portal-front-end)

## Dataset Discovery Service (DDS)

The **Dataset Discovery Service** acts as a backend layer mediating requests from the frontend to CKAN's data catalogue APIs. It retrieves, processes, and maps dataset information while abstracting CKAN-specific logic.

To use DDS, ensure that the **GDI CKAN extension** is installed in your CKAN instance.

**Installation guide**: [Dataset Discovery Service README](https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service?tab=readme-ov-file#gdi-user-portal---dataset-discovery-service)

## Access Management Service (AMS)

The **Access Management Service** ensures secure interactions between the frontend and backend data authorities. It provides APIs for managing user access requests and integrates with external APIs like REMS to enforce policies and track user actions.

**Installation guide**: [Access Management Service README](https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service?tab=readme-ov-file#gdi-user-portal---access-management-service)

## CKAN Extensions

**CKAN** is an open-source data management system for publishing, sharing, and discovering datasets. The User Portal uses several extensions:

- **[GDI Userportal Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal)**: Adds a DCAT-AP 3 compatible schema with fields such as `issued`, `modified`, `has_version`, and `temporal_start`. Provides enhanced parsing for creators in the DCAT profile, adds support for OpenID Connect with PKCE, and offers endpoints for listing unique values.

- **[Fair Datapoint Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-fairdatapoint)**: Provides features related to FAIR principles to enhance dataset accessibility and interoperability.

- **[Harvest Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-harvest)**: Supports automated data harvesting and integration with external data sources.

### Local CKAN Extension Development

To contribute to a CKAN extension and run it on your local machine, it must be integrated into the Docker build that will run as your backend service, connected to your DDS instance.

**Installation guide**: [Installing new extensions](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker?tab=readme-ov-file#5-installing-new-extensions) from the [CKAN Docker repository](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker)

For comprehensive CKAN extension development setup, see [Set up local development](../develop-extensions/setup-local-development.md).

## Next steps

- [Configure authentication](./configure-authentication.md): Set up Keycloak and LS-AAI
- [Install with Docker](./install-with-docker.md): Alternative containerised setup
- [Troubleshooting setup](./troubleshooting-setup.md): Resolve common installation issues
