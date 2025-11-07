---
slug: /system-admin-guide/configure-auth
sidebar_label: "Set up authentication "
sidebar_position: 4
---

# Set up authentication and authorisation

The GDI User Portal uses Keycloak for authentication and authorisation, with integration to LS-AAI (Life Science Authentication and Authorisation Infrastructure) for federated access across European research infrastructures.

## Authentication architecture

### Keycloak configuration
Keycloak serves as the central authentication provider, managing user sessions, roles, and permissions across all platform components.

### LS-AAI integration  
Integration with LS-AAI enables users to authenticate using their existing institutional credentials through the European research federation.

### User role management
Configure role-based access control to ensure appropriate permissions for different user types (data users, catalogue managers, system administrators).

## Configuration tasks

### Configure Keycloak
Set up Keycloak instance with proper realm configuration, client settings, and security policies.

### Integrate with LS-AAI
Configure LS-AAI as an identity provider in Keycloak, including OpenID Connect settings and attribute mapping.

### Manage user roles
Define and manage user roles and permissions to control access to different platform features and data.

## Identity providers configuration

When configuring identity providers (IdPs), you'll need:

- **ClientSecret** - Provided by the IdP during registration
- **ClientId** - Unique identifier for your application
- **Token URL** - OAuth2 token endpoint
- **Authorisation URL** - OAuth2 authorisation endpoint  
- **Redirect URI** - Keycloak callback URL

### Azure AD integration
Configure Azure Active Directory as an identity provider for organisational authentication.

### LS-AAI integration details
- **Discovery endpoint:** `https://login.elixir-czech.org/oidc/.well-known/openid-configuration`
- **Required scopes:** `openid`, `profile`, `email`, `elixir_id`
- **Sync mode:** Import (not force)
- **Token storage:** Enabled for Beacon Network integration

## Security considerations

### Token management
Proper configuration of token storage and refresh to enable secure API access across services.

### Access control  
Implementation of proper access control policies to protect sensitive data and administrative functions.

### Audit and monitoring
Set up logging and monitoring for authentication events and security incidents.

:::info content in progress

We are working on this guide.

:::
