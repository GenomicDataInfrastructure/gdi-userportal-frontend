---
slug: /catalogue-managers-guide/what-is-a-dataset
sidebar_label: "What is a dataset?"
sidebar_position: 3
---

# What is a dataset?

In GDI, a **dataset** is a structured collection of genomic information pertaining to human health, diseases, and research studies. A dataset can be a single file or a collection of files that provide comprehensive information about a specific research topic, disease area, or study cohort. For example, a genomic data for _COVID-19 Viral Sequences_ can include dataset records describing _patient data_, _virus samples_, and _sequencing results_.

When you add a dataset to the GDI Data Catalogue, you provide two types of information that together give a complete picture of the genomic subject: **metadata** describes the dataset itself, and **data resources** are the actual genomic data files associated with the dataset. 

## Metadata

**Metadata** (displayed as **Additional Info** in the portal) are descriptive details about your genomic dataset that provide context and information about the dataset itself. It includes details pertaining to:

    - **Identification:** Title, description, keywords, and unique identifiers
    - **Responsibility:** Contact points, publisher, creator, and data steward information
    - **Access information:** Rights, availability, licensing, and access restrictions
    - **Others:** Other key information that allows users to locate and access the data.

## Data resources

**Data resources** pertain to the actual genomic data files associated with a dataset. In GDI, you can upload the file or provide links to external data resources. GDI supports common genomic data file formats, including:

    - **VCF (Variant Call Format):** For storing gene sequence variations
    - **FASTA/FASTQ:** For storing raw sequence reads
    - **BAM/CRAM:** For storing aligned sequence data
    - **CSV/TSV:** For storing tabular data such as phenotypic

<!-- TODO: verify supported file types -->

:::tip Organising datasets

Datasets in GDI can be organised in several ways—such as by **organisation** and **groups**—to help you manage data effectively, while making it easy for researchers to find relevant datasets.

:::

**What's next:** [Add a dataset](./manage-datasets-manually/add)
