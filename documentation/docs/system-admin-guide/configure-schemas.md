---
slug: /system-admin-guide/configure-schemas
sidebar_label: "Configure metadata schemas"
sidebar_position: 7
---

# Configure metadata schemas

Configure and manage CKAN metadata schemas to define dataset fields, validation rules, and data entry forms. This guide covers schema development, deployment, and maintenance for system administrators.

## Schema structure and format

CKAN schemas can be defined as JSON or YAML files that specify dataset metadata fields and their properties.

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

- **field_name**: CKAN field identifier
- **label**: UI field representation for end users
- **help_text**: Explanatory text appearing under field in UI
- **choices**: For dropdown menus - list of dictionaries with value and label
- **choices_helper**: Form dropdowns dynamically from API
- **presets**: Values like `radio`, `multiple_checkbox`, `date` for automatic checks
- **form_snippet**: Defines field representation for data input (jinja2 format)
- **display_snippet**: Defines how data is shown in UI
- **validators**: Data validation functions
- **output_validators**: Convert complex data structures from database

## Schema configuration

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

## Schema deployment

### Update running CKAN instance

To change schema in a running Docker container:

```bash
docker exec -it ckan /bin/sh
vi /srv/app/ckan.ini # change the schema
```

Changes to `ckan.ini` trigger automatic CKAN updates.

### Schema path format

Define schemas using the format: `<extension name with dashes replaced with dots>:<path to schema .json file>`

Example: `ckanext.healthri:scheming/schemas/gdi_userportal.json`

## Schema management APIs

Use CKAN APIs to manage schemas programmatically:

```bash
# List all dataset schema types
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_list

# Get specific schema details
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_show?type=<dataset_type>
```

## Best practices

### Schema design

- Follow DCAT-AP standards for interoperability
- Design for user experience, not just technical requirements
- Include comprehensive help text for complex fields
- Test schemas with real users before deployment

### Deployment

- Test schema changes in development environment first
- Document all schema modifications
- Consider migration impact on existing datasets
- Backup data before major schema updates

For comprehensive schema development, see the [CKAN scheming documentation](https://github.com/ckan/ckanext-scheming/tree/release-3.0.0#field-keys).

## Next steps

After configuring schemas:

- [Manage user roles and permissions](/system-admin-guide/manage-user-roles) - Control access to schema management
- [Manage data and services](/system-admin-guide/manage-data-services) - Configure data workflows
- [Monitor and maintain the system](/system-admin-guide/monitor-maintain) - Track schema usage and performance
