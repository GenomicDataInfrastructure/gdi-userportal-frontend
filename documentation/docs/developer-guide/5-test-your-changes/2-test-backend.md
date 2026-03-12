---
slug: /developer-guide/test-your-changes/test-backend
sidebar_label: "Test backend"
sidebar_position: 2
description: Test Java services with JUnit 5, Quarkus extensions, and RestAssured
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Test backend

Test Java services with JUnit 5 and Quarkus testing extensions.

## Unit tests

Create `ServiceTest.java`:

```java
@QuarkusTest
public class DatasetServiceTest {

    @Inject
    DatasetService service;

    @Test
    public void testFindById() {
        Dataset dataset = service.findById(1L);
        assertNotNull(dataset);
    }
}
```

Run tests:

```bash
./mvnw test
```

## REST API tests

Use RestAssured for API testing:

```java
@Test
public void testGetDataset() {
    given()
        .when().get("/api/datasets/1")
        .then()
        .statusCode(200)
        .body("title", equalTo("Expected Title"));
}
```
