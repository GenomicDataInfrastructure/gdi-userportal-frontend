---
slug: /system-admin-guide/configure-schemas
sidebar_label: "Configure metadata schemas"
sidebar_position: 9
---

# Configure metadata schemas

Configure and manage CKAN **metadata schemas** to define dataset fields, validation rules, and data entry forms. This guide covers schema development, deployment, and maintenance for system administrators.

## Schema structure and format

Define CKAN schemas as JSON or YAML files that specify dataset metadata fields and their properties.

### Example field definition

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

## Key field properties

Configure field behaviour using these properties:

- **field_name**: CKAN field identifier that defines the field in the database
- **label**: UI field representation that displays to end users
- **help_text**: Explanatory text that appears under the field in the UI
- **choices**: List of dictionaries with value and label for dropdown menus
- **choices_helper**: Generates form dropdowns dynamically from API endpoints
- **presets**: Validation presets like `radio`, `multiple_checkbox`, and `date` for automatic checks
- **form_snippet**: Defines field representation for data input in Jinja2 format
- **display_snippet**: Defines how the system displays data in the UI
- **validators**: Data validation functions that enforce field requirements
- **output_validators**: Functions that convert complex data structures from the database
- **repeating_subfields**: Handles cardinality requirements for multi-value fields
- **start_form_page**: Controls which form page displays the field
- **display_property**: Overrides the DCAT mapping representation for a field

Example with `display_property`:

```json
{
  "field_name": "author",
  "label": "Author",
  "display_property": "dc:creator"
}
```

:::info Default validation

Default validation includes `ignore_missing` and `unicode`. When you specify custom validators, include these explicitly if you need them.

:::

## Schema configuration

Configure your CKAN instance to use the defined schemas for dataset metadata management.

### Single schema setup

Configure your primary schema in CKAN configuration:

```bash
ckan config-tool $CKAN_INI -s app:main \
    "scheming.dataset_schemas = ckanext.healthri:scheming/schemas/gdi_userportal.json"\
    "scheming.presets = ckanext.scheming:presets.json"\
    "scheming.dataset_fallback = false"
```

### Multiple schema support

Configure multiple schemas using a declaration file for different dataset types:

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
    "about_url": "https://dataplatform.nl/what-is-a-dataset",
    "schemas": ["ckanext.healthri:scheming/schemas/geo_document.json"]
  }
]
```

Reference the multi-schema file in `ckan.ini`:

```ini
scheming.dataset_multi_schemas = ckanext.healthri:scheming/schemas/multi_schemas.json
```

### Schema merging behaviour

The system handles schema merging differently based on the implementation:

- **Core CKAN**: The latest schema with the same `dataset_type` takes precedence over earlier definitions
- **GDI implementation**: The system merges schemas with the same type, and field order follows the schema order in the configuration
- **Field merging**: The `ckanext.scheming.overwrite_fields` parameter controls how the system merges individual fields

## Schema deployment

### Update running CKAN instance

Change the schema in a running Docker container:

```bash
docker exec -it ckan /bin/sh
vi /srv/app/ckan.ini # change the schema
```

The system automatically updates CKAN when you make changes to `ckan.ini`.

### Schema path format

Define schemas using the format: `<extension name with dashes replaced with dots>:<path to schema .json file>`

Example: `ckanext.healthri:scheming/schemas/gdi_userportal.json`

## Schema management APIs

Manage schemas programmatically using CKAN APIs:

```bash
# List all dataset schema types
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_list

# Get specific schema details
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_show?type=<dataset_type>
```

## Best practices

Follow these practices when designing and deploying schemas.

### Schema design

- **Follow DCAT-AP standards**: Ensure interoperability with other data catalogues
- **Design for user experience**: Prioritise usability over technical complexity
- **Include comprehensive help text**: Provide clear guidance for complex fields
- **Test with real users**: Validate schemas with actual users before deployment

### Deployment

- **Test in development first**: Validate schema changes in a development environment before production
- **Document modifications**: Record all schema changes for audit trails and troubleshooting
- **Consider migration impact**: Assess how schema changes affect existing datasets
- **Back up data**: Create backups before applying major schema updates

For comprehensive schema development, see the [CKAN scheming documentation](https://github.com/ckan/ckanext-scheming/tree/release-3.0.0#field-keys).

:::tip Next steps

After configuring schemas:

- [Manage user roles and permissions](/system-admin-guide/manage-user-roles): Control access to schema management
- [Manage data and services](/system-admin-guide/manage-data-services): Configure data workflows
- [Monitor and maintain the system](/system-admin-guide/monitor-maintain): Track schema usage and performance

:::
