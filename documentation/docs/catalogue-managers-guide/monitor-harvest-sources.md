---
slug: /catalogue-managers-guide/monitor-harvest-sources
sidebar_label: "Monitor harvesting"
sidebar_position: 7
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Monitor harvesting

Track harvesting health at both system and job levels.

In this guide

> [Monitor background processes](#monitor-background-processes)  
> [Monitor harvest jobs](#monitor-harvest-jobs)

## Monitor background processes

**When to check:** If harvests aren't running as expected.

<!-- Note to reviewers: Source documentation refers to both "run" and "crond" interchangeably.
     Supervisorctl output shows "run" as the process name, so we use that here. -->

Three background processes must run continuously for harvesting to work:

- **`ckan_gather_consumer`:** Manages the gathering of data sources to be harvested
- **`ckan_fetch_consumer`:** Responsible for fetching the data from the sources identified by the gather process
- **`run`:** Responsible for triggering the harvester at the end of each specified time interval

To check process status:

1. Access the CKAN container:

   ```bash
   docker compose exec -it ckan-dev bash
   ```

2. Check all processes:

   ```bash
   supervisorctl status
   ```

3. Verify output:
   ```
   ckan_fetch_consumer              RUNNING
   ckan_gather_consumer             RUNNING
   run                              RUNNING
   ```

All three processes should show `RUNNING` status. If any process is not running correctly, see [Manage harvest sources](./manage-harvest-sources.md).

## Monitor harvest jobs

**When to check:** If you want to review harvest history and results.

1. Go to **Harvest Sources** and select your source.
2. Select the **Jobs** tab to view:
   - Harvest history with timestamps
   - Job status
   - Number of datasets added, updated, deleted, and not modified
   - Error messages and logs
3. Select a specific job to view detailed logs and troubleshooting information.
