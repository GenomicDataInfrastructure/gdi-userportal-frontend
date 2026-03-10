---
slug: /developer-guide/build-features/manage-database-migrations
sidebar_label: "Manage database migrations"
sidebar_position: 7
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

Database migrations manage schema changes across environments. GDI uses:
- **Flyway** for Java/Quarkus services
- **Alembic** for CKAN

## Flyway migrations (DDS/AMS)

Create migration in `src/main/resources/db/migration/`:

```sql
-- V1__create_examples_table.sql
CREATE TABLE examples (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Apply on startup automatically or via:

```bash
./mvnw flyway:migrate
```

## CKAN migrations

See CKAN documentation for Alembic migrations.
