---
title: Component repositories
sidebar_position: 2
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Component repositories

Explore all component repositories and access their installation guides.

## Core components

### User Portal Frontend

The User Portal Frontend, built with Next.js, provides a web interface for interacting with key services, including the Dataset Discovery Service (DDS) and the Access Management Service (AMS). It acts as the primary user interface for the GDI project.

- **Repository**: [gdi-userportal-frontend](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend)
- **Installation Guide**: [README](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend?tab=readme-ov-file#gdi-user-portal-front-end)

### Dataset Discovery Service (DDS)

The Dataset Discovery Service acts as a backend layer mediating requests from the frontend to CKAN's data catalogue APIs. It retrieves, processes, and maps dataset information whilst abstracting CKAN-specific logic. To use DDS, ensure that the GDI CKAN extension is installed in your CKAN instance.

- **Repository**: [gdi-userportal-dataset-discovery-service](https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service)
- **Installation Guide**: [README](https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service?tab=readme-ov-file#gdi-user-portal---dataset-discovery-service)

### Access Management Service (AMS)

The Access Management Service ensures secure interactions between the frontend and backend data authorities. It provides APIs for managing user access requests and integrates with external APIs like REMS to enforce policies and track user actions.

- **Repository**: [gdi-userportal-access-management-service](https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service)
- **Installation Guide**: [README](https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service?tab=readme-ov-file#gdi-user-portal---access-management-service)

## CKAN extensions

CKAN is an open-source data management system for publishing, sharing, and discovering datasets. It enables cataloguing, searching, and accessing data through a web interface and API. Custom extensions can be developed to extend CKAN's core functionalities. The User Portal uses several extensions, including one specifically developed for this project.

### GDI Userportal Extension

Adds a DCAT-AP 3 compatible schema with fields such as `issued`, `modified`, `has_version`, and `temporal_start`. It also provides enhanced parsing for creators in the DCAT profile, adds support for OpenID Connect with PKCE, introduces new fields to `scheming_package_show`, and links CKAN harvest views for admin users. Additionally, it offers endpoints for listing unique values and simplifies integration with CKAN-based datasets for the User Portal.

- **Repository**: [gdi-userportal-ckanext-gdi-userportal](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal)

### Fair Datapoint Extension

Provides features related to FAIR principles to enhance dataset accessibility and interoperability.

- **Repository**: [gdi-userportal-ckanext-fairdatapoint](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-fairdatapoint)

### Harvest Extension

Supports automated data harvesting and integration with external data sources.

- **Repository**: [gdi-userportal-ckanext-harvest](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-harvest)

## CKAN Docker

In order to contribute on a CKAN extension and run it on your local machine, it must be integrated into the Docker build that will run as your backend service, connected to your DDS instance.

- **Repository**: [gdi-userportal-ckan-docker](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker)
- **Extension Integration Guide**: [Installing new extensions](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker?tab=readme-ov-file#5-installing-new-extensions)

## Deployment

### Deployment Repository

Contains deployment configurations and scripts for various environments.

- **Repository**: [gdi-userportal-deployment](https://github.com/GenomicDataInfrastructure/gdi-userportal-deployment)

## Next steps

- [CKAN API reference](./ckan-api-reference.md) - API documentation
- [External documentation](./external-documentation.md) - Additional resources
