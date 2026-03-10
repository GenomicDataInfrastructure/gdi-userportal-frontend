---
slug: /developer-guide/understand-the-codebase/explore-ckan-architecture
sidebar_label: "Explore CKAN architecture"
sidebar_position: 3
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

CKAN is an open-source data catalogue platform. The GDI platform extends CKAN with custom plugins for DCAT-AP 3 support, OIDC authentication, and harvesting.

## CKAN extension structure

```
ckanext-gdi-userportal/
├── ckanext/
│   └── gdi_userportal/
│       ├── plugin.py               # Main plugin implementation
│       ├── scheming/               # Schema definitions
│       │   └── schemas/
│       │       └── gdi_userportal.json  # DCAT-AP 3 schema
│       ├── templates/              # Jinja2 templates
│       ├── auth.py                 # Authentication logic
│       ├── validators.py           # Field validators
│       └── helpers.py              # Template helper functions
├── setup.py                        # Python package config
└── test/                           # pytest tests
```

## Key concepts

### IPlugin interface
CKAN extensions implement the `IPlugin` interface to hook into CKAN's core functionality.

### Scheming extension
GDI uses `ckanext-scheming` to define custom metadata schemas in JSON/YAML format.

### Templates
Jinja2 templates override CKAN's default UI.

### Validators
Custom validators ensure data quality for metadata fields.

### Database
See [Understand database structure](./understand-database-structure/) for details on CKAN's PostgreSQL schema.
