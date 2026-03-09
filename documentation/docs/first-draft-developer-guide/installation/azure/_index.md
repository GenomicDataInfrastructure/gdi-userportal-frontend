---
title: Azure
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Azure CLI Script Deployment Guide for a Catalogue with CKAN

This guide will walk you through the process of deploying an environment using Azure CLI that includes a CKAN container, Frond end catalogue, SOLR for CKAN, Keycloak for authentication, a managed PostgreSQL server, and Redis Cache. This environment is suitable for development purposes, and further security and performance reviews are necessary for production deployment.

## Prerequisites

- **Azure CLI installed:** Make sure you have Azure CLI installed on your machine. You can install it via Homebrew with the command `brew install azure-cli`.
- **GitHub Personal Access Token (classic):** You'll need a personal access token from GitHub with pack read permissions.
- **Azure Account with Sufficient Permissions:** Ensure you have an Azure account with permissions that, at a minimum, allow you to create a resource group.
- **PSQL installed:** Ensure that PSQL is installed  (eg. `sudo apt-get install postgresql -y`)

## Initial Setup

Before running the script, you'll find several parameters at the beginning of the script that can be customized:
- Passwords for the CKAN database, Keycloak database, and the PostgreSQL admin. Change these to secure passwords as desired.

## Deployment Steps

1. **Execute the Script:**
   - Navigate to the deployment project at [GenomicDataInfrastructure/gdi-userportal-deployment](https://github.com/GenomicDataInfrastructure/gdi-userportal-deployment).
   - Go to the Azure deployment folder
   - Run `sh deploy_to_azure.azcli` to start the deployment process.

2. **Enter Required Information:**
   - The script will prompt you to enter the necessary information. Fill in the details as requested.

3. **Script Execution:**
   - After entering the information, the script will automatically execute, setting up the environment and deploying the code. It typically takes about 10 minutes for the entire process to complete and for the services to be up and running.

4. **Verification:**
   - Once the script execution is complete, verify that all components are online by accessing the following URLs, replacing `projectnaam` with your project name and `omgeving` with your environment name:
     - SOLR: `https://projectnaam-solr-omgeving.azurewebsite.net`
     - CKAN: `https://projectnaam-ckan-omgeving.azurewebsite.net`
     - Catalog: `https://projectnaam-catalogue-omgeving.azurewebsite.net`
     - Keycloak: `https://projectnaam-keycloak-omgeving.azurewebsite.net`

5. **Import CKAN Realm into Keycloak:**
   - After verifying that all components are online, the next step is to import the CKAN realm into Keycloak. Log in to Keycloak using the admin account to perform this action. (creditials can be found in the script)

## Components Included

- **Azure Web App with CKAN Container:** Runs a CKAN container from the main branch of the [gdi-userportal-ckan-docker](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker) repository.
- **Azure Web App with Front Catalog:** Originates from the main branch of the [gdi-userportal-frontend](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend) repository.
- **Azure Web App with SOLR for CKAN:** Dedicated SOLR instance for CKAN.
- **Azure Web App with Keycloak:** For authentication and authorization.
- **Managed PostgreSQL Server:** Includes a Keycloak database and a CKAN database.
- **Managed Redis Cache:** For caching purposes to enhance performance.

## Note

This setup is intended for development use. Before moving to a production environment, review and adjust the security and performance settings to meet the necessary requirements.

