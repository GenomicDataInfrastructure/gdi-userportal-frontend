---
title: Understand metadata structure
sidebar_position: 1
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI
SPDX-FileContributor: PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Understand metadata structure

Understand how metadata is structured and stored in CKAN databases.

## Dataset tables

Every field which extends the core schema lands in the extra table.

In the CKAN database schema:
- **`package` table**: Contains columns for core fields of CKAN
- **`package_extra` table**: Contains all other fields

The Scheming extension allows more flexibility for managing extra fields than CKAN core default functionality, but such fields are still converted to a string and stored in the extra table.

![Metadata mapping](/img/developer-guide/mapping.png)

## DCAT extension integration

It is possible to write a mapper to map all the extra fields. For DCAT there is an official extension:

**[ckanext-dcat JSON DCAT Harvester](https://github.com/ckan/ckanext-dcat#json-dcat-harvester)**

This extension is compatible with DCAT-AP v1.1 and 2.1.

## Harvester tables

The database contains several tables dedicated to storing harvester-related information:

### harvest_source

The `harvest_source` table is where harvested sources are defined.

### harvest_object  

The `harvest_object` table stores all the objects from a source. Data from a source is stored in `harvest_object.content` and from there will be converted to a CKAN dataset.

Harvesters are also saved to the `package` table with `type` set to `harvest`.

## Re-indexing after database changes

Once you change something in the database directly, you must trigger re-indexing in Solr via search-index rebuild using the [CLI](https://docs.ckan.org/en/2.9/maintaining/cli.html):

```bash
ckan -c /etc/ckan/default/ckan.ini search-index rebuild
```

## Field serialisation

### Storage Behaviour

- **Core fields**: Stored directly in the `package` table columns
- **Extended fields**: Serialised to strings and stored in `package_extra` table
- **Complex objects**: Flattened to key-value pairs in `package_extra`

### Output Deserialisation

When retrieving data, output validators can be used to convert serialised strings back to objects. Configure these in your schema using the `output_validators` field key.

## Next steps

- [Add new metadata fields](./add-new-metadata-fields.md) - Extend the schema
- [Understand CKAN schemas](../develop-extensions/understand-ckan-schemas.md) - Schema structure
- [Configure harvesting](../configure-harvesting/index.md) - Set up harvesters
