---
slug: /catalogue-managers-guide/add-harvest-sources/dcat-ap
sidebar_label: "DCAT-AP endpoints"
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Harvest from DCAT-AP endpoints

Connect to European data portals using the DCAT-AP standard to import standardised public sector datasets.

:::tip What is DCAT-AP?

Data Catalog Vocabulary-Application Profile (DCAT-AP) is a European standard for describing public sector data catalogues. Many European national and regional portals use DCAT-AP to expose their metadata.

:::

## Configure the DCAT-AP source

:::info Prerequisites
The `dcat_rdf_harvester` extension must be added to the CKAN plugins for this harvester to be available. Additionally, ensure the CKAN.ini file contains:

- `ckanext.dcat.rdf.profiles =` (space-separated list of profiles)
- `ckanext.dcat.compatibility_mode = true`
  :::

When [adding a harvest source](./index.md), use these settings for DCAT-AP endpoints:

| Field             | Description                                                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **URL**           | Enter the DCAT-AP endpoint URL. Examples:<br/>• `https://opendata.swiss/en/dataset/verbreitung-der-steinbockkolonien.xml`<br/>• `https://raw.githubusercontent.com/Health-RI/starter-kit-info/main/example.ttl`                |
| **Source type**   | Select **Generic DCAT RDF Harvester** from the dropdown                                                                                                                                                                        |
| **Configuration** | Enter: `{ "rdf_format": "text/turtle", "profile": "fairdatapoint_dcat_ap" }`<br/><br/>**Note:** Set `rdf_format` to match your file format:<br/>• `text/turtle` for .ttl files<br/>• `application/rdf+xml` for .rdf/.xml files |

:::tip Troubleshooting MIME types

To harvest data sources, the system looks at MIME types:

- For turtle format files (.ttl): `text/turtle`
- For RDF/XML files (.rdf): `application/rdf+xml`

If you're experiencing harvesting issues, verify the `rdf_format` in your configuration matches your file type.
:::

## Next steps

- [Test harvest sources](../test-harvest-sources.md)
- [Monitor harvest sources](../monitor-harvest-sources.md)
- [Manage harvest sources](../manage-harvest-sources.md)
