---
slug: /developer-guide/apply-security-practices
sidebar_label: "Apply security practices"
sidebar_position: 2
description: Implement security best practices with OWASP guidelines and scanners
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Apply security practices

Implement security best practices across GDI components.

## OWASP Top 10

Address common vulnerabilities:

### SQL injection prevention

Use parameterised queries:

```java
@Query("SELECT d FROM Dataset WHERE id = :id")
Dataset findById(@Param("id") Long id);
```

### XSS prevention

Sanitise user input in React:

```tsx
import DOMPurify from 'isomorphic-dompurify';

const SafeContent = ({ html }) => {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};
```

## Security scanning

### Dependency scanning

Check for vulnerabilities:

```bash
npm audit
./mvnw dependency-check:check
```

### Secrets management

Never commit secrets. Use environment variables:

```typescript
const apiKey = process.env.API_KEY;
```

## Authentication security

- Use HTTPS only
- Implement CSRF protection
- Set secure cookie flags
- Validate JWT tokens
- Implement rate limiting

See [Implement authentication](../../4-build-features/implement-authentication) for OIDC integration details.
