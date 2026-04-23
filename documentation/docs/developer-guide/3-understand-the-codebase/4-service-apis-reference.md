---
slug: /developer-guide/service-apis-reference
sidebar_label: "Service APIs reference"
sidebar_position: 4
description: "Reference REST endpoints, authentication, and response formats"
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Service APIs reference

The GDI platform services communicate via REST APIs. Each service exposes OpenAPI specifications documenting available endpoints.

## Service

Explore the APIs of the different services in the GDI platform for dataset management:

### Dataset Discovery Service (DDS)

- **OpenAPI:** Access at `<base-url>/q/swagger-ui/`
- **Example:** `http://localhost:8080/q/swagger-ui/` for local development
- **Endpoints:**
  - `GET /api/v1/datasets`: Search datasets
  - `GET /api/v1/datasets/{id}`: Retrieve dataset details
  - `GET /api/v1/facets`: Get available search facets

### Access Management Service (AMS)

- **OpenAPI:** Access at `<base-url>/q/swagger-ui/`
- **Example:** `http://localhost:8081/q/swagger-ui/` for local development
- **Endpoints:**
  - `POST /api/v1/applications`: Create access request application
  - `GET /api/v1/applications`: List user's applications
  - `GET /api/v1/applications/{id}`: Retrieve application status

### CKAN API

- **Documentation:** https://docs.ckan.org/en/latest/api/ access at `<ckan-base-url>/api/3/action/`
- **Example:** `http://localhost:5000/api/3/action/` for local development
- **Endpoints:**
  - `GET /api/3/action/package_search`: Search datasets
  - `GET /api/3/action/package_show`: Get dataset details
  - `POST /api/3/action/package_create`: Create dataset (auth required)

## Authentication

All endpoints require authentication except public dataset search:

- **Frontend ↔ Services**: Bearer token from Keycloak OIDC flow
- **Service ↔ REMS**: API key with user impersonation

## Response formats

All services return JSON. Below are examples of typical responses.

```json
{
  "data": {...},
  "metadata": {
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

Error responses follow RFC 7807 Problem Details. Example:

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Dataset with ID 'xyz' not found"
}
```

## Testing APIs

Use curl, Postman, or HTTPie to test endpoints:

```bash
# Search datasets - Full example
curl -X POST "http://localhost:8080/api/v1/datasets/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "genomics",
    "rows": 10,
    "start": 0,
    "operator": "OR",
    "includeBeacon": true
  }'

# Search datasets - Minimal version
curl -X POST "http://localhost:8080/api/v1/datasets/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "genomics"
  }'
```
