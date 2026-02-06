---
slug: /catalogue-managers-guide/add-datasets
sidebar_label: "Add datasets manually"
sidebar_position: 13
---

# Add datasets manually

Build your organisation's genomic data catalogue by adding datasets, and make them discoverable to researchers within and outside your organisation. New to datasets? Learn [about datasets](/catalogue-managers-guide/what-is-a-dataset) and how to describe them.

## In this guide

> [Add datasets](#add-datasets)  
> [Add data resources](#add-data-resources)  
> [Reorder data resources](#reorder-data-resources)

<br/>

:::tip Full documentation

This guide covers the common tasks for managing datasets. For a complete guide to all dataset operations, see the [**CKAN documentation**](https://docs.ckan.org/en/2.11/user-guide.html#datasets-and-resources)<sup>↗</sup>. CKAN is the system that powers the GDI Catalogue Portal. 

:::

## Add datasets

To add a dataset:

1. Go to **Datasets** and select **Add Dataset**. <!-- VERIFY UI: Menu path and button label -->  

2. Fill out the dataset form with the metadata of your genomic dataset. For guidance on filling out the form, see the definition of properties in the [DCAT-AP Vocabulary](https://semiceu.github.io/DCAT-AP/r5r/releases/3.0.0/)<sup>↗</sup>. <!-- TODO: verify dcat link -->

<figure>
    <img src="/gdi-userportal-frontend/img/catalogue-managers-guide/manage-datasets/add-dataset-metadata.png" alt="Add dataset metadata form" width="900" />
    <figcaption></figcaption>
</figure>

:::tip Setting the dataset visibility
- **Private datasets** will be visible to users within your organisation in the Data Catalogue.  
- **Public datasets** will be discoverable by all users in the [GDI Data Portal](https://portal.gdi.lu/)<sup>↗</sup>.
:::

3. Select **Next: Add Data** to add a data resource. You must add at least one data resource to create your dataset. See [Add data resources](#add-data-resources) below for guidance on filling out the data resource form. <!-- VERIFY UI: Button label -->
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

## Add data resources

Add more files or links to your dataset to provide comprehensive genomic information. A data resource represents the actual data described by your dataset.

To add a data resource to your dataset:

1. Open the dataset you want to add a data resource to.

2. On the dataset details page, select **Manage**.

3. On the left panel under **Resources**, select **Add new resource**.

<figure>
    <img src="/gdi-userportal-frontend/img/catalogue-managers-guide/manage-datasets/add-data-resource.png" alt="Screenshot adding a data resource" width="900" />
    <figcaption></figcaption>
</figure>

4. Fill out the data resource form. For guidance on filling out the form, see the definition of properties in the [DCAT-AP Vocabulary](https://semiceu.github.io/DCAT-AP/r5r/releases/3.0.0/).

5. Select **Update Dataset** to save the data resource. Once the data resource is added, it appears in the list of data resources for the dataset. Repeat the steps to add more data resources as needed.

## Reorder data resources

Reorder data resources to prioritise the most important or frequently accessed files or links. The order of data resources determines their display sequence on the Data Portal and dataset details page.

To reorder data resources:

1. On the dataset details page, select **Manage**.

2. Select the **Resources** tab. The list of data resources appears.

3. Drag and drop the data resources to reorder them as desired.

<figure>
    <img src="/gdi-userportal-frontend/img/catalogue-managers-guide/manage-datasets/reorder-resources.png" alt="Screen showing the reorder resources interface" width="800" />
    <figcaption></figcaption>
</figure>

4. Select **Save order**. The data resources are reordered and displayed in the new sequence on the dataset details page and the Data Portal.