---
slug: /catalogue-managers-guide/harvest-data/manage-sources
sidebar_label: "Monitor and manage sources"
sidebar_position: 7
---

# Monitor and manage harvest sources

Update, pause, or delete harvest sources to maintain control over automated dataset collection.

## Edit a harvest source

Update your harvest source configuration when URLs change, credentials expire, or harvest settings need adjustment.

1. Go to **Harvest Sources**. <!-- VERIFY UI: Menu path -->
2. Select the harvest source you want to edit.
3. Select **Edit**. <!-- VERIFY UI: Button label -->
4. Update the configuration:
   - Change URL or authentication credentials
   - Modify update frequency
   - Adjust filter criteria or metadata mapping
   - Change organisation ownership
5. Select **Save**.

:::tip CONFIGURATION CHANGES

Changes take effect immediately for the next scheduled harvest. Any currently running harvest job continues with the old configuration.

:::

## Trigger a manual harvest

Run a harvest immediately without waiting for the scheduled time.

1. Go to **Harvest Sources**.
2. Select your harvest source.
3. Select **Reharvest**. <!-- VERIFY UI: Button label -->
4. Monitor progress in the **Jobs** tab. <!-- VERIFY UI: Tab label -->

**Use manual harvest to:**
- Test new configuration changes
- Import urgent dataset updates
- Verify the harvest after fixing source issues
- Complete initial setup and verification

## Pause a harvest source

Temporarily stop automatic harvesting without deleting the source or harvested datasets.

1. Go to **Harvest Sources**.
2. Select your harvest source.
3. Select **Edit**.
4. Change **Status** to **Inactive**. <!-- VERIFY UI: Field name and value -->
5. Select **Save**.

**When to pause:**
- Source system is undergoing maintenance
- You need time to review and adjust configuration
- Temporary data quality issues at the source
- Resource or budget constraints

**What happens when paused:**
- Scheduled harvests do not run automatically
- Existing datasets remain unchanged in your catalogue
- You can still trigger manual harvests if needed
- All configuration settings are preserved

## Resume a harvest source

Restart automatic harvesting for a paused source.

1. Go to **Harvest Sources**.
2. Select your paused harvest source.
3. Select **Edit**.
4. Change **Status** to **Active**. <!-- VERIFY UI: Field name and value -->
5. Select **Save**.
6. Optionally, select **Reharvest** to import changes immediately. <!-- VERIFY UI: Button label -->

:::info SYNCHRONISATION AFTER RESUME

When you resume a source, the next harvest detects and imports any changes that occurred while the source was paused.

:::

## Delete a harvest source

Permanently remove a harvest source configuration when you no longer need automatic synchronisation.

1. Go to **Harvest Sources**.
2. Select the harvest source you want to delete.
3. Select **Delete**. <!-- VERIFY UI: Button label -->
4. Confirm the deletion when prompted.

:::warning HARVESTED DATASETS REMAIN

Deleting a harvest source does NOT delete the harvested datasets. They remain in your catalogue but will no longer synchronise automatically with the source.

:::

**What happens after deletion:**
- The harvest source configuration is permanently removed
- Scheduled harvests stop
- Harvested datasets remain in your catalogue as regular datasets
- Datasets become fully owned by your organisation
- You can edit datasets manually without synchronisation conflicts
- Harvest job history is preserved for reference

**Managing datasets after source deletion:**
- Edit datasets freely without overwrite concerns
- Datasets no longer synchronise with the external source
- You must update datasets manually to reflect source changes
- You can recreate the harvest source later if needed

## Edit harvested datasets

:::warning SYNCHRONISATION OVERWRITES

Manual edits to harvested datasets are overwritten during the next harvest run. For permanent changes, choose one of these approaches:

**Option 1: Update at the source** (recommended)  
Request the source administrators to update metadata at the original system. Changes will synchronise automatically.

**Option 2: Pause or delete the harvest source**  
Stop synchronisation before making manual edits to prevent your changes from being overwritten.

:::

**Best practices:**
- Document the reason for manual edits
- Contact source administrators to request metadata improvements
- If you pause harvest, document the reason for future reference
- Consider whether the change should apply to the source data

## Convert to regular datasets

To maintain harvested datasets independently from the source:

1. Delete the harvest source to break the synchronisation link.
2. Edit the datasets as needed - they are now regular datasets.
3. Maintain datasets manually - future updates must be made manually.

**When to convert:**
- Source is permanently unavailable
- You need permanent control over metadata
- Source updates are no longer relevant
- You want to heavily customise imported datasets

## Monitor harvest jobs

1. Go to **Harvest Sources** and select your source.
2. Select the **Jobs** tab to view:
   - Harvest history with timestamps
   - Job status (Running, Complete, Failed)
   - Number of datasets added, updated, or deleted
   - Error messages and logs
3. Select a specific job to view detailed logs and troubleshooting information.

**Job status indicators:**
- **Running** - Harvest is currently in progress
- **Complete** - Harvest finished successfully
- **Failed** - Harvest encountered errors (review logs for details)

## Bulk operations on harvested datasets

To perform actions on multiple harvested datasets:

1. Go to **Datasets** and apply the organisation filter.
2. Use bulk actions if available in your CKAN interface.
3. Or use the CKAN API for programmatic updates:

```bash
# List harvested datasets
curl https://catalogue.portal.gdi.lu/api/3/action/package_list

# Get dataset details
curl https://catalogue.portal.gdi.lu/api/3/action/package_show?id=dataset-id
```

## Next steps

[Troubleshoot harvest issues](./troubleshoot.md) - Resolve common problems

[Review technical specifications](./technical-specs.md) - Understand harvest timing and behaviour
