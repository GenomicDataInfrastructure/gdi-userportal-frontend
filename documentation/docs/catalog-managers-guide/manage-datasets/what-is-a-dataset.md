---
slug: what-is-a-dataset
sidebar_label: "What is a dataset?"
sidebar_position: 1
---

# What is a dataset?

A dataset is a structured collection of data that describes a specific subject. In GDI, this subject is *genomic data*.

In GDI, a **dataset** is a comprehensive record that describes a genomic data. For example, a genomic data for *COVID-19 Viral Sequences* can include dataset records describing *patient data*, *virus samples*, and contextual information like the *publisher* of the data and its *access and usage permissions*.  


## Dataset components

A dataset in GDI has two sets of information that together provide a complete picture of the genomic data: metadata and data resources.

    :::tip Why is this important?

     The information you provide when creating datasets impacts how easily users can find and understand the dataset. When creating datasets, provide comprehensive **metadata** and accurate **data resource** descriptions to help researchers find the data they need to support their studies.
    
    :::

### Metadata
    
    **Metadata** are descriptive details about your genomic dataset that provide context and information about the dataset itself. In GDI, these details appear under "Additional Info", which includes details pertaining to:

    - **Identification:** Title, description, keywords, and unique identifiers
    - **Responsibility:** Contact points, publisher, creator, and data steward information
    - **Coverage details:** Geographic and temporal scope
    - **Access information:** Rights, availability, licensing, and access restrictions
    - **Others:** Other key information that allows users to locate and access the data.

### Data resources

    A **data resource** is the actual genomic data or information described by the dataset. This can be a file or a link to the file, asset, or database containing the genomic data. GDI supports the following file types as data resources:

    - **VCF (Variant Call Format):** For storing gene sequence variations
    - **FAST/FASTQ:** For storing raw sequence reads 
    - **BAM/CRAM:** For storing aligned sequence data
    - **CSV/TSV:** For storing tabular data such as phenotypic 

<!-- TODO: verify supported file types -->

    Each data resource also has its own metadata (descriptive details), including:

    - **Access details:** URLs for viewing or downloading the data
    - **Technical specifications:** File format, media type, file size, and compression details
    - **Descriptions:** What each specific file or resource contains
    - **Legal information:** Licensing, rights, and availability status 
    - **Other:** Other relevant information that helps users understand and assess the data if it meets their research needs.

## Dataset organisation and management

Datasets in GDI are organised in a structured way that helps you manage and organise your data:

- **Organisation:** When you add a dataset, you associate it with an organisation. This is typically the entity who is responsible for managing the dataset in the system.  
- **Groups:** You can organise datasets into groups based on different categories such as projects, research topics, or study cohorts. This makes it easier for researchers to find related datasets.
- **Activity tracking:** Every dataset keeps a record of changes, such as when new files are added, existing files are updated, or when users follow the dataset. This helps track what's happening with your data over time.

**What's next:** [Add a dataset](add-a-dataset.md).