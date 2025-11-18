---
title: Testing harvesting of FAIR Data Points
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

First, make sure that the `fairdatapointharvester` extension has been added to the CKAN plugins.

After signing in to the CKAN portal, go to CKAN harvest page (e.g. http://localhost:5500/harvest). Click on “Add Harvest Source”.

Fill in the following fields:

- URL of the fair data points. Example: https://fair.healthinformationportal.eu/
- Title
- Source type: "FAIR data point harvester"
- Configuration: `{ "profile": "fairdatapoint_dcat_ap" }`

Click on "Save".

Then, enter the CKAN container:

`docker compose exec -it ckan-dev bash`

# Local development  

Inside the container, run the following command:

`ckan --config=/srv/app/ckan.ini harvester run-test <id of harvester>`.

The harvester id is the last part of the URL of the harvest source.


# GDI CKAN container CRON Job for FAIR Data Harvesting

## Overview

The GDI package, available from the GDI GitHub repository, includes a CRON job functionality designed to automate the harvesting of FAIR datapoints. This automation ensures continuous and efficient data collection without manual intervention. The harvesting process is initiated three background processes responsible for the operation: `crond`, `ckan_gather_consumer` and `ckan_fetch_consumer`.

## Background Processes

The harvesting operation relies on three main background processes:

- **`gather_consumer`**: Manages the gathering of data sources to be harvested.
- **`fetch_consumer`**: Responsible for fetching the data from the sources identified by the gather process.
- **`run`**: Responsible for triggering the harvester at the end of each specified time interval (e.g., daily, weekly).

These processes are crucial for the automated harvesting workflow, ensuring that data is continuously and efficiently collected and made available through the CKAN portal.

## Monitoring Process Status

To monitor the status of these background processes, the `supervisorctl` command is used. Executing this command provides real-time status information about each process involved in the harvesting operation. Here's how to check the process status:

```bash
supervisorctl status
```

Upon execution, you should see output similar to the following, indicating that both processes are running correctly:

```
ckan_fetch_consumer              RUNNING   
ckan_gather_consumer             RUNNING   
crond                            RUNNING
```

This output shows that both `ckan_fetch_consumer`, `ckan_gather_consumer` and `crond` are in the RUNNING state, along with their respective process IDs and uptime, confirming their active operation within the system.



