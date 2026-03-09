---
title: Understand harvesters
sidebar_position: 1
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Understand CKAN harvesters

Learn how CKAN harvesters work and understand the harvesting infrastructure.

## Harvesting infrastructure

The basic harvest extension is publicly available and developed by the CKAN community: [ckanext-harvest](https://github.com/ckan/ckanext-harvest)

It defines basic infrastructure for harvesting—a process that receives an endpoint and tries to identify how many objects are present, then sends each individual object to a fetch consumer which, in turn, tries to convert each object to a CKAN dataset or resource.

In core CKAN, CKAN-to-CKAN harvesting is implemented, which means a CKAN instance can harvest other CKAN instances.

## Harvester plugins

In CKAN harvest core [setup.py](https://github.com/ckan/ckanext-harvest/blob/master/setup.py), enabled [plugins](https://github.com/ckan/ckanext-harvest/blob/8ea4b1b4fb277046a0d8ba4f4c779e5c9e1fbd8b/setup.py#L31C17-L31C17) are listed:

* **`harvest=ckanext.harvest.plugin:Harvest`** - The harvesting infrastructure
* **`ckan_harvester=ckanext.harvest.harvesters:CKANHarvester`** - Basic harvester responsible for harvesting other CKANs

These settings define the choice of available source types in the UI when a new harvester is added.

## DCAT harvester

Among publicly available harvesters, DCAT harvester is used most often. The [DCAT RDF harvester](https://github.com/ckan/ckanext-dcat#rdf-dcat-harvester) is well-documented and can be referenced as an example of harvester configurations and code.

There are several harvesters in ckanext-dcat; they all extend the core harvester interface `HarvesterBase`.

## Three main harvesting stages

In the interface, three methods are of particular interest and define 80% of the harvesting process:

### 1. gather_stage

- Goes to the original URL and tries to define a single object
- Sends and saves it to the database as a harvester object (into the `harvest_object` table)

### 2. fetch_stage

-Checks what was saved with `gather_stage`
- If information is not complete, goes back to the source to fetch additional data

### 3. import_stage

- Maps data to CKAN fields
- This is the place to implement hooks for data preprocessing

## Harvester extension interface

All harvesters extend the `HarvesterBase` interface and must implement:

```python
class MyHarvester(HarvesterBase):
    def gather_stage(self, harvest_job):
        # Discover resources
        pass
    
    def fetch_stage(self, harvest_object):
        # Fetch details
        pass
    
    def import_stage(self, harvest_object):
        # Import to CKAN
        pass
```

## Example harvesters

### FAIR Data Point Harvester

- Extends the DCAT harvester
- Specifically designed for FAIR Data Point endpoints
- Uses DCAT-AP profiles for mapping

### DCAT-AP Harvester

- Supports DCAT-AP 1.1, 2.1, and 3.0
- Configurable profiles for different metadata standards
- Extensible for custom mappings

## Next steps

- [Harvest FAIR Data Points](./harvest-fair-datapoints.md) - Set up FDP harvesting
- [Harvest DCAT-AP](./harvest-dcat-ap.md) - Set up DCAT harvesting
- [Harvester update strategy](./harvester-update-strategy.md) - Understand updates
