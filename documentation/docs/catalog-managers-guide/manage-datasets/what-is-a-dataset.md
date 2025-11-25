---
slug: what-is-a-dataset
sidebar_label: "What is a dataset?"
sidebar_position: 1
---

# What is a dataset?

In general terms, a **dataset** is a structured collection of data that describes a specific subject. In GDI, this subject is genomic information pertaining to human health, diseases, and research studies.

**A dataset in GDI** can be a single file or a collection of files that provide comprehensive genomic information about a specific research topic, disease area, or study cohort. For example, a genomic data for *COVID-19 Viral Sequences* can include dataset records describing *patient data*, *virus samples*, and *sequencing results*.


## Dataset components

In GDI, a dataset has two sets of information that together provide a complete picture of the genomic subject: **metadata** and **data resources**.

    :::tip Why is this important?

     The **metadata** and **data resources** you provide when creating datasets impact how easily users can find and understand them. When creating datasets, provide comprehensive information to help researchers find the data they need to support their studies.
    
    :::

### Metadata
    
    **Metadata** are descriptive details about your genomic dataset that provide context and information about the dataset itself. It includes details pertaining to:

    - **Identification:** Title, description, keywords, and unique identifiers
    - **Responsibility:** Contact points, publisher, creator, and data steward information
    - **Access information:** Rights, availability, licensing, and access restrictions
    - **Others:** Other key information that allows users to locate and access the data.

    In the GDI Catalogue, the metadata appears under **Additional Info** when you open a datase. Here's an example:

<figure>
    <img src="/gdi-userportal-frontend/img/catalogue-managers-guide/manage-datasets/dataset-additional-info.png" alt="Dataset details page showing the newly created dataset" width="700" />
    <figcaption></figcaption>
</figure>

### Data resources

    A **data resource** pertains to the actual genomic data files associated with a dataset. In GDI, you can upload the file or provide links to external data resources. GDI supports common genomic data file formats, including:

    - **VCF (Variant Call Format):** For storing gene sequence variations
    - **FASTA/FASTQ:** For storing raw sequence reads 
    - **BAM/CRAM:** For storing aligned sequence data
    - **CSV/TSV:** For storing tabular data such as phenotypic 

<!-- TODO: verify supported file types -->

Here's an example of a data resource file in a dataset:

<figure>
    <img src="/gdi-userportal-frontend/img/catalogue-managers-guide/manage-datasets/data-resources.png" alt="Dataset details page showing the newly created dataset" width="700" />
    <figcaption></figcaption>
</figure>


    When you add a data resource to your dataset, you provide its metadata—information about the data file, such as its name, description, format, and access details.


:::tip Organising datasets

Datasets in GDI can be organised in serveral ways—such as by **organisation** and **groups**—to help you manage data effectively, while making it easy for researchers to find relevant datasets.

:::  

**What's next:** [Add a dataset](add-a-dataset.md).