---
title: Test harvesting of DCAT-AP
---
<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

Assuming the CKAN development with is set up as documented in this wiki.

First, modify the `.env` file, add the following to plugins: `dcat_rdf_harvester`. If you are intending using rdf harvester
with a custom profile, make sure configuration CKAN.ini file contains the following properties:
- `ckanext.dcat.rdf.profiles = ` - with a space-separated list of profiles (the order is important for the behaviour)
- `ckanext.dcat.compatibility_mode = true` - to ensure compatibility with dcat_ parsers

More about profiles and compatibility modes can be found in [CKAN + DCAT documentation](#https://extensions.ckan.org/extension/dcat/#profiles).

Rebuild the containers.

Go to CKAN harvest page (e.g. [http://localhost:5500/harvest](http://localhost:5500/harvest)). Click “Add Harvest Source”.

At URL, enter URL of dataset you want to harvest. Select harvester type and fill in the configuration. Save.

Below we provide several example links one may use for testing:

[https://opendata.swiss/en/dataset/verbreitung-der-steinbockkolonien.xml](https://opendata.swiss/en/dataset/verbreitung-der-steinbockkolonien.xml)
[http://national_catalogue_mock:8001/xnat.ttl](http://national_catalogue_mock:8001/xnat.ttl)
[https://raw.githubusercontent.com/Health-RI/starter-kit-info/main/example.ttl](https://raw.githubusercontent.com/Health-RI/starter-kit-info/main/example.ttl)

In the image below you can see example configuration for the last example file. You need to provide `text/turtle` as `rdf_fortat` to parse the file.
`fairdatapoint_dcat_ap` as `profile` was needed to make sure parsing works with [gdi_useportal schema](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-gdi-userportal/blob/main/ckanext/gdi_userportal/scheming/schemas/gdi_userportal.json) which 
is different from CKAN default one.

After a harvester job is configured, it can be triggered manually by clicking Reharvest in the job's Admin section. If you select the manual time interval, you need to do this each time you want to run the job. However, if you set the Update frequency to e.g. daily, a background process will automatically trigger the harvester at the end of each day.
To test harvesting in Docker Desktop go to the container then click Terminal. Enter the command `ckan --config=/srv/app/ckan.ini harvester run-test <id of harvester>`, the <id of harvester> is the part of the URL of the harvest source.

If successful you'll see datasets uploaded in CKAN.

![Harvesting](./harvester.png)