---
slug: /developer-guide/platform-overview
sidebar_label: "Platform overview"
sidebar_position: 2
description: "Learn about the GDI platform components and architecture"
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Platform overview

The GDI User Portal is a distributed system composed of multiple independent services working together to provide dataset discovery and access management capabilities.

:::tip Architecture at a glance

For detailed architecture diagrams and component interactions, see: GDI application architecture.

:::

<!-- TODO: Link to GDI application architecture to follow -->

## Core components

### User-facing layer

- **Frontend** (Next.js): React-based web application providing the user interface
  - TypeScript, Next.js 14, TailwindCSS
  - Server-side rendering (SSR) for performance
  - Responsive design for mobile and desktop

### API layer

- **Kong Gateway**: API gateway handling routing, authentication, and rate limiting
  - Routes requests between frontend and backend services
  - Enforces security policies
  - Provides observability through logging

### Backend services (Java/Quarkus)

- **Dataset Discovery Service (DDS)**: Mediates frontend requests to CKAN
  - REST API for dataset search and retrieval
  - Transforms CKAN responses to frontend-friendly format
  - Implements business logic for dataset filtering

- **Access Management Service (AMS)**: Manages access request workflows
  - Integrates with REMS for application management
  - Tracks application status and approvals
  - Provides notification capabilities

### Data catalogue

- **CKAN**: Open-source data catalogue system
  - PostgreSQL database for metadata storage
  - Solr for full-text search
  - Custom GDI extensions for DCAT-AP 3 support
  - Harvester extensions for collecting external datasets

### Supporting services

- **Keycloak**: Identity and access management (IAM)
  - OpenID Connect (OIDC) authentication
  - Integration with LS-AAI federated login
  - PKCE flow support for secure authentication

- **REMS**: Resource Entitlement Management System
  - Access request workflow engine
  - Application approval processes
  - Integration via REST API

- **FAIR Data Point (FDP)**: Metadata repository
  - Implements FAIR principles
  - Provides harvestable metadata endpoints
  - DCAT-AP compatible outputs

## Technology stack

| Component   | Technology     | Language    |
| ----------- | -------------- | ----------- |
| Frontend    | Next.js 14     | TypeScript  |
| DDS/AMS     | Quarkus        | Java 17+    |
| CKAN        | CKAN 2.10      | Python 3.9+ |
| API Gateway | Kong           | Lua/Docker  |
| Database    | PostgreSQL 14+ | SQL         |
| Search      | Apache Solr 8+ | -           |
| Cache       | Redis 7+       | -           |
| IAM         | Keycloak 22+   | -           |

<!-- ## Data flow example

**Dataset discovery flow:**
1. User searches via Frontend
2. Frontend calls Kong Gateway → DDS
3. DDS queries CKAN API
4. CKAN searches Solr index
5. Results transformed through DDS → Frontend
6. User views formatted dataset list

**Access request flow:**
1. User selects datasets and submits request via Frontend
2. Frontend calls Kong Gateway → AMS
3. AMS creates application in REMS
4. REMS notifies data controller
5. Status updates flow back through AMS → Frontend -->

<!-- TODO: Confirm with Bruno - Architecture documentation? -->

## Next steps

Now that you understand the platform, learn about [repository structure](/developer-guide/repository-structure) to find where code lives.
