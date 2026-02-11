---
slug: /catalogue-managers-guide/add-harvest-sources/fair-data-points
sidebar_label: "FAIR data points"
sidebar_position: 2
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Harvest from FAIR data points

Connect to FAIR Data Points to import scientific datasets that follow FAIR principles (Findable, Accessible, Interoperable, Reusable).

:::tip What are FAIR Data Points?

FAIR Data Points are standardised metadata endpoints for scientific data that ensure data can be easily found and reused by researchers. Learn more about [FAIR principles](https://www.go-fair.org/fair-principles/)<sup>↗</sup>.

:::

## Configure the FAIR data point source

:::info Prerequisite

The `fairdatapointharvester` extension must be added to the CKAN plugins for this harvester to be available.

:::

When [adding a harvest source](./index.md), use these settings for FAIR data points:


| Field | Description |
|-------|-------------|
| **URL** | Enter the FAIR Data Point base URL. Example: `https://fair.healthinformationportal.eu/` |
| **Source type** | Select **FAIR data point harvester** from the dropdown |
| **Configuration** | Enter: `{ "profile": "fairdatapoint_dcat_ap" }` |



:::tip Known Behaviour

If a dataset is moved in FDP from one catalogue to another catalogue (by updating `DCTERMS.isPartOf` reference on the dataset level), it will be considered a new one because a guid of CKAN harvested resource (unlike FDP itself) includes a catalogue ID.

:::

## Next steps

- [Test harvest sources](../test-harvest-sources.md) 
- [Monitor harvest sources](../monitor-harvest-sources.md)  
- [Manage harvest sources](../manage-harvest-sources.md)  