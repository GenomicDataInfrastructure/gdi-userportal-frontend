---
slug: /catalogue-managers-guide/harvest-data/setup
sidebar_label: "Set up a source"
sidebar_position: 2
---

# Set up a harvest source

In this guide

> [Set up a harvest source](#set-up-a-harvest-source-1)  
> [Monitor harvest jobs](#monitor-harvest-jobs)

To set up a harvest source, you need:
- Admin or Editor role in your organization
- Source URL (the endpoint URL of the data source)
- Authentication credentials (if required by the source)

## Set up a harvest source

1. Go to **Harvest Sources** in the main menu. <!-- VERIFY UI: Menu path -->

2. Select **Add Harvest Source**. <!-- VERIFY UI: Button label -->

3. Fill out the harvest source form:

   - **URL** - The endpoint of the data source
   - **Title** - A descriptive name for this harvest source
   - **Description** - Optional notes about what this source provides
   - **Source type** - Select from available types <!-- VERIFY UI: Actual dropdown options -->
   - **Organization** - Select which organization will own the harvested datasets
   - **Update frequency** - Choose how often to check for updates

4. Configure advanced options (if needed):

   - Authentication settings
   - Metadata mapping rules
   - Dataset filtering criteria

5. Select **Save** to create the harvest source.

6. Select **Reharvest** to start the initial harvest, or wait for the scheduled time. <!-- VERIFY UI: Button label -->

## Monitor harvest jobs

1. Go to **Harvest Sources** and select your source.

2. Select the **Jobs** tab to view:
   - Harvest history and status
   - Number of datasets created/updated/deleted
   - Error logs (if any failures occurred)

3. Select a specific job to see detailed logs.

:::tip FIRST HARVEST

The initial harvest may take longer than subsequent updates, especially for large data sources. Monitor the job status to ensure completion.

:::
