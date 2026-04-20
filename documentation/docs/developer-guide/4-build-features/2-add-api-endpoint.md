---
slug: /developer-guide/add-api-endpoint
sidebar_label: "Add a new API endpoint"
sidebar_position: 2
description: "Extend backend services with new REST endpoints"
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Add a new API endpoint

Build REST endpoints in Quarkus backend services (DDS or AMS) following GDI's API-first approach.

## API-first development

GDI follows an API-first methodology where OpenAPI specifications are defined before implementation. This ensures consistent contracts between frontend and backend teams.

## Learn from existing examples

The best way to understand how to add an API endpoint is to examine existing implementations in the codebase.

**For detailed workflow examples:**
- [Add metadata fields](/developer-guide/add-metadata-fields#discovery-service) - Shows the complete workflow for updating OpenAPI definitions and implementing changes in the Discovery Service
- Backend repositories - Review existing resource classes and their corresponding OpenAPI definitions

**Key files to examine:**
- `src/main/openapi/` - OpenAPI YAML specifications
- `src/main/java/.../api/` - REST resource implementations
- `src/main/java/.../services/` - Business logic services

## General workflow

Based on the [metadata fields guide](/developer-guide/add-metadata-fields#discovery-service):

1. Update the OpenAPI definition in `src/main/openapi/` folder.
2. Regenerate code: `mvn clean compile`.
3. Implement or update the business logic and mapping.
4. Update test cases.
5. Verify with automated testing: `mvn test`.
6. View documentation at `http://localhost:8080/q/swagger-ui/`.

For specific implementation patterns and detailed steps, refer to existing endpoints in the codebase and the metadata fields guide.
