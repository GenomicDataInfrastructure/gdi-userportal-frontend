---
slug: /catalogue-managers-guide/add-harvest-sources
sidebar_label: "Overview"
sidebar_position: 1
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Add harvest sources

Connect external data sources to automatically import and synchronise datasets into your GDI Data Catalogue. The process is the same for all source types—only the configuration differs.

In this guide

> [Identify your source type](#identify-your-source-type)  
> [Add a harvest source](#add-a-harvest-source)  
> [Configure source settings](#configure-source-settings)

## Identify your source type

The GDI Data Catalogue supports three harvest source types:

- **FAIR data points:** Import from research data repositories following FAIR principles. Example: [Health-RI](https://fair.healthinformationportal.eu/)<sup>↗</sup>
- **Generic DCAT RDF:** Import from European public sector data portals. Example: [OpenData.swiss](https://opendata.swiss)<sup>↗</sup>
- **CKAN catalogue:** Import from partner CKAN instances. Example: Partner institution catalogues, regional data hubs

## Add a harvest source

1. Go to **Harvest Sources** and select **Add Harvest Source**.

2. Fill out the harvest source form based on the source type you are connecting to.

   | Field                | Description                                                                                                                                                                                                                                                                                                    |
   | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **URL**              | The source endpoint URL. See the URL formats for different sources in the [source-specific pages](#configure-source-settings)                                                                                                                                                                                  |
   | **Title**            | A descriptive name for this harvest source                                                                                                                                                                                                                                                                     |
   | **Name**             | A unique URL-friendly identifier for this source. This becomes part of the harvest source's URL path.                                                                                                                                                                                                          |
   | **Source type**      | The appropriate harvester for your source. See the [source-specific configuration](#configure-source-settings) for your source type.                                                                                                                                                                           |
   | **Update frequency** | How often the harvest runs:<br/>• **Manual:** You must click **Reharvest** each time<br/>• **Daily:** Runs at the end of each day<br/>• **Weekly:** Runs at the end of each week<br/>• **Biweekly:** Runs every two weeks<br/>• **Monthly:** Runs at the end of each month<br/>• **Always:** Runs continuously |
   | **Configuration**    | Enter the [source-specific configurations](#configure-source-settings)                                                                                                                                                                                                                                         |
   | **Organisation**     | The organisation that will own the imported datasets                                                                                                                                                                                                                                                           |

3. Select **Save** to create the harvest source.

:::tip Manual harvest

Use manual harvest to test new configuration changes, import urgent dataset updates, or verify the harvest after fixing an issue.

:::

## Configure source settings

Select your source type for detailed configuration instructions:

- **[FAIR data points](./fair-data-points.md):** Research data repositories following FAIR principles
- **[DCAT-AP endpoints](./dcat-ap.md):** European data portals using DCAT-AP standard
- **[CKAN catalogues](./ckan.md):** Partner CKAN instances
