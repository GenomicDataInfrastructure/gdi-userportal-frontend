---
slug: /developer-guide/understand-the-codebase/explore-backend-architecture
sidebar_label: "Explore backend architecture"
sidebar_position: 2
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

The backend services (DDS and AMS) are built with Quarkus, a Kubernetes-native Java framework optimised for fast startup and low memory usage.

## Project structure

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

## Next steps

- Study REST endpoints in `/api` package
- Review service layer patterns
- Try [Add a new API endpoint](../../4-build-features/add-a-new-api-endpoint/)
