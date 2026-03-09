---
title: Harvest FAIR data points
sidebar_position: 2
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Harvest FAIR data points

Configure and test harvesting from FAIR Data Points to import metadata into CKAN.

## Prerequisites

First, ensure that the `fairdatapointharvester` extension has been added to the CKAN plugins.

## Configure a FAIR data point harvest source

After signing in to the CKAN portal, go to the CKAN harvest page (e.g., http://localhost:5500/harvest). Click on "Add Harvest Source".

Fill in the following fields:

- **URL**: URL of the FAIR Data Point. Example: https://fair.healthinformationportal.eu/
- **Title**: Descriptive name for the harvest source
- **Source type**: "FAIR data point harvester"
- **Configuration**: `{ "profile": "fairdatapoint_dcat_ap" }`

Click on "Save".

## Test Harvesting Locally

### Enter the CKAN Container

```bash
docker compose exec -it ckan-dev bash
```

### Run the Harvester Test

Inside the container, run the following command:

```bash
ckan --config=/srv/app/ckan.ini harvester run-test <id of harvester>
```

The harvester ID is the last part of the URL of the harvest source.

## Automated Harvesting with CRON

### Overview

The GDI package includes CRON job functionality designed to automate the harvesting of FAIR Data Points. This automation ensures continuous and efficient data collection without manual intervention.

The harvesting process is initiated by three background processes:

- **`crond`**: Schedules periodic harvesting
- **`ckan_gather_consumer`**: Manages gathering of data sources
- **`ckan_fetch_consumer`**: Fetches data from identified sources

### Background Processes

#### gather_consumer

Manages the gathering of data sources to be harvested.

#### fetch_consumer

Responsible for fetching the data from the sources identified by the gather process.

#### run

Responsible for triggering the harvester at the end of each specified time interval (e.g., daily, weekly).

These processes are crucial for the automated harvesting workflow, ensuring that data is continuously and efficiently collected and made available through the CKAN portal.

## Monitor Process Status

To monitor the status of these background processes, use the `supervisorctl` command. Executing this command provides real-time status information about each process involved in the harvesting operation.

```bash
supervisorctl status
```

Upon execution, you should see output similar to the following, indicating that all processes are running correctly:

```
ckan_fetch_consumer              RUNNING   
ckan_gather_consumer             RUNNING   
crond                            RUNNING
```

This output shows that `ckan_fetch_consumer`, `ckan_gather_consumer`, and `crond` are in the RUNNING state, along with their respective process IDs and uptime, confirming their active operation within the system.

## Manual Triggering

After a harvester job is configured, it can be triggered manually:

1. Go to the harvest source details page
2. Click **Reharvest** in the job's Admin section

If you select the manual time interval, you need to do this each time you want to run the job. However, if you set the Update frequency to daily, a background process will automatically trigger the harvester at the end of each day.

## Troubleshooting

### Extension Not Found

Ensure `fairdatapoint_harvester` is added to the plugins in your CKAN configuration:

```ini
ckan.plugins = ... fairdatapoint_harvester
```

### Harvester Fails

Check the harvester logs:

```bash
docker compose logs ckan-dev
```

Or inside the container:

```bash
tail -f /var/log/ckan/ckan.log
```

### No Datasets Imported

Verify:
- The FDP endpoint is accessible
- The profile configuration matches the FDP metadata structure
- SHACL shapes are properly configured in FDP

## Next Steps

- [Harvest DCAT-AP](./harvest-dcat-ap.md) - Set up DCAT harvesting
- [Harvester update strategy](./harvester-update-strategy.md) - Understand updates
- [Configure FAIR Data Point](../work-with-metadata/configure-fair-datapoint.md) - FDP setup
