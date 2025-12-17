---
slug: /platform-overview
sidebar_label: "Platform overview"
sidebar_position: 2
---

# Platform overview

:::info content in progress

This section will describe architecture, components, and interactions at a high level.

:::

The GDI User Portal consists of multiple interconnected components:

- **User Portal Frontend** - Next.js web interface providing the user experience
- **Dataset Discovery Service (DDS)** - Backend API layer mediating frontend-CKAN communication
- **Access Management Service (AMS)** - Access control and data request management
- **CKAN** - Open-source data catalogue management system with custom extensions
- **Keycloak** - Authentication and authorisation service
- **Supporting services** - PostgreSQL, Elasticsearch/Solr, Redis, Docker containers
