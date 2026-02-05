---
slug: /catalogue-managers-guide/setup
sidebar_label: "Add harvest sources"
sidebar_position: 2
---

# Add harvest sources

Connect an external data source to automatically import and synchronise datasets to your catalogue.

In this guide  
> [Add a harvest source](#add-a-harvest-source)  
> [Check harvest progress](#check-harvest-progress)   


## Before you begin
- Obtain the source URL (endpoint address) of the data source
- Confirm you have permission to harvest from this source and get authentication credentials if required
- Decide which organisation will own the harvested datasets

## Add a harvest source

1. Go to **Harvest Sources** and select **Add Harvest Source**.  

2. Fill out the source details:

   - **URL:** Enter the endpoint address of the data source  
   - **Title:** Enter a descriptive name (example: "ELIXIR Beacon datasets") 
   - **Description:** Add notes about what this source provides (optional) 
   - **Source type:** Select the type that matches your source: 
        - FAIR Data Point
        - DCAT-AP
        - CKAN
   - **Organisation:** Select which organisation will own the harvested datasets  
   - **Update frequency:** Choose how often to check for updates 

4. Configure authentication (if required):

   - Enter API keys or credentials
   - Configure OAuth settings
   - Set access tokens

5. Set advanced options (optional):

   - Add metadata mapping rules to transform source metadata
   - Set filtering criteria to harvest only specific datasets
   - Configure timeout and retry settings

6. Select **Save** to create the harvest source. 

7. Start the initial harvest:

   - Select **Reharvest** to begin importing datasets immediately, OR  
   - Wait for the next scheduled harvest time

## Check harvest progress

1. Go to **Harvest Sources** and select your source.

2. Select the **Jobs** tab. 

3. View the most recent job to see:
   - Current status (Running, Complete, Failed)
   - Number of datasets added, updated, or deleted
   - Error messages if the harvest failed
   - Completion timestamp

4. Select a job to view detailed logs and troubleshooting information.

## Next steps

- [Monitor and manage your harvest sources](./manage-sources.md): Edit, pause, or delete sources
- [Troubleshoot harvest issues](./troubleshoot.md): Resolve common problems
