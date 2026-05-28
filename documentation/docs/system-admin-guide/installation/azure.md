---
slug: /azure
sidebar_label: "Deploy to Azure"
sidebar_position: 1
description: "Deploy the GDI User Portal to Azure using Azure CLI"
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Deploy to Azure

Deploy the GDI User Portal environment to **Azure** using Azure CLI. This automated deployment includes CKAN, frontend catalogue, SOLR, Keycloak, PostgreSQL, and Redis Cache.

:::info Development environment

This setup is intended for development use. Before moving to a production environment, review and adjust the security and performance settings to meet the necessary requirements.

:::

## Prerequisites

- **Azure CLI** installed on your machine
- **GitHub Personal Access Token (classic)** with package read permissions
- **Azure account** with permissions to create a resource group
- **PSQL** installed

## Configure deployment parameters

Before running the deployment script, configure the following parameters in the script:

- CKAN database password
- Keycloak database password
- PostgreSQL admin password

Change these to secure passwords as required for your environment.

## Run the deployment

Go to to the deployment repository: [GenomicDataInfrastructure/gdi-userportal-deployment](https://github.com/GenomicDataInfrastructure/gdi-userportal-deployment) and open the Azure deployment folder.

**Execute the deployment script:**

```bash
sh deploy_to_azure.azcli
```

**Enter required information:**

The script will prompt you to enter the necessary information. Provide the details as requested.

**Wait for deployment:**

The script will automatically execute, setting up the environment and deploying the code. The entire process typically takes about 10 minutes to complete.

## Verify deployment

After the script completes, verify that all components are online by accessing the following URLs. Replace `projectnaam` with your project name and `omgeving` with your environment name:

- **SOLR:** `https://projectnaam-solr-omgeving.azurewebsite.net`
- **CKAN:** `https://projectnaam-ckan-omgeving.azurewebsite.net`
- **Catalogue:** `https://projectnaam-catalogue-omgeving.azurewebsite.net`
- **Keycloak:** `https://projectnaam-keycloak-omgeving.azurewebsite.net`

## Configure Keycloak

After verifying that all components are online, import the CKAN realm into Keycloak:

1. Go to your Keycloak URL.
2. Log in using the admin credentials (found in the deployment script).
3. Import the CKAN realm configuration.

## Deployed components

The deployment includes the following Azure resources:

- **Azure Web App with CKAN container:** Runs a CKAN container from the main branch of the [gdi-userportal-ckan-docker](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker) repository.
- **Azure Web App with frontend catalogue:** Deploys from the main branch of the [gdi-userportal-frontend](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend) repository.
- **Azure Web App with SOLR:** Dedicated SOLR instance for CKAN search indexing.
- **Azure Web App with Keycloak:** Provides authentication and authorisation services.
- **Managed PostgreSQL server:** Includes Keycloak database and CKAN database.
- **Managed Redis Cache:** Provides caching to enhance performance.

:::tip Next steps

After deploying to Azure:

- [Set up authentication](/system-admin-guide/configure-auth): Configure Keycloak and LS-AAI integration
- [Manage user roles and permissions](/system-admin-guide/manage-user-roles): Set up user access levels
- [Manage data and services](/system-admin-guide/manage-data-services): Configure CKAN and data sources

:::
