---
title: Elixir LU
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

### Current deployment
- `portal.dev.gdi.lu` - User Portal
- `id.portal.dev.gdi.lu` - IAM
- `api.portal.dev.gdi.lu` - API Gateway
- `catalogue.portal.dev.gdi.lu` - Catalogue

### Deployment Steps

1. Checkout `https://github.com/GenomicDataInfrastructure/gdi-userportal-deployment`.
2. Copy `.env.example` into the server and update all the secrets.
3. Run `docker compose build`.
4. Run `docker compose run --rm -e CMD="migrate" rems`.
5. Run `docker compose up -d rems`.
6. Enter in REMS docker container.
7. Configure the admin user.
8. Configure `access-management-service` apikey, for any user and any REST method, but limited to `/api/users/create,/api/catalogue-items,/api/my-applications,/api/applications/.*`.
9. Configure `rems-synchronizer` apikey and robot for any REST method, but limited to `/api/organizations.*,/api/forms.*,/api/workflows.*,/api/resources.*,/api/catalogue-items.*`.
10. Configure `ls-aai` apikey and robot, limited to `GET /api/permissions/.*`.
11. Include in the environment variables the newly created apikeys and users.
12. Run `docker compose up -d`.
13. Log into CKAN as sysadmin.
14. Add the harvest sources.
15. Wait for REMS Synchronizer or run it manually.
16. Access Keycloak.
17. Configure LS-AAI IdP.
18. Add `Claim to User Attribute` mapper, that maps the clain clain `sub` into `elixir_id`.
19. Create a new OIDC realm for GDI, that accepts redirections to User Portal, CKAN and REMS.
20. Create a new client scope for GDI realm.
21. Add new User Attribute Mapper, that maps the attribute `elixir_id` into a claim called `elixir_id` and a scope called `elixir_id`.
22. Create a new client for User Portal, REMS and CKAN.
23. Add the scope `elixir_id` into the newly created client.
