---
slug: /developer-guide/build-features/integrate-external-apis/integrate-with-rems
sidebar_label: "Integrate with REMS"
sidebar_position: 1
description: Integrate Resource Entitlement Management System via API and OIDC auth
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Integrate with REMS

## Existing documentation

REMS provides OpenAPI documentation, found [here](https://rems-test.rahtiapp.fi/swagger-ui/index.html).

REMS DEMO can be found [here](https://rems-demo.rahtiapp.fi).

And REMS also provides an extensive documentation, that can be found [here](https://github.com/CSCfi/rems/blob/master/docs/using-the-api.md).

## Authentication

REMS requires OIDC to use the app, however for API integration REMS team suggests API Key and User impersonation. For more details, please check this [link](https://github.com/CSCfi/rems/blob/master/docs/using-the-api.md).

## Request & Response content type

REMS supports transit JSON and normal JSON. We will be using normal JSON payload. To ensure it is used, `Accept` header with `application/json` must be added to the request.
