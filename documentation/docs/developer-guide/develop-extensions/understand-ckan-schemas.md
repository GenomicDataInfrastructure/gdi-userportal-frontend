---
title: Understand CKAN schemas
sidebar_position: 2
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI
SPDX-FileContributor: PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Understand CKAN schemas

Understand CKAN scheming strategy and learn how to configure, replace, and maintain dataset schemas.

## Schema format and field definitions

A CKAN schema can be defined either as a JSON or YAML file. Whilst the official documentation contains many YAML references, the GDI project uses .json schemas.

A field in a CKAN schema .json file has the following format:

```json
{
  "field_name": "license_id",
  "label": "Licence",
  "form_snippet": "license.html",
  "help_inline": true,
  "help_text": {
    "en": "[dct:license] This property refers to the licence under which the Dataset is made available.",
    "nl": "[dct:license] Deze eigenschap heeft betrekking op de licentie waaronder de Dataset beschikbaar wordt gesteld."
  }
}
```

Where:

* `field_name` is the CKAN field identifier
* `label` is the UI field representation
* `help_text` is text appearing under a field in the UI next to the `i` icon. Square brackets contain information about how this field maps to DCAT-AP

**Official documentation**: [CKAN GitHub repository - Field keys](https://github.com/ckan/ckanext-scheming/tree/release-3.0.0#field-keys)

## Available field keys

### Core Field Keys

* **`repeating_subfields`** - Useful to resolve cardinality issues
* **`start_form_page`** - Refers to stages on the create dataset page and manages which field will appear on which stage
* **`choices`** - For a drop-down - a list of dictionaries with a value and label
* **`choices_helper`** - Form a drop-down dynamically or from an API. It's possible to point to another schema and take a field from there
* **`presets`** - Values like `radio`, `multiple_checkbox`, `date` - to enable automatic checks without defining snippets

### UI Interaction Keys

* **`form_snippet`** - Interacts with CKAN UI, defines a field representation (related to data input). Use when you don't want to use presets or want more control. Uses jinja2-based format
* **`display_snippet`** - Interacts with CKAN UI, defines how data is shown in the UI (e.g., showing an e-mail as a "mail to" link)
* **`display_property`** - Useful to override representation, e.g., for DCAT mapping:

```json
{
  "field_name": "author",
  "label": "Author",
  "display_property": "dc:creator"
}
```

### Validation Keys

* **`validators`** - Validate data. Available functions are listed in the [official documentation](https://docs.ckan.org/en/2.9/extensions/validators.html). It's possible to add custom validators. By default there is almost no validation (`ignore_missing` and `unicode`). If specifying a custom validator, these two basic ones must be added explicitly.

  To create custom validators:
  1. Implement an extension extending the `IValidators` interface
  2. The `get_validators()` method returns a custom validation function
  3. See [validation functions documentation](https://docs.ckan.org/en/2.9/extensions/validators.html)

* **`output_validators`** - Complex data structures assigned to a field are converted to a string in the database. This field defines a validator for extracting the field from the database and re-converting to an object.

## Change schema in a running CKAN instance

The schema used is defined in `setup_scheming.sh`:

```bash
ckan config-tool $CKAN_INI -s app:main \
    "scheming.dataset_schemas = ckanext.healthri:scheming/schemas/gdi_userportal.json"\
    "scheming.presets = ckanext.scheming:presets.json"\
    "scheming.dataset_fallback = false"
```

Where `ckan config-tool` is part of [CKAN Command Line Interface](https://docs.ckan.org/en/2.9/maintaining/cli.html#). For more information on `config-tool` usage, review the [documentation](https://docs.ckan.org/en/2.9/maintaining/cli.html#config-tool-tool-for-editing-options-in-a-ckan-config-file).

### In a Running Docker Container

In a running Docker container, the schema is defined in configuration file `srv/app/ckan.ini` in parameter `scheming.dataset_schemas`. It should refer to an extension under the `/src/` directory of the `ckan-docker` repository.

To replace the schema:

```bash
docker exec -it ckan /bin/sh
vi /srv/app/ckan.ini # change the schema
```

A change of the `ckan.ini` file triggers a CKAN update, so changes will be applied almost immediately.

### Schema Path Format

A schema should be defined in the following format:

```
<extension name with dashes replaced with dots>:<path to schema .json file>
```

The extension is expected to be cloned under `/ckan-docker/src`.

For example, the path `ckanext.healthri:scheming/schemas/gdi_userportal.json` resolves to:

![Schema structure](/img/developer-guide/scheming.png)

## Multi-schema declaration

[IDatasetForm](https://docs.ckan.org/en/2.9/extensions/adding-custom-fields.html#) is an interface that scheming uses to override schemas.

### Option 1: In ckan.ini File

In `scheming.dataset_schemas`, multiple space-separated values can be defined. Behaviour differs between CKAN core and CKAN Civity-extended:

- **CKAN core**: If two schemas have the same `dataset_type` field, the system picks up the latest
- **Civity-extended**: Two schemas of the same type are merged. The order of schemas specified in `scheming.dataset_schemas` will be reflected in the order of fields in the CKAN UI

Another ckan.ini parameter is `ckanext.scheming.overwrite_fields`, which defines merging rules:

- If set to `true` and schemas to merge have the same fields, definitions from the latest one are prioritised
- Fields are never deleted, only added or modified
- To delete a field, you must undeclare it or set it to empty explicitly

This behaviour is implemented in `ckanext-scheming/ckanext/scheming/plugins.py` (`_combine_schemas`) and documented at code level only.

### Option 2: In a Multi-Schema Declaration .json File

For maintenance purposes, instead of managing schemas in ckan.ini, you can provide a .json configuration file under `ckanext-healthri/ckanext/healthri/scheming/schemas/`:

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

This also allows having several schemas simultaneously:

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

In ckan.ini, add a property `scheming.dataset_multi_schemas` with the path to the file:

```ini
scheming.dataset_multi_schemas = ckanext.healthri:scheming/schemas/multi_schemas.json
```

**Reference**: [Civity documentation on multiple schemas configuration](https://github.com/CivityNL/ckanext-scheming/tree/release-3.0.0-civity#configuration)

## Query schemas via API

You can control which datasets are declared via API:

```bash
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_list
```

Then query a specific schema:

```bash
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_show?type=<dataset_type>
```

UI search of all dataset types is configured in the `ckan.search.show_all_types` parameter. See [search settings documentation](https://docs.ckan.org/en/latest/maintaining/configuration.html#search-settings).

## Next steps

- [Test extensions](./test-extensions.md) - Learn testing strategies
- [Add metadata fields](../work-with-metadata/add-new-metadata-fields.md) - Extend schemas
- [CKAN resources](./ckan-resources.md) - Access documentation
