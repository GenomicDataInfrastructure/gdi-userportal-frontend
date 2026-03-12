---
slug: /developer-guide/implement-authentication
sidebar_label: "Implement authentication"
sidebar_position: 8
description: "Work with OIDC flows and Keycloak integration"
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Implement authentication

GDI uses Keycloak for authentication with OpenID Connect (OIDC) and PKCE flow.

## Frontend authentication (Next.js)

Uses `next-auth` with Keycloak provider:

```tsx
import { signIn, signOut, useSession } from 'next-auth/react';

export function LoginButton() {
  const { data: session } = useSession();
  
  if (session) {
    return <button onClick={() => signOut()}>Sign out</button>;
  }
  return <button onClick={() => signIn('keycloak')}>Sign in</button>;
}
```

## Backend authentication (Quarkus)

Protected endpoints:

```java
@RolesAllowed("user")
@GET
public Response secureEndpoint() {
    return Response.ok().build();
}
```

Access user info:

```java
@Inject
JsonWebToken jwt;

public String getUserId() {
    return jwt.getSubject();
}
```

Configuration in `application.properties`:

```properties
quarkus.oidc.auth-server-url=http://localhost:8180/realms/gdi
quarkus.oidc.client-id=gdi-backend
```
