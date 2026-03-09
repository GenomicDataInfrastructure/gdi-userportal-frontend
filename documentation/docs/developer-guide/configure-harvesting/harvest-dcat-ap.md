---
title: Harvest DCAT-AP
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Harvest DCAT-AP endpoints

Configure and test harvesting from DCAT-AP endpoints to import metadata into CKAN.

## Prerequisites

Ensure the CKAN development environment is set up as documented in the [setup environment guide](../setup-environment/index.md).

## Configure CKAN for DCAT-AP harvesting

### Step 1: Enable DCAT RDF Harvester Plugin

Modify the `.env` file and add the following to plugins:

```
dcat_rdf_harvester
```

### Step 2: Configure DCAT Profiles

If you're using an RDF harvester with a custom profile, ensure the `ckan.ini` file contains the following properties:

```ini
ckanext.dcat.rdf.profiles = <space-separated list of profiles>
ckanext.dcat.compatibility_mode = true
```

**Note**: The order of profiles is important for the behaviour.

More about profiles and compatibility modes can be found in the [CKAN + DCAT documentation](https://extensions.ckan.org/extension/dcat/#profiles).

### Step 3: Rebuild Containers

```bash
docker compose build
docker compose up
```

## Configure a DCAT-AP harvest source

Go to the CKAN harvest page (e.g., http://localhost:5500/harvest). Click "Add Harvest Source".

Fill in the following fields:

- **URL**: Enter the URL of the dataset you want to harvest
- **Source type**: Select the appropriate DCAT harvester type
- **Configuration**: Enter configuration JSON

Save the harvest source.

## Example URLs for testing

Below are several example links you can use for testing:

- [https://opendata.swiss/en/dataset/verbreitung-der-steinbockkolonien.xml](https://opendata.swiss/en/dataset/verbreitung-der-steinbockkolonien.xml)
- [http://national_catalogue_mock:8001/xnat.ttl](http://national_catalogue_mock:8001/xnat.ttl)
- [https://raw.githubusercontent.com/Health-RI/starter-kit-info/main/example.ttl](https://raw.githubusercontent.com/Health-RI/starter-kit-info/main/example.ttl)

## Example configuration

For the last example file, you need to provide:

- **rdf_format**: `text/turtle` to parse the file
- **profile**: `fairdatapoint_dcat_ap` was needed to ensure parsing works with the [gdi_userportal schema](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal/blob/main/ckanext/gdi_userportal/scheming/schemas/gdi_userportal.json) which differs from the CKAN default

![Harvesting configuration example](/img/developer-guide/harvester.png)

## Trigger harvesting

### Manual Triggering

After a harvester job is configured, it can be triggered manually:

1. Navigate to the harvest source details
2. Click **Reharvest** in the job's Admin section

If you select the manual time interval, you need to do this each time you want to run the job.

### Automated Triggering

If you set the **Update frequency** to daily, a background process will automatically trigger the harvester at the end of each day.

## Test harvesting in Docker

To test harvesting in Docker Desktop:

1. Go to the container
2. Click **Terminal**
3. Enter the command:

```bash
ckan --config=/srv/app/ckan.ini harvester run-test <id of harvester>
```

The `<id of harvester>` is the last part of the URL of the harvest source.

## Verify success

If successful, you'll see datasets uploaded in CKAN. Check the CKAN datasets page to verify the harvested data.

## Profile configuration

### Available Profiles

- **euro_dcat_ap**: DCAT-AP 1.1
- **euro_dcat_ap_2**: DCAT-AP 2.1
- **euro_dcat_ap_3**: DCAT-AP 3.0
- **fairdatapoint_dcat_ap**: Custom GDI profile for FAIR Data Points

### Custom Profiles

To create a custom profile, extend an existing profile class:

```python
from ckanext.dcat.profiles import EuropeanDCATAPProfile

class CustomProfile(EuropeanDCATAPProfile):
    def parse_dataset(self, dataset_dict, dataset_ref):
        # Custom parsing logic
        dataset_dict = super().parse_dataset(dataset_dict, dataset_ref)
        # Add custom fields
        return dataset_dict
```

## Troubleshooting

### Harvester Not Available

Ensure `dcat_rdf_harvester` is enabled in plugins:

```bash
docker compose exec ckan-dev bash
ckan config-tool /srv/app/ckan.ini -s app:main "ckan.plugins"
```

### Parsing Errors

Check:
- The RDF format matches the source (`text/turtle`, `application/rdf+xml`, etc.)
- The profile is compatible with the source metadata structure

### No Datasets Created

Verify:
- The source endpoint is accessible
- The harvester job completed without errors (check logs)
- The mapping between source and CKAN fields is correct

## Next steps

- [Harvest FAIR Data Points](./harvest-fair-datapoints.md) - FDP-specific harvesting
- [Set up nginx for RDF](./setup-nginx-for-rdf.md) - Local testing setup
- [Harvester update strategy](./harvester-update-strategy.md) - Technical details
