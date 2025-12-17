---
slug: /system-admin-guide/deploy-infrastructure
sidebar_label: "Deploy infrastructure"
sidebar_position: 3
---

# Deploy infrastructure

:::info content in progress

We are working on this guide.

:::

The GDI User Portal consists of multiple interconnected components that require careful deployment and configuration. This section provides comprehensive guidance for system administrators on setting up production-ready infrastructure.

## Deployment options

### Deploy to Azure

Complete guide for deploying the GDI User Portal on Microsoft Azure infrastructure, including resource provisioning, networking, and security configuration.

### Deploy to ELIXIR-LU

Specific instructions for deploying to ELIXIR Luxembourg infrastructure, tailored for genomic data infrastructure requirements.

### Configure Docker containers

All components run as Docker containers. Learn about container orchestration, networking, and persistent storage configuration.

### Manage environments

Best practices for managing multiple environments (development, staging, production) and environment-specific configuration.

## Component installation

### User Portal Frontend

The frontend provides the web interface and integrates with backend services. Built with Next.js for optimal performance and user experience.

**Installation guide:** [User Portal Frontend README](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend?tab=readme-ov-file#gdi-user-portal-front-end)

### Dataset Discovery Service (DDS)

Backend service that mediates between the frontend and CKAN, providing abstraction and enhanced functionality.

**Installation guide:** [Dataset Discovery Service README](https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service?tab=readme-ov-file#gdi-user-portal---dataset-discovery-service)

### Access Management Service (AMS)

Handles access requests, user permissions, and integration with external systems like REMS.

**Installation guide:** [Access Management Service README](https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service?tab=readme-ov-file#gdi-user-portal---access-management-service)

### CKAN Extensions

The platform uses several custom CKAN extensions that must be properly integrated:

- **[GDI Userportal Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal)** - Core GDI functionality
- **[Fair Datapoint Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-fairdatapoint)** - FAIR principles support
- **[Harvest Ckanext](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-harvest)** - Data harvesting capabilities

For extension integration, see the [CKAN Docker repository](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker) installation guide.
