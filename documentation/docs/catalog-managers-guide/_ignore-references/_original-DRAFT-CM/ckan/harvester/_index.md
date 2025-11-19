---
title: Harvester
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

{{< toc-tree >}}

* * *

Basic harvest extension is publicly available and developed by CKAN community: [https://github.com/ckan/ckanext-harvest](https://github.com/ckan/ckanext-harvest) It defines basic infrastructure for harvesting - a process that receives an end point and tries to identify how many objects are in there and sends each individual object to a fetch consumer which, in its turn, tries to convert each object to CKAN dataset or resource etc. In core CKAN-to-CKAN harvesting is implemented which means a CKAN instance can harvest other CKAN instances.

In CKAN harvest core [setup.py](https://github.com/ckan/ckanext-harvest/blob/master/setup.py) enabled [plugins](https://github.com/ckan/ckanext-harvest/blob/8ea4b1b4fb277046a0d8ba4f4c779e5c9e1fbd8b/setup.py#L31C17-L31C17) are listed, where :

* `harvest=ckanext.harvest.plugin:Harvest` is a harvesting infrastructure
* `ckan_harvester=ckanext.harvest.harvesters:CKANHarvester` is a basic harvester responsible for harvesting other CKANs

These settings define choice of available source types in the UI harvester when a new harvester is added.

Among publicly available and used the most is DCAT harvester, [DCAT RDF harvester](https://github.com/ckan/ckanext-dcat#rdf-dcat-harvester) is well-documented and can be referenced as an example of a harvester configurations and code. There are several harversers in ckanext-dcat, all they extend core harvester interface `HarvesterBase`.

In the interface three methods are of particular interest and defining 80% of the harvesting process:

* `gather_stage` - goes to original URL and tries to define a single object and sends and saves it to the DB as harvester object (into `harvest_object` table).
* `fetch_stage` - checks what was saved with `gather_stage` and if information is not complete, goes back to source to fetch additional data.
* `import_stage` - maps data to CKAN fields. This is the place to implement hooks for data preprocessing etc.

<!-- Mapping logic is the same as in [profiles](https://github.com/ckan/ckanext-dcat/blob/master/ckanext/dcat/profiles.py): there is a base profile, describing fields mapping and extensions. FairDataPoint in this regard is an extension of [EuropeanDCATAP3Profile](https://github.com/ckan/ckanext-dcat/blob/1109205069dd105dda27e3486898e4ca1525a808/ckanext/dcat/profiles.py#L1487).

If a dataset is extended with some fields on source side, depending on profile chosen, it is possible to configure that all the extra fields will be captured in an “extra“ blob with key-value pairs defined in the source (in `package_extra` DB table where key is always a string and value - is an object, flattened to string). A down side of it, if you interact with the dataset via UI then, all the fields which are not in the form will be ignored and then deleted because an update acts as “put“ operation, rather than a patch. Otherwise those field will appear one we map them properly.

To be aware and to care about while doing mapping: if a field in a source has a name which is not mapped and you decide to map it later and assign another name, both alias will appear in CKAN.

Another thing to bear in mind is that the validation is always runs on a full object. So on source schema update you may face a situation when a previously validated field for a dataset starts failing validation. Additionally, as validation runs only on a trigger, you need to run a script to migrate existing datasets on schema updates, otherwise you end up with a bunch of invalid datasets. Such a script can be written in python with [ckanapi](https://github.com/ckan/ckanapi/blob/master/README.md#remoteckan). -->
