---
slug: /developer-guide/add-api-endpoint
sidebar_label: "Add a new API endpoint"
sidebar_position: 2
description: "Extend backend services with new REST endpoints"
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Add a new API endpoint

Build REST endpoints in Quarkus backend services (DDS or AMS) using JAX-RS patterns.  

In this guide  
> [Create the resource class](#create-the-resource-class)  
> [Implement the service](#implement-the-service)  
> [Add OpenAPI documentation](#add-openapi-documentation)  
> [Write tests](#write-tests)  

## Create the resource class

```java
@Path("/api/v1/example")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ExampleResource {

    @Inject
    ExampleService service;

    @GET
    public Response list() {
        var results = service.findAll();
        return Response.ok(results).build();
    }

    @POST
    public Response create(ExampleRequest request) {
        var created = service.create(request);
        return Response.status(Status.CREATED).entity(created).build();
    }
}
```

## Implement the service

```java
@ApplicationScoped
public class ExampleService {

    public List<ExampleDTO> findAll() {
        // Business logic here
        return List.of();
    }

    @Transactional
    public ExampleDTO create(ExampleRequest request) {
        // Create and persist entity
        return new ExampleDTO();
    }
}
```

## Add OpenAPI documentation

```java
@Tag(name = "Example", description = "Example operations")
@Path("/api/v1/example")
public class ExampleResource {

    @Operation(summary = "List all examples")
    @APIResponse(responseCode = "200", description = "Success")
    @GET
    public Response list() {
        // ...
    }
}
```

## Write tests

```java
@QuarkusTest
class ExampleResourceTest {

    @Test
    void testList() {
        given()
            .when().get("/api/v1/example")
            .then()
            .statusCode(200);
    }
}
```

View documentation at `http://localhost:8080/q/swagger-ui/`
