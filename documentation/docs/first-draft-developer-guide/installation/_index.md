---
title: Installation
weight: 1
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->


The user portal consists of multiple components. To install or contribute to a specific component, refer to the respective installation guide linked below. All components run on Docker containers, and their individual setups are documented in their respective repositories.

## Components

### User Portal Frontend

The User Portal Frontend, built with Next.js, provides a web interface for interacting with key services, including the Dataset Discovery Service (DDS) and the Access Management Service (AMS). It acts as the primary user interface for the GDI project.

Installation guide: [User Portal Frontend README](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend?tab=readme-ov-file#gdi-user-portal-front-end)

### Dataset Discovery Service (DDS)

The Dataset Discovery Service acts as a backend layer mediating requests from the frontend to CKAN’s data catalog APIs. It retrieves, processes, and maps dataset information while abstracting CKAN-specific logic. To use DDS, ensure that the GDI CKAN extension is installed in your CKAN instance.

Installation guide: [Dataset Discovery Service README](https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service?tab=readme-ov-file#gdi-user-portal---dataset-discovery-service)

### Access Management Service (AMS)

The Access Management Service ensures secure interactions between the frontend and backend data authorities. It provides APIs for managing user access requests and integrates with external APIs like REMS to enforce policies and track user actions.

Installation guide: [Access Management Service README](https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service?tab=readme-ov-file#gdi-user-portal---access-management-service)

### CKAN Extensions

CKAN is an open-source data management system for publishing, sharing, and discovering datasets. It enables cataloging, searching, and accessing data through a web interface and API. Custom extensions can be developed to extend CKAN’s core functionalities. The User Portal uses several extensions, including one specifically developed for this project.

Extensions used include (but are not limited to):

- [GDI Userportal Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal): Adds a DCAT-AP 3 compatible schema with fields such as `issued`, `modified`, `has_version`, and `temporal_start`. It also provides enhanced parsing for creators in the DCAT profile, adds support for OpenID Connect with PKCE, introduces new fields to `scheming_package_show`, and links CKAN harvest views for admin users. Additionally, it offers endpoints for listing unique values and simplifies integration with CKAN-based datasets for the User Portal.

- [Fair Datapoint Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-fairdatapoint): Provides features related to FAIR principles to enhance dataset accessibility and interoperability.

- [Harvest Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-harvest): Supports automated data harvesting and integration with external data sources.

In order to contribute on a ckan extension and run it on you local machine, it must be integrated into the docker build that will run as your backend service, connected to your DDS instance. For a detailed guide on how to integrate the extention, read [5. installing new extensions](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker?tab=readme-ov-file#5-installing-new-extensions) from the [CKAN Docker repository](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker)
