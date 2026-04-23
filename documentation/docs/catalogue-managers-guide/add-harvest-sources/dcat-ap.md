---
slug: /catalogue-managers-guide/add-harvest-sources/dcat-ap
sidebar_label: "HealthDCAT-AP endpoints"
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Harvest from HealthDCAT-AP endpoints

Connect to European data portals using the HealthDCAT-AP standard to import standardised health-related datasets.

:::tip What is HealthDCAT-AP?

HealthDCAT-AP is a European standard for describing health data catalogues, extending the DCAT-AP specification with health-specific metadata. The GDI platform is HealthDCAT-AP compliant, ensuring standardised metadata across the European health data ecosystem.

For complete technical specifications, see the [HealthDCAT-AP documentation](https://healthdataeu.pages.code.europa.eu/healthdcat-ap/releases/release-6/index.html)<sup>↗</sup>.

:::

## Configure the HealthDCAT-AP source

:::info Prerequisites
The `dcat_rdf_harvester` extension must be added to the CKAN plugins for this harvester to be available. Additionally, ensure the CKAN.ini file contains:

- `ckanext.dcat.rdf.profiles =` (space-separated list of profiles)
- `ckanext.dcat.compatibility_mode = true`
  :::

When [adding a harvest source](./index.md), use these settings for HealthDCAT-AP endpoints:

| Field             | Description                                                                                                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **URL**           | Enter the HealthDCAT-AP endpoint URL. Examples:<br/>• `https://opendata.swiss/en/dataset/verbreitung-der-steinbockkolonien.xml`<br/>• `https://raw.githubusercontent.com/Health-RI/starter-kit-info/main/example.ttl`                                        |
| **Source type**   | Select **Generic DCAT RDF Harvester** from the dropdown                                                                                                                                                                                                |
| **Configuration** | Enter: `{ "profile": "fairdatapoint_dcat_ap", "rdf_format": "text/turtle", "force_all": "true" }`<br/><br/>**Note:** Set `rdf_format` to match your file format:<br/>• `text/turtle` for .ttl files<br/>• `application/rdf+xml` for .rdf/.xml files |

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
