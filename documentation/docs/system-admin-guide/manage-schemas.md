---
slug: /system-admin-guide/manage-schemas
sidebar_label: "Manage schemas"
sidebar_position: 3
---

# Manage schemas

:::info content in progress

We are working on this guide.

:::


Learn how to configure and manage CKAN dataset schemas for the GDI User Portal. This guide covers schema format, field definitions, and deployment procedures.

## Schema format and field definitions

A CKAN schema can be defined either as JSON or YAML file. The GDI User Portal uses JSON schemas for consistency.

### Field structure

A field in CKAN schema JSON file has the following format:

```json
{
  "field_name": "license_id",
  "label": "License",
  "form_snippet": "license.html",
  "help_inline": true,
  "help_text": {
    "en": "[dct:license] This property refers to the licence under which the Dataset is made available.",
    "nl": "[dct:license] Deze eigenschap heeft betrekking op de licentie waaronder de Dataset beschikbaar wordt gesteld."
  }
}
```

Where:
- **`field_name`** - CKAN field identifier
- **`label`** - UI field representation
- **`help_text`** - Text appearing under field in UI next to `i` icon. Square brackets contain DCAT-AP mapping information

### Field configuration options

Documentation on field keys and specifications can be found in the [CKAN Scheming documentation](https://github.com/ckan/ckanext-scheming/tree/release-3.0.0#field-keys).

Available field keys include:

- **`repeating_subfields`** - For handling cardinality requirements
- **`start_form_page`** - Controls field appearance on multi-stage forms
- **`choices`** - For dropdown lists (array of dictionaries with value and label)
- **`choices_helper`** - For dynamic dropdowns or API-driven choices
- **`presets`** - Built-in field types (`radio`, `multiple_checkbox`, `date`)
- **`form_snippet`** - Custom field representation (Jinja2-based format)
- **`display_snippet`** - Custom data display formatting
- **`display_property`** - Override representation for DCAT mapping

Example with display property:
```json
{
  "field_name": "author",
  "label": "Author",
  "display_property": "dc:creator"
}
```

### Validation configuration

- **`validators`** - Data validation functions. Available functions listed in [CKAN validators documentation](https://docs.ckan.org/en/2.9/extensions/validators.html)
- **`output_validators`** - Convert complex data structures from database storage back to objects

**Important**: Default validation includes `ignore_missing` and `unicode`. When specifying custom validators, include these explicitly if needed.

## Changing schemas in running instance

### Schema configuration

Schema is defined in setup scripts by setting:

```bash
ckan config-tool $CKAN_INI -s app:main \
    "scheming.dataset_schemas = ckanext.healthri:scheming/schemas/gdi_userportal.json"\
    "scheming.presets = ckanext.scheming:presets.json"\
    "scheming.dataset_fallback = false"
```

### Runtime schema changes

In running Docker container, schema is configured in `/srv/app/ckan.ini`:

```bash
docker exec -it ckan /bin/sh
vi /srv/app/ckan.ini # modify scheming.dataset_schemas parameter
```

Configuration changes trigger automatic CKAN updates.

### Schema path format

Schema paths follow format: `<extension.name>:<path/to/schema.json>`

Example: `ckanext.healthri:scheming/schemas/gdi_userportal.json` resolves to extension directory structure under `/ckan-docker/src`

## Multi-schema configuration

### Configuration file approach

For better maintainability, create a JSON configuration file under extension schemas directory:

```json
[
  {
   "dataset_type": "dataset",
   "about": "Dataset",
   "about_url": "https://dataplatform.nl/what-is-a-dataset",
   "schemas": [
      "ckanext.healthri:scheming/schemas/core_schema.json",
      "ckanext.healthri:scheming/schemas/health_ri.json"
    ]
  }
]
```

### Multiple dataset types

Support for multiple schema types:

```json
[
  {
   "dataset_type": "dataset",
   "about": "Dataset",
   "about_url": "https://dataplatform.nl/what-is-a-dataset",
   "schemas": [
      "ckanext.healthri:scheming/schemas/core_schema.json",
      "ckanext.healthri:scheming/schemas/health_ri.json"
    ]
  },
  {
   "dataset_type": "geo_dataset",
   "about": "Geo Document",
   "about_url": "https://dataplatform.nl/what-is-a-geo-document",
   "schemas": [
      "ckanext.healthri:scheming/schemas/geo_document.json"
    ]
  }
]
```

Configure in `ckan.ini`:
```
scheming.dataset_multi_schemas = ckanext.healthri:scheming/schemas/multi_schemas.json
```

### Schema merging behaviour

- **Core CKAN**: Latest schema with same `dataset_type` takes precedence
- **GDI implementation**: Schemas with same type are merged, field order follows schema order in configuration
- **Field merging**: Controlled by `ckanext.scheming.overwrite_fields` parameter
  - `true`: Latest field definitions take precedence
  - Fields are never deleted, only added or modified
  - To remove fields, explicitly undeclare or set to empty

## API management

### List available schemas

```bash
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_list
```

### Get specific schema

```bash
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_show?type=<dataset_type>
```

### Search configuration

Control dataset type visibility in search with:
```
ckan.search.show_all_types = true
```
