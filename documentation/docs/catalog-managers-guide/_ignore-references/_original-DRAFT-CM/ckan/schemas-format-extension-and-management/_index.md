---
title: Schemas format, extension and management
---
<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI
SPDX-FileContributor: PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

This document describes CKAN scheming strategy and ways to configure, replace and maintain dataset schemas.

### Schema format and fields definitions

A CKAN schema can be difined either as JSON or YAML file. Civity keeps using .json schemas but in the official documentation there are a lot of yaml references as well.

A field in CKAN schema .json file can be of the following format:

```java
{
  "field_name": "license_id",
  "label": "License",
  "form_snippet": "license.html",
  "help_inline": true,
  "help_text": {
    "en": "[dct:license] This property refers to the licence under which the Dataset is made available.",
    "nl": "[dct:license] Deze eigenschap heeft betrekking op de licentie waaronder de Dataset beschikbaar wordt gesteld."
}
```

where

* `field_name` is CKAN field id
* `label` is UI field representation
* `help_text` is a text appearing under a field in the UI next to `i` icon, square brackets are omitted and in this particular example contain information about how this field maps to DCAT-AP. More about these mapping and custom fields read [CKAN DB Structure and Fields Mapping Strategy](https://health-ri.atlassian.net/wiki/spaces/HD/pages/184811642/WIP+CKAN+DB+Structure+and+Fields+Mapping+Strategy).

Documentation on field keys and other schemas specifications can be found in the [CKAN GitHub official repository.](https://github.com/ckan/ckanext-scheming/tree/release-3.0.0#field-keys)

Other possible fields keys are:

* `repeating_subfields` - maybe useful to solve cardinality issue, not used by Civity.
* `start_form_page` - not used by Civity, added recently, refers to stages on create dataset page and manages which field will appear on which stage.
* `choices` - for a drop-down - a list of dictionaries with a value and label.
* `choices_helper` - to form a drop-down dynamically or from an API. It is possible for example to point to another schema and take a field from there.
* `presets` - values like `radio`, `multiple_checkbox`, `date` - to enable automatic checks and not to define snippets.
* `form_snippet` - interacts with CKAN UI, defines a field representation (related to data input), if do not want to use presets or want to have more control. jinja2-based format.
* `display_snippet` - also interacts with CKAN UI, defines how data are shown in the UI, e.g. showing an e-mail as “mail to“ link etc.
* `display_property` - useful if you need to override representation, e.g. in case you have mapping to DCAT, then:

```java
- field_name: author
  label: Author
  display_property: dc:creator
```

* `validators` - to validate data. Available functions are listed in the [official documentation](https://docs.ckan.org/en/2.9/extensions/validators.html) and it is possible to add custom ones. By default there is almost no validation (ignore_missing (accepts if a value is missing) and unicode), if you are specifying a custom one - these two basic needs to be added explicitly. It is possible to write and configure a validation function of your own. To do so one needs to implement an extension where extend a `IValidators` interface so `get_validators()` method returns a custom validation function. See [validation functions documentation](https://docs.ckan.org/en/2.9/extensions/validators.html) for the reference.
* `output_validators` - complex data structures if assigned to a field are converted to a string in the DB, this field defines a validator on extracting the field from the DB and re-converting to an object.

### Changing schema in a running CKAN instance

Schema used is defined in `setup_scheming.sh` by setting

```bash
ckan config-tool $CKAN_INI -s app:main \
    "scheming.dataset_schemas = ckanext.healthri:scheming/schemas/gdi_userportal.json"\
    "scheming.presets = ckanext.scheming:presets.json"\
    "scheming.dataset_fallback = false"
```

where `ckan config-tool` is a part of [CKAN Command Line Interface](https://docs.ckan.org/en/2.9/maintaining/cli.html#). For more info on usage `config-tool` review [documentation](https://docs.ckan.org/en/2.9/maintaining/cli.html#config-tool-tool-for-editing-options-in-a-ckan-config-file).

Therefore in a running docker container it is defined in a configuration file `srv/app/ckan.ini` in parameter `scheming.dataset_schemas` It should refer to an extension under `/src/` directory of `ckan-docker` repository.

To replace the schema run

```bash
docker exec -it ckan /bin/sh
vi /srv/app/ckan.ini # change the schema
```

A change of `ckan.ini` file triggers ckan update so changes will be applied almost immediately.

A schema should be defined in the following format: `<extension name with dashes replaced with dots>`:`<path to shema .json file>` the extension is expected to be cloned under `/ckan-docker/src`

e.g. the path from the example above (`ckanext.healthri:scheming/schemas/gdi_userportal.json`) resolves to the following:

![Scheming](./scheming.png)

### Multischeming declaration

[IDatasetForm](https://docs.ckan.org/en/2.9/extensions/adding-custom-fields.html#) is an interface scheming is taking charge of to override schemas.

#### 1. In CKAN.ini file

In `scheming.dataset_schemas` multiple (space-separated) values can be defined. Behaviour for CKAN core and CKAN Civity-extended differs in a way that for core CKAN if two schemas have the same `dataset_type` field, the system will pick up the latest. Civity improved this so two schemas of the same type are merged, the order of schemas specified in `scheming.dataset_schemas` will be reflected in order of fields in the CKAN UI.

Another ckan.ini parameter is `ckanext.scheming.overwrite_fields` defines rules for merging. If set to `true` and if schemas to merge have the same fields, definitions from the latest one will be prioritized. Fields are never deleted though, only can be added or modified. To delete a field you need to undeclared a field or set to empty explicitly. This behaviour is implemented as part of `ckanext-scheming/ckanext/scheming/plugins.py` (`_combine_schemas`)and documented on code level only.

#### 2. In a Multischeming declaration .json file

Initially it was implemented by Civity to allow an extension to have it’s own schema which is merged into core schema.

For maintenance purposes instead of managing schemas in ckan.ini file it is possible to provide a .json config file under `ckanext-healthri/ckanext/healthri/scheming/schemas/` with a content like the following:

```java
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

This also allows to have several schemas at the same time, e.g.:

```java
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

In ckan.ini file a property `scheming.dataset_multi_schemas` with a path to the file with schemas should be added, e.g.:

```
scheming.dataset_multi_schemas = ckanext.healthri:scheming/schemas/multi_schemas.json
```

[Civity documentation on multiple schemas configuration.](https://github.com/CivityNL/ckanext-scheming/tree/release-3.0.0-civity#configuration)

It is possible to control which datasets are declared via API:

```java
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_list
```

and then

```java
GET http(s)://<ckan-host>/api/action/scheming_dataset_schema_show?type=<dataset_type>
```

UI search of all dataset types is configured in `ckan.search.show_all_types` parameter (see [documentation](https://docs.ckan.org/en/latest/maintaining/configuration.html#search-settings)).
