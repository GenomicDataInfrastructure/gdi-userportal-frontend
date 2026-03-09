---
title: Harvester update strategy
sidebar_position: 5
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# FAIR data point harvester update strategy

Understand how the FAIR Data Point harvester determines whether resources are new, changed, or deleted.

## Harvester stages

As [mentioned previously](./understand-harvesters.md), a CKAN harvester must implement `gather_stage`, `fetch_stage`, and `import_stage`.

## GUID generation

During `gather_stage`, the FAIR Data Point harvester requests all available resources from a source.

For each resource, a unique GUID is generated:

- **For a catalogue**: `catalog=<FDP link to a catalog>`
- **For a dataset**: `catalog=<FDP link to the dataset's parent catalog>;dataset=<FDP link to a dataset>`

Where `FDP link to a catalog/dataset` is an FDP reference URL (subject URL) of the resource.

### Example

For the dataset:  
`https://health-ri.sandbox.semlab-leiden.nl/dataset/d7129d28-b72a-437f-8db0-4f0258dd3c25`

The CKAN harvester GUID will be:  
`catalog=https://health-ri.sandbox.semlab-leiden.nl/catalog/e3faf7ad-050c-475f-8ce4-da7e2faa5cd0;dataset=https://health-ri.sandbox.semlab-leiden.nl/dataset/d7129d28-b72a-437f-8db0-4f0258dd3c25`

## Querying existing resources

The harvester queries the CKAN database for GUIDs harvested from the same source before:

```sql
SELECT harvest_object.guid AS harvest_object_guid, 
       harvest_object.package_id AS harvest_object_package_id 
FROM harvest_object 
WHERE harvest_object.current = true 
  AND harvest_object.harvest_source_id = %(harvest_source_id_1)s
```

Where `harvest_source_id_1` is the harvester source ID of the current job.

## Determining resource status

Based on the two lists of GUIDs (from source and database), a harvest object is created and assigned one of three statuses:

- **new**: GUID exists in source but not in database
- **change**: GUID exists in both source and database (resource may have been modified)
- **delete**: GUID exists in database but not in source

## Processing updates

### fetch_stage

Data for **new** and **change** resources are collected and parsed during `fetch_stage`.

### import_stage

During `import_stage`, resources are:

- **Deleted**: Removed from CKAN
- **Updated**: Modified in CKAN database
- **Inserted**: Added to CKAN database

The action depends on the harvester object status.

## Preventing field overwrites

As per the [ckanext-harvest documentation](https://github.com/ckan/ckanext-harvest?tab=readme-ov-file#avoid-overwriting-certain-fields-optional), it is possible to configure a CKAN instance to prevent updating of certain fields.

## Dataset deletion process

### gather_stage

GUIDs of datasets to delete are defined as:

```
delete = guids_in_db - guids_in_harvest
```

Where `guids_in_db` are IDs from the CKAN `harvest_object` table for a given source (result of the query above).

After identifying datasets to delete, the harvester sets the status of harvest objects to delete to `'current': False`. These datasets stay in the database but are not shown.

### import_stage

During `import_stage`, the harvester actually deletes those datasets by calling:

```python
toolkit.get_action('package_delete')(context, {ID: harvest_object.package_id})
```

## Important caveats

### Datasets Considered "New"

Datasets will be considered "new" if you:
1. Configure a harvester source in CKAN
2. Delete it
3. Re-configure it

The harvester will treat all resources as new on the first run after re-configuration.

### Failed Deletion

If a dataset is set for deletion and something goes wrong during the `import_stage`, the dataset stays forever as no longer current. Manual intervention may be required to clean up.

### Catalogue Changes

If a dataset is moved in FDP from one catalogue to another catalogue (by updating the `DCTERMS.isPartOf` reference on the dataset level), it will be considered a new one.

**Reason**: A GUID of a CKAN harvested resource (unlike FDP itself) includes the catalogue ID. Changing the parent catalogue creates a new GUID, so CKAN treats it as a different resource.

## Best practices

### Avoid Re-configuring Harvesters

Instead of deleting and re-creating harvest sources, update the existing harvest source configuration.

### Monitor Failed Deletions

Regularly check for datasets with `'current': False` that haven't been properly deleted:

```sql
SELECT * FROM harvest_object 
WHERE current = false 
  AND package_id IS NOT NULL;
```

### Maintain Stable Catalogue Structure

Avoid moving datasets between catalogues in FDP, as this creates duplicate entries in CKAN.

## Next steps

- [Harvest FAIR Data Points](./harvest-fair-datapoints.md) - Set up FDP harvesting
- [Harvest DCAT-AP](./harvest-dcat-ap.md) - Set up DCAT harvesting
- [Understand harvesters](./understand-harvesters.md) - Learn harvester architecture
