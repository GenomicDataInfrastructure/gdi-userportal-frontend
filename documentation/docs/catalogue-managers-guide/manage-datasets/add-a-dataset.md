---
slug: /add-datasets
sidebar_label: "Add datasets"
sidebar_position: 2
---

# Add datasets

Create datasets to build your organisation's genomic data catalogue, and make them discoverable to researchers within and outside your organisation. New to datasets? Learn [about datasets](what-is-a-dataset.md) and how to describe them.

:::tip Full documentation

This guide covers the common tasks for managing datasets. For detailed instructions on all dataset operations, see the [**full CKAN documentation**](https://docs.ckan.org/en/2.11/user-guide.html#datasets-and-resources)<sup>↗</sup>. CKAN is the system that powers the GDI Data Catalogue. 

:::

<br/>

To add a dataset:

1. Go to **Datasets** and select **Add Dataset**. <!-- VERIFY UI: Menu path and button label -->  

2. Fill out the dataset form with the metadata of your genomic dataset. For guidance on filling out the form, see the definition of properties in the [DCAT-AP Vocabulary](https://semiceu.github.io/DCAT-AP/r5r/releases/3.0.0/)<sup>↗</sup>. <!-- TODO: verify dcat link -->

<figure>
    <img src="/gdi-userportal-frontend/img/catalogue-managers-guide/manage-datasets/add-dataset-metadata.png" alt="Add dataset metadata form" width="900" />
    <figcaption></figcaption>
</figure>

:::tip DATASET VISIBILITY

When you fill out the **Visibility** field, select **Public** to make your dataset discoverable by all users in the [GDI Data Portal](https://portal.gdi.lu/)<sup>↗</sup>. Or select **Private** to make it visible only to users within your organisation.

:::

3. Select **Next: Add Data** to add a data resource. For guidance in filling out the form, see [Add a data resource to your dataset](add-data-resource.md). You must add at least one data resource to create your dataset. <!-- VERIFY UI: Button label -->
<!-- 
<figure>
    <img src="/gdi-userportal-frontend/img/catalogue-managers-guide/manage-datasets/add-dataset-data-resources.png" alt="Add dataset data resources form" width="900" />
    <figcaption></figcaption>
</figure> -->

4. Select **Finish** to add your dataset. After your dataset is successfully created, the dataset details page opens. <!-- VERIFY UI: Button label -->

<figure>
    <img src="/gdi-userportal-frontend/img/catalogue-managers-guide/manage-datasets/dataset-details.png" alt="Dataset details page showing the newly created dataset" width="900" />
    <figcaption></figcaption>
</figure>

## Data Catalogue ↔ Data Portal integration

<!-- VERIFY SYSTEM: Actual synchronization timing between Data Catalogue and Data Portal -->
**Publication timing**  
Public datasets appear in the [GDI Data Portal](https://portal.gdi.lu/)<sup>↗</sup> after creation or updates.

**Private datasets**  
Private datasets are only visible to members of your organization in the Data Catalogue. They do not appear in the public Data Portal.

**Metadata requirements**  
Ensure you fill out all required DCAT-AP fields for optimal discoverability. For field definitions, see the [DCAT-AP Vocabulary](https://semiceu.github.io/DCAT-AP/r5r/releases/3.0.0/)<sup>↗</sup>.

**Additional dataset operations**  
For editing, updating, deleting, and other dataset operations