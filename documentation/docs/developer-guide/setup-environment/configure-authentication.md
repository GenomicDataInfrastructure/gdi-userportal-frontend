---
title: Configure authentication
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI
SPDX-FileContributor: PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Configure LS-AAI in Keycloak

Configure LS-AAI (Life Science Authentication and Authorisation Infrastructure) in Keycloak to enable authentication for the GDI User Portal.

## Obtain Keycloak

Keycloak can be obtained by running the CKAN deployment script that you can find in the [Azure deployment guide](../deploy-production/deploy-to-azure.md).

## Configure Identity Providers (IdPs)

When configuring identity providers (IdPs), the following information is required for OpenID setup:

* ClientSecret
* ClientId
* Token URL
* Authorisation URL
* Redirect URI

Both the 'Token URL' and 'Authorisation URL' are derived from the IdP. When registering a service, you acquire the clientId and secret. The 'Redirect URI', which remains constant, is provided by Keycloak:  

```
https://{app_name_azure}.azurewebsites.net/auth/realms/master/broker/azuread/endpoint
```

Additionally, the corresponding configuration entails:

* Scopes: "openid", "profile", "email" , "elixir_id"
* Method: POST the Clientsecret
* Sync method: import

For Elixir_id an additional mapper is needed.

## Azure AD Integration

For Azure integration, follow the tutorial at [https://www.youtube.com/watch?v=LYF-NLHD2uQ](https://www.youtube.com/watch?v=LYF-NLHD2uQ). This tutorial comprehensively explains both the service registration and the Azure AD setup within Keycloak. 

Management of the app registration is done within the Azure portal: [portal.azure.com](https://portal.azure.com)

## LS-AAI Configuration

To register Keycloak as a service, visit [https://elixir-europe.org/platforms/compute/aai/service-providers](https://elixir-europe.org/platforms/compute/aai/service-providers).

### Registration Steps

1. Obtain an account
2. Ensure your organisation is recognised as an IdP and register if not
3. Submit a registration for your application as a service
   
   :::info Approval Required
   Please note that approval for this step may entail a waiting period.
   :::

Management of the app registration is done within: [https://services.aai.lifescience-ri.eu](https://services.aai.lifescience-ri.eu)

**Discovery endpoint**: [https://login.elixir-czech.org/oidc/.well-known/openid-configuration](https://login.elixir-czech.org/oidc/.well-known/openid-configuration)

### LS-AAI Configuration in Keycloak

The LS-AAI configuration should look like this:

![LS-AAI Configuration Part 1](/img/developer-guide/keycloak_part1.png)

![LS-AAI Configuration Part 2](/img/developer-guide/keycloak_part2.png)

**Important configuration notes:**

1. **Sync mode** must be "import" instead of "force"
2. **Store tokens** and **Stored tokens readable** must be enabled, to allow User Portal components to get LS-AAI `access_token`. This enables Beacon Network integration via OAuth2.

The first time you log in you will be asked if you want to be a member of the test environment. Agree and proceed.

## Fetch LS-AAI Access Token from Keycloak

### Option 1: Direct API Call

To fetch an access token from LS-AAI - or any IdP - configure Keycloak accordingly, then request LS-AAI tokens from Keycloak.

**Steps:**

1. Go to `Keycloak Admin \ Identity Providers \ LS-AAI Provider Details`
2. Enable `Store Tokens` and `Stored tokens readable`
3. Delete LS-AAI existing users, to ensure users are initialised correctly in Keycloak
4. Log in with an LS-AAI user
5. Call Keycloak endpoint:
   ```
   GET https://keycloak-test.healthdata.nl/realms/ckan/broker/LSAAI/token
   Authorization: {keycloak_access_token}
   ```

### Option 2: Configure OAuth 2.0 in Postman

Follow these steps to set up OAuth 2.0 authorisation for a request in Postman and obtain the LS-AAI token.

#### Steps to Configure OAuth 2.0

1. **Open Postman Application**
   
   Begin by opening the Postman application on your desktop.

2. **Select a Request**
   
   Choose any existing request from your collections, or create a new one by clicking on the 'New' button and selecting 'Request'.

3. **Authorisation Setup**
   
   Navigate to the 'Authorisation' tab within the selected request.

4. **Set Authorisation Type**
   
   From the 'Type' dropdown menu, select 'OAuth 2.0'.

5. **Add Authorisation Data to Request Headers**
   
   In the 'Add authorisation data to' dropdown, select 'Request Headers'.

6. **Current Token Configuration**
   
   For the 'Current Token' section, choose 'Bearer' as the token type.

7. **Configure New Token**
   
   Follow the steps below to configure a new token:

   - **Token Name**: Enter a name for your token
   
   - **Grant Type**: Select 'Authorisation Code' from the dropdown menu
   
   - **Authorise Using Browser**: Ensure this box is checked to use your default web browser for the authorisation
   
   - **Auth URL**: Replace `{keycloak url}` and `{realm_name}` with the appropriate values for your Keycloak server and realm:
     ```
     {keycloak url}/realms/{realm_name}/protocol/openid-connect/auth
     ```
   
   - **Access Token URL**: Similar to the Auth URL, fill in the Keycloak server and realm information:
     ```
     {keycloak url}/realms/{realm_name}/protocol/openid-connect/token
     ```
   
   - **Client ID**: Enter 'ckan' or the specific client ID you have been provided
   
   - **Client Secret**: Enter the client secret you obtained from Keycloak that corresponds to your client ID
   
   - **Scope**: Input the scopes as `openid profile email elixir_id`
   
   - **Client Authentication**: Select 'Send as Basic Auth header' from the dropdown menu

8. **Obtain Access Token**
   
   Click on the 'Get New Access Token' button to initiate the OAuth 2.0 authorisation flow.

After completing these steps, you should receive an access token that can be used to authorise your requests within Postman, which also contains an Elixir ID.

## Next Steps

- [Troubleshooting setup](./troubleshooting-setup.md) - Resolve authentication issues
- [Deploy to Azure](../deploy-production/deploy-to-azure.md) - Production deployment guide
- [Understand user roles](../customize-platform/understand-user-roles.md) - Configure permissions
