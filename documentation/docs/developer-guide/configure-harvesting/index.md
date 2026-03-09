---
title: Configure harvesting
sidebar_position: 4
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Configure harvesting

***NEW CONTENT NEEDED***

Learn how to configure automated data harvesting from external sources like FAIR Data Points and DCAT-AP endpoints.

## What you'll learn

- How CKAN harvesters work
- How to harvest from FAIR Data Points
- How to harvest from DCAT-AP endpoints
- How to set up nginx for RDF harvesting
- How harvester update strategies work

## Harvesting workflows by role

### Metadata Specialists

1. [Understand harvesters](./understand-harvesters.md) - Learn harvesting infrastructure
2. [Harvest FAIR Data Points](./harvest-fair-datapoints.md) - Configure FDP harvesting
3. [Harvest DCAT-AP](./harvest-dcat-ap.md) - Configure DCAT harvesting

### Platform Operators

1. [Understand harvesters](./understand-harvesters.md) - Harvester architecture
2. [Harvest FAIR Data Points](./harvest-fair-datapoints.md) - Automated harvesting
3. [Harvester update strategy](./harvester-update-strategy.md) - Understand updates

### Extension Developers

1. [Understand harvesters](./understand-harvesters.md) - Infrastructure details
2. [Set up nginx for RDF](./setup-nginx-for-rdf.md) - Local testing setup
3. [Harvester update strategy](./harvester-update-strategy.md) - Technical details

## Prerequisites

- CKAN instance up and running
- Harvester extensions installed (ckanext-harvest, ckanext-dcat, ckanext-fairdatapoint)
- Understanding of DCAT-AP and FAIR principles
- Access to source endpoints for harvesting

## Key concepts

### Harvesting Process

Harvesting involves three main stages:

1. **Gather stage**: Discovers resources at the source
2. **Fetch stage**: Retrieves detailed data for each resource
3. **Import stage**: Maps and stores data in CKAN

### Update Strategies

- **New**: Resources not previously harvested
- **Change**: Resources with modifications
- **Delete**: Resources no longer available at source

## Next steps

- **[Understand harvesters](./understand-harvesters.md)** - Learn how harvesters work
- **[Harvest FAIR Data Points](./harvest-fair-datapoints.md)** - Set up FDP harvesting
- **[Harvest DCAT-AP](./harvest-dcat-ap.md)** - Set up DCAT harvesting
