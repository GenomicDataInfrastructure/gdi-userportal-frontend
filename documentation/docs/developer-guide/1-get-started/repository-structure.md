---
slug: /developer-guide/get-started/explore-repository-structure
sidebar_label: "Repository structure"
sidebar_position: 3
description: "Navigate the GDI codebase effectively" 
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Repository structure

The GDI platform uses a multi-repository structure hosted on GitHub under the `GenomicDataInfrastructure` organisation.

## Frontend repository

Next.js web application for the GDI User Portal.

| Repository name | Structure |
|----------------|-----------|
| `gdi-userportal-frontend` | - `/app`: Next.js 14 app directory structure<br/>- `/components`: Reusable React components<br/>- `/lib`: Utility functions and API clients<br/>- `/public`: Static assets (images, fonts, config files)<br/>- `/types`: TypeScript type definitions |

## Backend service repositories

Java/Quarkus microservices for dataset discovery service (DDS) and access management.

| Repository name | Structure |
|----------------|-----------|
| `gdi-userportal-dataset-discovery-service` | - `/src/main/java`: Java source code<br/>- `/src/main/resources`: Configuration files<br/>- `/src/test`: Unit and integration tests |
| `gdi-userportal-access-management-service` | - Structure mirrors that of DDS repository above|

## CKAN repositories

Data catalogue management with custom extensions and harvesters.

| Repository name | Structure |
|----------------|-----------|
| `gdi-userportal-ckan-docker` | - `/setup`: Startup scripts and configuration<br/>- `/Dockerfile`: Custom CKAN image build |
| `gdi-userportal-ckanext-gdi-userportal` | - DCAT-AP 3 schema implementation<br/>- OIDC with PKCE authentication support<br/>- Custom API endpoints for DDS integration |
| `gdi-userportal-ckanext-fairdatapoint` | - Harvests metadata from FAIR Data Point instances |
| `gdi-userportal-ckanext-harvest` | - Fork of official CKAN harvest extension with GDI customisations |

## Documentation repository

Docusaurus-based documentation site located within the frontend repository.

| Repository name | Structure |
|----------------|-----------|
| `gdi-userportal-frontend/documentation` | - `/docs/user-guide`: End-user documentation for portal usage<br/>- `/docs/catalogue-managers-guide`: Guide for dataset publishers and managers<br/>- `/docs/developer-guide`: Developer documentation (this guide)<br/>- `/docs/system-admin-guide`: System administration and deployment guide<br/>- `/src`: Docusaurus theme components and customizations<br/>- `/static`: Static assets for documentation site |

## Branching strategy

All repositories follow the same Git workflow:

- **`main`** branch: Production-ready code
- **`releases/v{major}.{minor}`**: Release branches for maintenance
- **`feature/*`**: Feature development branches
- **`bugfix/*`**: Bug fix branches
- **`hotfix/*`**: Critical production fixes

## Common tasks and repositories

| Task | Repository |
|------|------------|
| User interface changes | `gdi-userportal-frontend` |
| Dataset search logic | `gdi-userportal-dataset-discovery-service` |
| Access request workflows | `gdi-userportal-access-management-service` |
| Metadata schema changes | `gdi-userportal-ckanext-gdi-userportal` |
| Harvesting from FDP | `gdi-userportal-ckanext-fairdatapoint` |
| CKAN deployment config | `gdi-userportal-ckan-docker` |
| Documentation | `gdi-userportal-frontend/documentation` |


<br/>

**Ready to work with the codebase?** [Set up your environment](/developer-guide/set-up-your-environment) to configure your development workspace.
