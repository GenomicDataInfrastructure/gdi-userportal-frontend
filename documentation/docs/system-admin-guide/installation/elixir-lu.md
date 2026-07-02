---
slug: /elixir-lu
sidebar_label: "Deploy to ELIXIR-LU"
sidebar_position: 2
description: "Deploy the GDI User Portal to ELIXIR Luxembourg infrastructure"
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Deploy to ELIXIR-LU

Deploy the GDI User Portal to **ELIXIR** Luxembourg infrastructure. This deployment uses Docker Compose and includes the User Portal, CKAN, REMS, Keycloak, and API Gateway.

## Current deployment endpoints

The following endpoints are available in the development environment:

- **User Portal:** `portal.dev.gdi.lu`
- **IAM (Identity and Access Management):** `id.portal.dev.gdi.lu`
- **API Gateway:** `api.portal.dev.gdi.lu`
- **Catalogue:** `catalogue.portal.dev.gdi.lu`

## Prerequisites

- Access to the ELIXIR-LU server
- Docker and Docker Compose installed
- Admin access to CKAN, REMS, and Keycloak
- GitHub repository access to [gdi-userportal-deployment](https://github.com/GenomicDataInfrastructure/gdi-userportal-deployment)

## Clone the deployment repository

Clone the deployment repository to your server:

```bash
git clone https://github.com/GenomicDataInfrastructure/gdi-userportal-deployment.git
cd gdi-userportal-deployment
```

## Configure environment variables

Copy the environment example file and update all secrets:

```bash
cp .env.example .env
```

Edit the `.env` file and update all the secrets and configuration values as required for your environment.

## Deploy REMS

Build and deploy the REMS service first:

```bash
docker compose build
docker compose run --rm -e CMD="migrate" rems
docker compose up -d rems
```

## Configure REMS

After REMS is running, configure the required API keys and users.

1. **Configure the admin user.** Enter the REMS Docker container and configure the admin user.

2. **Configure access-management-service API key.** Create an API key for any user and any REST method, limited to the following endpoints:
   - `/api/users/create`
   - `/api/catalogue-items`
   - `/api/my-applications`
   - `/api/applications/.*`

3. **Configure rems-synchronizer API key.** Create an API key and robot for any REST method, limited to the following endpoints:
   - `/api/organizations.*`
   - `/api/forms.*`
   - `/api/workflows.*`
   - `/api/resources.*`
   - `/api/catalogue-items.*`

4. **Configure ls-aai API key.** Create an API key and robot, limited to: `GET /api/permissions/.*`

5. **Update environment variables.** Include the newly created API keys and users in the environment variables file.

## Deploy all services

Deploy all remaining services:

```bash
docker compose up -d
```

## Configure CKAN harvesting

After all services are running, set up data harvesting in CKAN.

1. **Log in to CKAN:** Log in to CKAN as a sysadmin user.

2. **Add harvest sources:** Configure and add the required harvest sources for your data catalogues.

3. **Run REMS synchroniser:** Wait for the REMS synchroniser to run automatically, or run it manually.

## Configure Keycloak and LS-AAI

Configure authentication and authorisation with Keycloak and LS-AAI integration.

1. **Access Keycloak:** Go to your Keycloak instance at `id.portal.dev.gdi.lu`.

2. **Configure LS-AAI identity provider:** Set up LS-AAI as an identity provider in Keycloak.

3. **Add claim to user attribute mapper:** Add a mapper that maps the claim `sub` into `elixir_id`.

4. **Create OIDC realm for GDI:** Create a new OIDC realm for GDI that accepts redirections to User Portal, CKAN, and REMS.

5. **Create client scope:** Create a new client scope for the GDI realm.

6. **Add user attribute mapper:** Add a new User Attribute Mapper that maps the attribute `elixir_id` into a claim called `elixir_id` and a scope called `elixir_id`.

7. **Create clients:** Create a new client for User Portal, REMS, and CKAN.

8. **Add scope to clients:** Add the scope `elixir_id` to the newly created clients.

:::tip Next steps

After deploying to ELIXIR-LU:

- [Manage user roles and permissions](/system-admin-guide/manage-user-roles): Set up user access levels in CKAN
- [Manage data and services](/system-admin-guide/manage-data-services): Configure harvesters and data sources
- [Monitor and maintain the system](/system-admin-guide/monitor-maintain): Set up monitoring and logging

:::
