---
slug: /developer-guide/harvester-overview
sidebar_label: "Harvester overview"
sidebar_position: 1
description: Fair Data Point harvester stages and GUID handling
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Harvester overview

The Fair Data Point harvester in CKAN processes datasets through three stages: 

- `gather_stage`
- `fetch_stage`
- `import_stage`

## Gather stage

During `gather_stage`, the harvester requests all available resources from a source and generates a unique guid for each resource.

- ### GUID generation 

    The harvester generates the following GUIDs:

    - for a catalog `catalog=<FDP link to a catalog>`
    - for a dataset `catalog=<FDP link to the dataset's parent catalog>;dataset=<FDP link to a dataset>`

    where `FDP link to a catalog/dataset` is an FDP reference URL (subject URL) of the resource. 
    
    For example, for this dataset: https://health-ri.sandbox.semlab-leiden.nl/dataset/d7129d28-b72a-437f-8db0-4f0258dd3c25, the 
     CKAN harvester GUID will be: 
    ```
    catalog=https://health-ri.sandbox.semlab-leiden.nl/catalog/e3faf7ad-050c-475f-8ce4-da7e2faa5cd0;dataset=https://health-ri.sandbox.semlab-leiden.nl/dataset/d7129d28-b72a-437f-8db0-4f0258dd3c25
    ```
 

- ### Status assignment

    The harvester queries CKAN database for guids harvested from the same source before:

    ```sql
    SELECT harvest_object.guid AS harvest_object_guid, harvest_object.package_id AS harvest_object_package_id 
    FROM harvest_object 
    WHERE harvest_object.current = true AND harvest_object.harvest_source_id = %(harvest_source_id_1)s
    ```

    where `harvest_source_id_1` is the harvester source id of the current job.

    Based on these two lists of guids, a harvest object is created and assigned with status `delete`, `new` or `change`:
    - `delete = guids_in_db - guids_in_harvest` where `guids_in_db` are ids from CKAN `harvest_object` table for a given source (the result of the query above)
    - `new` = resources that appear in the harvest but not in the database
    - `change` = resources that exist in both with potential updates

    For resources marked as `delete`, the harvester sets the status of harvest objects to `'current': False`, so they stay in the database but are not shown.

## Fetch stage

During `fetch_stage`, data for resources with `new` or `change` status are collected and parsed from the source.

## Import stage

During `import_stage`, resources are deleted, updated, or inserted to the CKAN database based on the harvest object status:
- `delete`: The harvester deletes datasets by calling `toolkit.get_action('package_delete')(context, {ID: harvest_object.package_id})`
- `new`: Datasets are inserted into CKAN
- `change`: Existing datasets are updated with new metadata

Based on the [CKAN documentation](https://github.com/ckan/ckanext-harvest?tab=readme-ov-file#avoid-overwriting-certain-fields-optional), it is possible to configure a CKAN instance to prevent updating of certain fields.

:::info Note

- CKAN treats datasets as "new" if you delete and reconfigure their harvester source.
- If deletion fails during the `import_stage`, the dataset remains hidden in the database permanently.
- When you move a dataset between catalogues in FDP (by updating `DCTERMS.isPartOf`), CKAN treats it as a new dataset because the GUID includes the catalogue id.

:::