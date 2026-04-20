---
slug: /developer-guide/manage-database-migrations
sidebar_label: "Manage database migrations"
sidebar_position: 7
description: "Create and apply database schema changes"
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Manage database migrations

Create and apply database schema changes across environments. GDI uses different migration tools depending on the component.

In this guide

> [Flyway migrations (DDS/AMS)](#flyway-migrations-ddsams)  
> [CKAN migrations](#ckan-migrations)  
> [CKAN labels](#ckan-labels)

<!-- TODO: Add REMS migrations to guide outline once information is available -->

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

Flyway applies migrations automatically on startup, or run manually via:

```bash
./mvnw flyway:migrate
```

## CKAN migrations

See [CKAN documentation<sup>↗</sup>](https://docs.ckan.org/en/2.9/contributing/database-migrations.html) for Alembic migrations.

## CKAN labels

CKAN labels use a versioned migration system for managing term translations in the `term_translation` table. 

The extension stores migrations in `ckanext/gdi_userportal/migrations/versions/` and runs them automatically on container startup.

**Check migration status:**

```bash
ckan gdi-userportal translations status
```

**Run migrations manually:**

```bash
ckan gdi-userportal translations migrate
```

For detailed documentation, see [term_translation_migrations.md<sup>↗</sup>](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal/blob/main/docs/term_translation_migrations.md) in the [gdi-userportal-ckanext-gdi-userportal<sup>↗</sup>](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal) repository.

<!--
## REMS migrations

TODO: Pending information from reviewers
-->


