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

## Service APIs

### Dataset Discovery Service (DDS)
- **Base URL**: `http://localhost:8080`
- **OpenAPI**: `http://localhost:8080/q/swagger-ui/`
- **Endpoints**:
  - `GET /api/v1/datasets` - Search datasets
  - `GET /api/v1/datasets/{id}` - Retrieve dataset details
  - `GET /api/v1/facets` - Get available search facets

### Access Management Service (AMS)
- **Base URL**: `http://localhost:8081`
- **OpenAPI**: `http://localhost:8081/q/swagger-ui/`
- **Endpoints**:
  - `POST /api/v1/applications` - Create access request application
  - `GET /api/v1/applications` - List user's applications
  - `GET /api/v1/applications/{id}` - Retrieve application status

### CKAN API
- **Base URL**: `http://localhost:5000`
- **Documentation**: https://docs.ckan.org/en/latest/api/
- **Endpoints**:
  - `GET /api/3/action/package_search` - Search datasets
  - `GET /api/3/action/package_show` - Get dataset details
  - `POST /api/3/action/package_create` - Create dataset (auth required)

## Authentication

All endpoints except public dataset search require authentication:
- **Frontend ↔ Services**: Bearer token from Keycloak OIDC flow
- **Service ↔ CKAN**: API key or user token
- **Service ↔ REMS**: API key with user impersonation

## Response formats

All services return JSON:

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

Error responses follow RFC 7807 Problem Details:

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
# Search datasets
curl "http://localhost:8080/api/v1/datasets?q=genomics"

# Get dataset details
curl "http://localhost:8080/api/v1/datasets/123"
```

## Next steps

- Browse OpenAPI documentation for detailed schemas
- Try [Add a new API endpoint](../4-build-features/add-a-new-api-endpoint/)
- Review [integrate external APIs](../4-build-features/integrate-external-apis/)
