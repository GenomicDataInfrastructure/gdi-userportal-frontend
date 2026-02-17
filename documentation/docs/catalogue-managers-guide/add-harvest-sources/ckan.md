---
slug: /catalogue-managers-guide/add-harvest-sources/ckan
sidebar_label: "CKAN catalogues"
sidebar_position: 4
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Harvest from CKAN catalogues

Synchronise datasets from other CKAN catalogues to enable cross-institutional collaboration and maintain distributed dataset collections.

:::tip CKAN-to-CKAN harvesting
The GDI Data Catalogue is powered by CKAN. CKAN-to-CKAN harvesting is implemented in the core system, making it straightforward to harvest from other CKAN instances.
:::

## Configure the CKAN source

When [adding a harvest source](./index.md), use these settings for CKAN catalogues:

| Field             | Description                                      |
| ----------------- | ------------------------------------------------ |
| **Source type**   | Select **CKAN** from the dropdown                |
| **URL**           | Enter the CKAN instance API endpoint URL         |
| **Configuration** | Leave empty unless specific filters are required |

## Next steps

- [Test harvest sources](../test-harvest-sources.md)
- [Monitor harvest sources](../monitor-harvest-sources.md)
- [Manage harvest sources](../manage-harvest-sources.md)
