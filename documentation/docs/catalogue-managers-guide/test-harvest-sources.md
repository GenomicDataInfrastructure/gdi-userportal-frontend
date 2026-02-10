---
slug: /catalogue-managers-guide/test-harvest-sources
sidebar_label: "Test harvest sources"
sidebar_position: 6
---

<!--
SPDX-FileCopyrightText: 2024 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Test harvest sources

Verify your harvest source configuration is working correctly before relying on automated schedules.

To test a harvest source:

1. Access the CKAN container:
   ```bash
   docker compose exec -it ckan-dev bash
   ```

2. Run the test command:
   ```bash
   ckan --config=/srv/app/ckan.ini harvester run-test <harvest-id>
   ```
   
   Where `<harvest-id>` is the last part of the harvest source URL

3. Check for success. If successful, you'll see datasets uploaded in the catalogue.  

:::tip Manual triggering

After you configure the manual harvester, you can trigger it by clicking **Reharvest** in the job's Admin section.

:::


