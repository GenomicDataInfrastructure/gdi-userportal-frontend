---
slug: /system-admin-guide/configure-auth
sidebar_label: "Set up authentication"
sidebar_position: 5
description: "Configure Keycloak authentication and LS-AAI integration"
---

# Set up authentication and authorisation

Configure **Keycloak** for authentication and authorisation, with integration to LS-AAI (Life Science Authentication and Authorisation Infrastructure) for federated access across European research infrastructures.

## Prerequisites

- Keycloak instance deployed and accessible
- Admin access to Keycloak
- LS-AAI service registration approved (if using LS-AAI)
- Azure AD configuration (if using Azure AD integration)

## Authentication architecture

The GDI User Portal uses Keycloak as the central authentication provider, managing user sessions, roles, and permissions across all platform components:

- **Keycloak configuration:** Keycloak serves as the central authentication provider with realm configuration, client settings, and security policies.
- **LS-AAI integration:** Integration with LS-AAI enables users to authenticate using their existing institutional credentials through the European research federation.
- **User role management:** Configure role-based access control to ensure appropriate permissions for different user types (data users, catalogue managers, system administrators).

## Configure Keycloak realm

Set up your Keycloak instance with proper realm configuration, client settings, and security policies:

1. **Access Keycloak admin console:** Log in to your Keycloak instance using admin credentials.
2. **Create or configure realm:** Set up a realm for the GDI User Portal (typically named `gdi` or `ckan`).
3. **Configure realm settings:** Set up security policies, token lifetimes, and session management.

## Configure identity providers

Set up identity providers (IdPs) to enable federated authentication. When configuring identity providers, you will need:

- **ClientSecret:** Provided by the IdP during registration
- **ClientId:** Unique identifier for your application
- **Token URL:** OAuth2 token endpoint
- **Authorisation URL:** OAuth2 authorisation endpoint
- **Redirect URI:** Keycloak callback URL

### Azure AD integration

Configure Azure Active Directory as an identity provider for organisational authentication. For detailed Azure AD configuration steps, see [Configure LS-AAI in Keycloak](/system-admin-guide/configure-ls-aai-in-keycloak).

### LS-AAI integration

Configure LS-AAI as an identity provider in Keycloak with the following settings:

- **Discovery endpoint:** `https://login.elixir-czech.org/oidc/.well-known/openid-configuration`
- **Required scopes:** `openid`, `profile`, `email`, `elixir_id`
- **Sync mode:** Import (not force)
- **Token storage:** Enabled for Beacon Network integration

For detailed LS-AAI setup and registration steps, see [Configure LS-AAI in Keycloak](/system-admin-guide/configure-ls-aai-in-keycloak).

## Configure user roles and permissions

Define and manage user roles and permissions to control access to different platform features and data. For detailed role management procedures, see [Manage user roles and permissions](/system-admin-guide/manage-user-roles).

## Security considerations

Configure security settings to protect your authentication infrastructure.

- **Token management:** Configure token storage and refresh settings to enable secure API access across services.
- **Access control:** Implement access control policies to protect sensitive data and administrative functions.
- **Audit and monitoring:** Set up logging and monitoring for authentication events and security incidents.

:::tip Next steps

After configuring authentication:

- [Configure LS-AAI in Keycloak](/system-admin-guide/configure-ls-aai-in-keycloak): Detailed IdP setup steps
- [Manage user roles and permissions](/system-admin-guide/manage-user-roles): Configure user access levels
- [Manage data and services](/system-admin-guide/manage-data-services): Set up CKAN and data sources

:::
