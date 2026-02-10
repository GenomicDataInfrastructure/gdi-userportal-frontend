---
slug: /catalogue-managers-guide/manage-sources
sidebar_label: "Manage harvest sources"
sidebar_position: 8
---

# Manage harvest sources

Edit, trigger, and delete harvest sources to maintain accurate synchronisation with external data repositories.

In this guide  
> [Edit a harvest source](#edit-a-harvest-source)  
> [Trigger a manual harvest](#trigger-a-manual-harvest)  
> [Delete a harvest source](#delete-a-harvest-source)    


## Edit a harvest source

Update your harvest source configuration when URLs change, credentials expire, or harvest settings need adjustment.

1. Go to **Harvest Sources**.  
2. Select the harvest source you want to edit.
3. Select **Admin**, and then **Edit**.
4. Update the configuration, and select **Save**.
5. (Optionally) Select **Reharvest** to apply changes immediately.

:::tip CONFIGURATION CHANGES

Changes take effect immediately for the next scheduled harvest. Any currently running harvest job continues with the old configuration.

:::

## Trigger a manual harvest

Run a harvest immediately without waiting for the scheduled time.

1. Go to **Harvest Sources**.
2. Select your harvest source.
3. Select **Admin**, and then **Reharvest**.
4. Monitor progress in the **Jobs** tab.  
 
## Delete a harvest source

Permanently remove a harvest source configuration when you no longer need automatic synchronisation.

1. Go to **Harvest Sources**.
2. Select the harvest source you want to delete.
3. Select **Admin**, and then **Edit**. 
4. Select **Delete** at the bottom of the form.
5. Select **Delete source** or **Delete and clear source**, and then confirm the deletion. <!-- (To Reviewer: clarify the difference between these options in the UI and documentation - Does clearing mean it will clear the datasets it harvested?)  -->
 

:::info HARVESTED DATASETS REMAIN

Deleting a harvest source does **not** delete the harvested datasets. They remain in your catalogue but will no longer synchronise automatically with the source.  <!-- (To Reviewer: pls verify the accuracy of this statement  -->

:::

  <!-- (To Reviewer: pls verify the accuracy of these statements  -->
**What happens after deletion:**
- The harvest source configuration is permanently removed
- Scheduled harvests stop
- Harvested datasets remain in your catalogue as regular datasets
- You can edit datasets manually without synchronisation conflicts

:::info Re-adding the same source

Datasets will be considered "new" if you configure a harvester source, delete it, and re-add it.

:::

:::note Known Deletion Behaviour

If deletion fails during the `import_stage`, the dataset becomes permanently hidden in the database and cannot be removed by subsequent harvests.

:::

<!-- to Reviewer: pls verify the accuracy of the Known Deletion Behaviour statement above. This is based on the original statement: "If a dataset is set for deletion and something goes wrong during the `import_stage` a dataset stays forever as no more current one." -->

:::tip Editing harvested datasets

Manual edits to harvested datasets are overwritten during the next harvest run. For permanent changes, consider requesting the source administrators to update metadata at the original system. Changes will synchronise automatically.

:::

<!-- To reviewer: pls check accuracy here -->

