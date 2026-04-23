---
slug: /developer-guide/test-integration
sidebar_label: "Test integration"
sidebar_position: 4
description: Test workflows with Testcontainers and API contract tests cross-service
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Test integration

Test cross-component workflows with Testcontainers and API tests.

## Testcontainers setup

Test with real databases using Docker:

```java
@QuarkusTest
@QuarkusTestResource(PostgresResource.class)
public class IntegrationTest {
    // Test with real PostgreSQL container
}
```

## API contract tests

Test API interactions between frontend and backend:

```typescript
describe("Dataset API", () => {
  it("creates and retrieves dataset", async () => {
    const created = await fetch("/api/datasets", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
    });
    const dataset = await created.json();

    const retrieved = await fetch(`/api/datasets/${dataset.id}`);
    expect(retrieved.status).toBe(200);
  });
});
```
