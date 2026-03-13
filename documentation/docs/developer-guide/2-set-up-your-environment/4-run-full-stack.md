---
slug: /developer-guide/run-full-stack
sidebar_label: "Run full stack"
sidebar_position: 4
description: "Run all GDI platform services for full-stack local development"
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

Run all GDI platform services together using Docker Compose for full-stack local development.  

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- At least 16GB RAM and 4+ CPU cores
- At least 20GB free disk space

## System requirements

Full stack requires significant resources:

| Component | Memory | CPU |
|-----------|--------|-----|
| Frontend  | 512MB | 0.5 cores |
| DDS | 1GB | 1 core |
| AMS | 1GB | 1 core |
| CKAN | 2GB | 1 core |
| PostgreSQL | 1GB | 1 core |
| Solr | 2GB | 1 core |
| Redis | 256MB | 0.5 cores |
| Keycloak | 1GB | 1 core |
| Kong | 512MB | 0.5 cores |
| **Total** | **~10GB** | **8 cores** |

## Clone the orchestration repository

```bash
git clone https://github.com/GenomicDataInfrastructure/gdi-userportal-docker.git
cd gdi-userportal-docker
```

## Configure environment variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` to configure ports and credentials:

```plaintext
# Port assignments
FRONTEND_PORT=3000
DDS_PORT=8080
AMS_PORT=8081
CKAN_PORT=5000
KEYCLOAK_PORT=8180
KONG_PORT=8000

# Database
POSTGRES_USER=gdi_user
POSTGRES_PASSWORD=change-me-in-production
POSTGRES_DB=gdi

# Keycloak
KEYCLOAK_ADMIN_USER=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# CKAN
CKAN_SITE_URL=http://localhost:5000
CKAN_SYSADMIN_NAME=admin
CKAN_SYSADMIN_PASSWORD=admin123
CKAN_SYSADMIN_EMAIL=admin@example.com
```

## Start all services

```bash
docker compose up -d
```

This starts all services in the background. Initial startup may take 5-10 minutes as Docker pulls images and initialises databases.

## Monitor startup progress

Watch logs for all services:

```bash
docker compose logs -f
```

Watch logs for specific service:

```bash
docker compose logs -f frontend
```

## Verify services are running

Check service health:

```bash
docker compose ps
```

All services should show status `Up` or `healthy`.

### Service URLs

Once started, access services at:

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | (use Keycloak login) |
| DDS API | http://localhost:8080 | - |
| AMS API | http://localhost:8081 | - |
| CKAN | http://localhost:5000 | admin / admin123 |
| Keycloak | http://localhost:8180 | admin / admin |
| Kong Admin | http://localhost:8001 | - |

### Health checks

Verify each service:

```bash
# Frontend
curl http://localhost:3000

# DDS
curl http://localhost:8080/q/health

# AMS
curl http://localhost:8081/q/health

# CKAN
curl http://localhost:5000/api/3/action/status_show
```

## Development workflow

Make code changes and see them reflected in the running services. Use Docker Compose commands to restart specific services or view logs.

### Make code changes

When developing with full stack:

1. **Frontend changes**: Use `docker compose watch frontend` for live reload.
2. **Backend changes**: Restart specific service: `docker compose restart dds`.
3. **CKAN changes**: Rebuild CKAN image if modifying extensions.

### Restart a specific service

```bash
docker compose restart <service-name>
```

### View service logs

```bash
docker compose logs -f <service-name>
```

### Execute commands in a container

```bash
docker compose exec <service-name> /bin/bash
```

For example, access CKAN shell:
```bash
docker compose exec ckan ckan --help
```

## Stop services

Stop all services (keep data):

```bash
docker compose stop
```

Stop and remove containers (keep data):

```bash
docker compose down
```

Stop and remove everything (including data):

```bash
docker compose down -v
```

## Clean up

Remove all containers, networks, and volumes:

```bash
docker compose down -v
docker system prune -a
```


## Troubleshooting

Here are common issues and solutions when running the full stack:

- **Services fail to start.** Check logs for errors:

    ```bash
    docker compose logs <service-name>
    ```

- **Port conflicts.** If ports are already in use, change them in `.env` file and restart:

    ```bash
    docker compose down
    docker compose up -d
    ```

- **Out of memory errors.** Increase Docker memory limit: 

    In your Docker Desktop, go to **Settings** > **Resources** > **Memory** and set it to 8GB (minimum).

- **Database connection errors.** Ensure PostgreSQL is fully initialised:

    ```bash
    docker compose logs postgres | grep "database system is ready"
    ```

- **Rebuild all images.** Force rebuild if code changes aren't reflected:

    ```bash
    docker compose build --no-cache
    docker compose up -d
    ```
