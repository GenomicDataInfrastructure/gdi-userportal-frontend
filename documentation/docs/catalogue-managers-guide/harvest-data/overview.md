---
slug: /catalogue-managers-guide/harvest-data/overview
sidebar_label: "Overview"
sidebar_position: 1
---

# Harvest overview

In this guide

> [Overview](#overview)  
> [Supported data sources](#supported-data-sources)  
> [How it works](#how-it-works)  
> [Get started](#get-started)

## Overview

Harvest datasets automatically from external sources into your catalogue. This eliminates manual data entry and keeps your catalogue synchronized with remote data sources.

:::info GDI-SPECIFIC FEATURE

Data harvest is a **unique feature of the GDI Data Catalogue**. This functionality is not part of standard CKAN and has been specifically developed for the GDI ecosystem.

:::

## Supported data sources

The GDI Data Catalogue supports harvest from multiple data source types:

- **FAIR Data Points** - Harvest from FAIR Data Point implementations
- **DCAT-AP endpoints** - Collect standardized metadata from European data portals
- **CKAN instances** - Synchronize with other CKAN catalogues
- **Custom API endpoints** - Integrate with custom data sources

## How it works

When you set up a harvest source:

1. **Initial harvest** - The harvester connects to the remote source and imports all available datasets
2. **Scheduled updates** - The harvester checks for updates at regular intervals
3. **Automatic synchronization** - New, updated, or deleted datasets sync to your catalogue
4. **Data Portal publication** - Harvested datasets appear in the GDI Data Portal based on visibility settings

## Get started

Follow these guides to set up harvest:

1. **[Set up a harvest source](./setup.md)** - Configure your first harvest source
2. **[Technical specifications](./technical-specs.md)** - Understand harvest timing and behavior
3. **Source-specific guides** - [FAIR Data Points](./fair-data-points.md) | [DCAT-AP](./dcat-ap.md) | [CKAN instances](./ckan-sources.md)
4. **[Troubleshoot](./troubleshoot.md)** - Resolve common issues
5. **[Manage sources](./manage-sources.md)** - Edit, pause, or delete harvest sources
