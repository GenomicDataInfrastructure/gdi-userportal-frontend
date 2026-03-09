---
title: Work with metadata
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Work with metadata

***NEW CONTENT NEEDED***

Learn how to work with metadata in the GDI User Portal, including understanding metadata structure, adding new fields, and configuring FAIR Data Points.

## What you'll learn

- How metadata is stored and structured in CKAN
- How to add new metadata fields across the system
- How to configure FAIR Data Point with GDI-specific SHACL shapes
- What metadata fields are currently supported

## Metadata workflows by role

### Metadata Specialists

1. [Understand metadata structure](./understand-metadata-structure.md) - Learn how data is stored
2. [Add new metadata fields](./add-new-metadata-fields.md) - Extend the schema
3. [Supported metadata fields](./supported-metadata-fields.md) - Reference current fields

### Extension Developers

1. [Understand metadata structure](./understand-metadata-structure.md) - Database structure
2. [Add new metadata fields](./add-new-metadata-fields.md) - Complete implementation process
3. [Configure FAIR Data Point](./configure-fair-datapoint.md) - SHACL shapes

### Platform Operators

1. [Configure FAIR Data Point](./configure-fair-datapoint.md) - Set up FDP
2. [Supported metadata fields](./supported-metadata-fields.md) - View available fields

## Prerequisites

- Understanding of DCAT-AP metadata standards
- Familiarity with RDF and SHACL (for FDP configuration)
- Knowledge of CKAN schema structure
- Access to development environment

## Key concepts

### Metadata Storage

CKAN stores metadata in two tables:
- **package** table: Core CKAN fields
- **package_extra** table: Extended fields (serialised as strings)

### Metadata Standards

GDI User Portal supports:
- DCAT-AP 3.0
- FAIR Data Point metadata
- Custom GDI-specific fields

## Next steps

- **[Understand metadata structure](./understand-metadata-structure.md)** - Learn storage patterns
- **[Add new metadata fields](./add-new-metadata-fields.md)** - Extend schemas
- **[Configure FAIR Data Point](./configure-fair-datapoint.md)** - Set up FDP
