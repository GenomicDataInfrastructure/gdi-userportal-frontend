---
slug: /catalogue-managers-guide/harvest-data/manage-sources
sidebar_label: "Manage sources"
sidebar_position: 8
---

# Manage harvest sources

In this guide

> [Edit a source](#edit-a-source)  
> [Pause a source](#pause-a-source)  
> [Resume a source](#resume-a-source)  
> [Manually trigger a harvest](#manually-trigger-a-harvest)  
> [Delete a source](#delete-a-source)  
> [Manage harvested datasets](#manage-harvested-datasets)

## Edit a source

Update harvest source configuration to change URLs, credentials, or harvest settings.

1. Go to **Harvest Sources**. <!-- VERIFY UI: Menu path -->
2. Select the harvest source you want to edit.
3. Select **Edit**. <!-- VERIFY UI: Button label -->
4. Make your changes:
   - Update URL or credentials
   - Modify update frequency
   - Adjust filters or mapping
   - Change organization ownership
5. Select **Save**.

:::tip CHANGES TAKE EFFECT IMMEDIATELY

Configuration changes apply to the next scheduled harvest. Ongoing harvest jobs use the old configuration.

:::

## Pause a source

Temporarily stop automatic harvest without deleting the source or harvested datasets.

1. Go to **Harvest Sources**.
2. Select your harvest source.
3. Select **Edit**.
4. Change **Status** to **Inactive**. <!-- VERIFY UI: Field name and value -->
5. Select **Save**.

**When to pause:**
- Source system is under maintenance
- You need to review and adjust configuration
- Temporary issues with source data quality
- Budget or resource constraints

**What happens when paused:**
- Scheduled harvests do not run
- Existing datasets remain unchanged
- You can still manually trigger harvests
- Configuration is preserved

## Resume a source

Restart automatic harvest for a paused source.

1. Go to **Harvest Sources**.
2. Select your paused harvest source.
3. Select **Edit**.
4. Change **Status** to **Active**. <!-- VERIFY UI: Field name and value -->
5. Select **Save**.
6. Optionally, select **Reharvest** to harvest immediately. <!-- VERIFY UI: Button label -->

:::info CATCH-UP BEHAVIOR

When you resume a harvest source, the next harvest will detect and import any changes that occurred while paused.

:::

## Manually trigger a harvest

Run a harvest immediately without waiting for the scheduled time.

1. Go to **Harvest Sources**.
2. Select your harvest source.
3. Select **Reharvest**. <!-- VERIFY UI: Button label -->
4. Monitor progress in the **Jobs** tab.

**When to manually trigger:**
- Test new configuration
- Urgent need for updated data
- After you fix source issues
- Initial setup and verification

## Delete a source

Permanently remove a harvest source configuration.

1. Go to **Harvest Sources**.
2. Select the harvest source you want to delete.
3. Select **Delete**. <!-- VERIFY UI: Button label -->
4. Confirm deletion.

:::warning DATASETS ARE NOT DELETED

Deleting a harvest source does NOT delete the harvested datasets. They remain in your catalogue but will no longer be updated automatically.

:::

**What happens when you delete:**
- The harvest source configuration is removed
- Scheduled harvests stop permanently
- Harvested datasets remain in your catalogue
- Datasets become regular datasets owned by your organization
- Harvest job history is preserved

**After deletion:**
- Harvested datasets can be edited manually
- Datasets are no longer synchronized with the source
- You can re-create the harvest source later if needed

## Manage harvested datasets

**Edit harvested datasets**

:::warning HARVEST SYNCHRONIZATION

Manual edits to harvested datasets may be overwritten during the next harvest run. For permanent changes:

1. **Update at the source** - Modify metadata at the original source system, OR
2. **Disable the harvest** - Pause or delete the harvest source before making manual edits

:::

Best practices:
- Document why manual edits are needed
- Consider requesting source to update their metadata
- If you pause harvest, note the reason for future reference

**Convert harvested datasets to regular datasets**

If you want to maintain a harvested dataset independently:

1. Delete the harvest source - This breaks the synchronization link
2. Edit the dataset - Datasets are now regular datasets you can freely modify
3. Maintain manually - Updates must be made manually going forward

**Bulk operations on harvested datasets**

For operations on multiple harvested datasets:

1. Go to **Datasets** and use the organization filter.
2. Apply bulk actions if available.
3. Or use the CKAN API for programmatic updates.
