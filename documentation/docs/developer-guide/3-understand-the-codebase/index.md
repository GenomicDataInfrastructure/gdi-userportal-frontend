---
slug: /developer-guide/understand-the-codebase
sidebar_label: "Understand the codebase"
sidebar_position: 4
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

This section helps you navigate the GDI codebase and understand architectural patterns used across different components.

## What's in this section

- **[Explore frontend architecture](./explore-frontend-architecture/)**: Next.js structure, routing, components, and state management
- **[Explore backend architecture](./explore-backend-architecture/)**: Quarkus patterns, REST APIs, and data access
- **[Explore CKAN architecture](./explore-ckan-architecture/)**: CKAN plugins, extensions, and database structure
- **[Review API contracts](./review-api-contracts/)**: OpenAPI specifications and service communication

## Understanding architectural patterns

The GDI platform follows modern architectural principles:

- **Microservices**: Each service has a single responsibility
- **REST APIs**: Services communicate via HTTP/JSON
- **Authentication**: Centralized through Keycloak (OIDC/PKCE)
- **Data persistence**: PostgreSQL for structured data, Solr for search
- **Containerization**: All services run in Docker containers

## Code organisation principles

Across all repositories:
- **Test-driven development**: Unit and integration tests
- **Type safety**: TypeScript (frontend), Java strong typing (backend), Python type hints (CKAN)
- **Code style**: Enforced via linters and formatters
- **Documentation**: Inline comments and OpenAPI specs
