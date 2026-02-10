---
slug: /catalogue-managers-guide/manage-datasets-manually/delete
sidebar_label: "Delete datasets"
sidebar_position: 4
---

# Delete datasets

Peramanently remove datasets that are obsolete or no longer needed. Before you proceed, ensure there are no dependencies on the dataset or consider changing visibility from public to private.

In this guide  
> [Delete a dataset](#delete-a-dataset)  
> [What happens when you delete a dataset](#what-happens-when-you-delete-a-dataset)


<br/>
:::tip Full documentation

This guide covers the common tasks for managing datasets. For a complete guide to all dataset operations, see the [**CKAN documentation**](https://docs.ckan.org/en/2.11/user-guide.html#datasets-and-resources)<sup>↗</sup>. CKAN is the system that powers the GDI Catalogue Portal. 

:::

## Delete a dataset

To delete a dataset from the catalogue:

1. Go to **Datasets** from the main menu and open the dataset you want to delete.

2. On the dataset details page, select **Manage**.

3. Scroll to the bottom panel and select **Delete**.

4. Select **Confirm** to permanently delete the dataset. 

:::danger Permanent action 

Deleting a dataset cannot be undone. The dataset record and all associated data resources are permanently removed from the catalogue with no recovery option.

:::

## What happens when you delete a dataset

When you delete a dataset, the following occurs:

- The dataset metadata and all associated information are permanently deleted
- The dataset is removed from the [GDI Data Portal](https://portal.gdi.lu/)<sup>↗</sup> <!-- VERIFY SYSTEM: Actual removal timing -->
- Any users or applications with access permissions lose access to the dataset
- Links to the dataset from external sources or documentation will no longer work

:::info Data files not affected

Deleting a dataset record from the catalogue does not delete the actual data files stored in your organisation's repositories or storage systems. It only removes the metadata record from the GDI catalogue.

:::

:::warning Harvested datasets

If the dataset you deleted was harvested from an external source, it may be re-created during the next harvest. To permanently remove a harvested dataset remove it from the source system.

:::
