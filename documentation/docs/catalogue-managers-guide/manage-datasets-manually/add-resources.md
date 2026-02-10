---
slug: /catalogue-managers-guide/manage-datasets-manually/add-resources
sidebar_label: "Add data resources"
sidebar_position: 3
---

# Add data resources

A data resource represents the actual data described by your dataset. It can be a file, a link to an external data source, or an API endpoint. Adding data resources makes your dataset actionable and allows users to access the underlying data.

In this guide

> [Add a data resource](#add-a-data-resource)  
> [Reorder data resources](#reorder-data-resources)

<br/>

:::tip Full documentation

This guide covers the common tasks for managing datasets. For a complete guide to all dataset operations, see the [**CKAN documentation**](https://docs.ckan.org/en/2.11/user-guide.html#datasets-and-resources)<sup>↗</sup>. CKAN is the system that powers the GDI Catalogue Portal. 

:::

## Add a data resource

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
