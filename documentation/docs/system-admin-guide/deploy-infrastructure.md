---
slug: /system-admin-guide/deploy-infrastructure
sidebar_label: "Deploy infrastructure"
sidebar_position: 3
---

# Deploy infrastructure

Deploy the GDI User Portal on your chosen infrastructure. This guide covers deployment options, containerisation, and environment management for production-ready systems.

## Deployment options

Choose a deployment approach that aligns with your infrastructure requirements and organisational policies.

- **Deploy to ELIXIR-LU:** Specific instructions for deploying to ELIXIR Luxembourg infrastructure, tailored for genomic data infrastructure requirements.

- **Configure Docker containers:** All components run as Docker containers. Learn about container orchestration, networking, and persistent storage configuration.

- **Manage environments:** Best practices for managing multiple environments (development, staging, production) and environment-specific configuration.

## Component installation

- **User Portal Frontend:** The frontend provides the web interface and integrates with backend services. Built with Next.js for optimal performance and user experience. Installation guide: [User Portal Frontend README](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend?tab=readme-ov-file#gdi-user-portal-front-end)<sup>↗</sup>

- **Dataset Discovery Service (DDS):** Backend service that mediates between the frontend and CKAN, providing abstraction and enhanced functionality. To use DDS, ensure that the GDI CKAN extension is installed in your CKAN instance. Installation guide: [Dataset Discovery Service README](https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service?tab=readme-ov-file#gdi-user-portal---dataset-discovery-service)<sup>↗</sup>

- **Access Management Service (AMS):** Handles access requests, user permissions, and integration with external systems like REMS. Installation guide: [Access Management Service README](https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service?tab=readme-ov-file#gdi-user-portal---access-management-service)<sup>↗</sup>

- **CKAN Extensions:** The platform uses several custom CKAN extensions that must be properly integrated:
  - **[GDI Userportal Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal)** - Adds a DCAT-AP 3 compatible schema with HealthDCAT support and fields such as `issued`, `modified`, `has_version`, and `temporal_start`. It also provides enhanced parsing for creators in the DCAT profile, adds support for OpenID Connect with PKCE, introduces new fields to `scheming_package_show`, and links CKAN harvest views for admin users. Additionally, it offers endpoints for listing unique values and simplifies integration with CKAN-based datasets for the User Portal.
  - **[DCAT Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-dcat)** - Responsible for mapping DCAT-AP 3 and HealthDCAT to CKAN
  - **[Fair Datapoint Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-fairdatapoint)** - FAIR principles support
  - **[Harvest Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-harvest)** - Data harvesting capabilities

    <br/>

  :::tip CKAN extension integration

  To contribute to a CKAN extension and run it on your local machine, integrate it into the Docker build that will run as your backend service, connected to your DDS instance. For a detailed guide on how to integrate the extension, see [Installing new extensions](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker?tab=readme-ov-file#5-installing-new-extensions) in the [CKAN Docker repository](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker).

  :::
