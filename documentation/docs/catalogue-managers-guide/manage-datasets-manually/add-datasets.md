---
slug: /catalogue-managers-guide/manage-datasets-manually/add
sidebar_label: "Add datasets"
sidebar_position: 2
---

# Add datasets

Add individual datasets directly in your catalogue when [automated harvesting](../add-harvest-sources/index.md) isn't suitable for your use case.

:::tip Full documentation

This guide covers the common tasks for managing datasets. For a complete guide to all dataset operations, see the [**CKAN documentation**](https://docs.ckan.org/en/2.11/user-guide.html#datasets-and-resources)<sup>↗</sup>. CKAN is the system that powers the GDI Catalogue Portal. 

:::


To manually add a dataset:

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

3. Select **Next: Add Data** to add a data resource. You must add at least one data resource to create your dataset. See: [Add data resources](./add-resources.md) for guidance on filling out the data resource form. <!-- VERIFY UI: Button label -->
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

