---
slug: /developer-guide/set-up-backend-services
sidebar_label: "Set up backend services"
sidebar_position: 2
description: "Set up Java/Quarkus services for local development"
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Set up backend services

Set up the Java/Quarkus backend services (Dataset Discovery Service and Access Management Service) for local development and testing.  

## Prerequisites

- Java Development Kit (JDK) 17 or 21
- Maven 3.8+
- Docker (for running PostgreSQL and other dependencies)
- Git

## Clone the repository

Choose the service you want to set up and clone the corresponding repository—DDS or AMS:

- ### Dataset Discovery Service (DDS)

    DDS mediates requests between frontend and CKAN for dataset search and retrieval.

    ```bash
    git clone https://github.com/GenomicDataInfrastructure/gdi-userportal-dataset-discovery-service.git
    cd gdi-userportal-dataset-discovery-service
    ```

- ### Access Management Service (AMS)

    AMS manages access request workflows and integrates with REMS.

    ```bash
    git clone https://github.com/GenomicDataInfrastructure/gdi-userportal-access-management-service.git
    cd gdi-userportal-access-management-service
    ```

## Install dependencies

Maven downloads dependencies automatically when you first build the project. To do this, run:

```bash
./mvnw clean install
```

On Windows:
```cmd
mvnw.cmd clean install
```

## Configure environment variables

Create an `application.properties` file in `src/main/resources/`:

```properties
# Database configuration
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/gdi
quarkus.datasource.username=gdi_user
quarkus.datasource.password=gdi_pass

# CKAN integration (for DDS)
ckan.api.url=http://localhost:5000/api/3

# REMS integration (for AMS)
rems.api.url=http://localhost:3001/api
rems.api.key=your-api-key-here

# Keycloak authentication
quarkus.oidc.auth-server-url=http://localhost:8180/realms/gdi
quarkus.oidc.client-id=gdi-backend
quarkus.oidc.credentials.secret=your-client-secret

# Development settings
quarkus.http.port=8080
quarkus.log.level=INFO
quarkus.log.category."io.github.genomicdatainfrastructure".level=DEBUG
```

## Start dependencies with Docker

Both services require PostgreSQL. Use Docker Compose:

```bash
docker compose up -d postgres
```

Or run PostgreSQL directly:

```bash
docker run -d 
  --name gdi-postgres \
  -e POSTGRES_DB=gdi \
  -e POSTGRES_USER=gdi_user \
  -e POSTGRES_PASSWORD=gdi_pass \
  -p 5432:5432 \
  postgres:14
```

## Run in development mode

Start the Quarkus development server:

```bash
./mvnw quarkus:dev
```

The service will start with:
- **Hot reload**: Code changes trigger automatic recompilation
- **Dev UI**: Available at `http://localhost:8080/q/dev/`
- **Health checks**: `http://localhost:8080/q/health`
- **OpenAPI docs**: `http://localhost:8080/q/swagger-ui/`

## Verify the setup

1. Check health endpoint:
    ```bash
    curl http://localhost:8080/q/health
    ```

    Expected response:
    ```json
    {
      "status": "UP",
      "checks": [...]
    }
    ```

2. View OpenAPI documentation: Open `http://localhost:8080/q/swagger-ui/` in your browser to see API endpoints.

3. Test an endpoint:

    ```bash
    curl http://localhost:8080/api/datasets
    ```

## Development workflow

Run tests:
```bash
./mvnw test
```

Run integration tests:
```bash
./mvnw verify
```

Code formatting:  

```bash
./mvnw spotless:apply
```

Build for production:
```bash
./mvnw package
```

The executable JAR is in `target/quarkus-app/`.

## Configure your IDE

**IntelliJ IDEA:**
1. Open the project (File → Open → select pom.xml)
2. Maven dependencies will import automatically
3. Enable annotation processing (Settings → Build → Compiler → Annotation Processors)

**Install VS Code extensions:**
- Extension Pack for Java
- Quarkus
- Lombok Annotations Support for VS Code

## Common issues

- **Port already in use:** Change the port in `application.properties`.

  ```properties
  quarkus.http.port=8081
  ```

- **Database connection failed:** Ensure PostgreSQL is running.

  ```bash
  docker ps | grep postgres
  ```

- **Maven build fails:** Clear Maven cache and rebuild.

  ```bash
  ./mvnw clean install -U
  ```
