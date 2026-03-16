---
slug: /developer-guide/backend-architecture
sidebar_label: "Backend architecture"
sidebar_position: 2
description: "Explore Quarkus, hexagonal architecture, and REST API design"
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Backend architecture

The backend services (DDS and AMS) are built with Quarkus, a Kubernetes-native Java framework optimised for fast startup and low memory usage.

## Project structure

Key directories of the backend codebase include:

```
gdi-userportal-{service}/
├── src/main/java/
│   └── io/github/genomicdatainfrastructure/
│       ├── {service}/
│       │   ├── api/          # REST endpoint implementations
│       │   ├── model/        # Domain models and DTOs
│       │   ├── services/     # Business logic
│       │   ├── ports/        # Hexagonal architecture ports
│       │   └── adapters/     # External service adapters
│       └── Application.java  # Main application class
├── src/main/resources/
│   ├── application.properties
│   └── db/migration/         # Flyway database migrations
└── src/test/                 # Unit and integration tests
```

## Key patterns

The backend architecture follows established patterns for building maintainable and scalable Java applications:

### Hexagonal architecture
- **Ports**: Interfaces defining business capabilities
- **Adapters**: Implementations for external systems (CKAN, REMS, database)
- **Domain**: Business logic independent of infrastructure

### REST API design
- JAX-RS annotations for endpoints
- DTOs for request/response mapping
- OpenAPI/Swagger documentation

### Dependency injection
- CDI (`@Inject`) for dependency management
- `@ApplicationScoped` for singletons
- `@RequestScoped` for per-request instances

### Database access
- Hibernate Panache for ORM
- Flyway for database migrations
- Transactional boundaries with `@Transactional`

