---
title: Fair datapoint
weight: 4
---

<!--
SPDX-FileCopyrightText: 2024 Health-ri.

SPDX-License-Identifier: CC-BY-4.0
-->


## Fair Data Point (FDP) Installation Guide

This guide provides steps to install FDP and configure it with GDI-specific SHACL shapes. For a more comprehensive overview, please refer to the [existing FDP documentation on exposing metadata](https://health-ri.atlassian.net/wiki/spaces/FSD/pages/279183386/Exposing+metadata).

### 1. Installing FDP

1. Follow the installation guide in the documentation linked above to set up FDP in your environment.
2. Ensure that the FDP instance is accessible and that you have administrative rights to configure metadata schemas.

### 2. Installing GDI-Specific SHACLs

To add GDI-specific SHACL validation, perform the following steps:

#### Step 1: Download SHACL Shapes
   - Access the GDI-specific SHACL shapes from this [GDI metadata repository](https://github.com/GenomicDataInfrastructure/gdi-metadata/tree/main/Formulasation(shacl)/core/PiecesShape).
   - Download each SHACL shape file (e.g., `Resource.ttl` and others).

#### Step 2: Upload SHACL Shapes to FDP

1. **Login** to FDP using an admin account.
2. Navigate to **Metadata Schemas** (located in the dropdown under your username).
3. For each shape file:
   - Open the **editor** and paste the contents of `Resource.ttl` (or other shapes).
   - **Add a description** to document the purpose or release information.
   - Ensure the **abstract** checkbox is selected when uploading `Resource.ttl`, as most other classes derive from it.
   - For other shapes, **uncheck the abstract checkbox**.
   - Press **Save and Release** to finalize the shape.
   - Provide a meaningful description and **version number** for the release.
   - Check the **public** checkbox to make the shape accessible.
   - Press **Release** to complete the upload.

Repeat these steps for each SHACL shape file.

### 3. Supported Metadata Fields for Datasets

The following metadata fields are currently supported:

#### Dataset

| Property Name       | Example Data                                                                                                                                                   |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **contact_point**   | VCard(hasEmail=[mailto:data-access-committee@xumc.nl], full_name=[Data Access Committee of the x UMC], hasUID=https://ror.org/05wg1m734)                       |
| **creator**         | Agent(name=[Academic Medical Center], identifier=https://ror.org/05wg1m734)                                                                                    |
| **description**     | This dataset is part of the GDI MS8 milestone, focused on the distributed analysis of COVID-19 cases (GWAS) and allele frequency lookup for infectious diseases. It contains synthetic data designed to replicate COVID-19-related genetic studies, including risk variants associated with severe disease outcomes. The data is used for federated analysis across multiple nodes to identify genomic associations and variant prevalence. |
| **number_of_patients** | 100                                                                                                                                                        |
| **issued**          | 2024-07-01T11:11:11                                                                                                                                            |
| **keywords**        | Covid, Smokers, (free to choose)                                                                                                                               |
| **identifier**      | GDID-[0-9a-f]{8}-[0-9a-f]{4}                                                                                                                                   |
| **modified**        | 2024-06-04T13:36:10.246Z                                                                                                                                       |
| **publisher**       | Agent(name=[Radboud University Medical Center], identifier=https://ror.org/05wg1m734, mbox=[mailto:test@health-ri.nl])                                         |
| **theme**           | http://publications.europa.eu/resource/authority/data-theme/HEAL                                                                                               |
| **title**           | COVID-19 GWAS and Allele Frequency Lookup Dataset for GDI MS 8                                                                                                 |
| **number_of_participant** | 100                                                                                                                                                    |
| **phenotypes**      | Age (min and max)                                                                                                                                              |
| **accessRights**    | DUO:0000006, DUO:0000017, DUO:0000018 (General research use, Infectious Disease research use, Genomic research on complex diseases)                          |


#### Distribution

| Property Name      | Example Data                                                                                              |
|--------------------|----------------------------------------------------------------------------------------------------------|
| **title**          | GWAS and Allele Frequency Lookup Data Distribution for GDI MS8                                           |
| **description**    | VCF file containing COVID-19 case/control data for GDI MS8 demonstration.                                |
| **access_url**     | https://example.com/dataset/GDI-MS8-COVID19.vcf                                                          |
| **media_type**     | https://www.iana.org/assignments/media-types/application/vcf                                             |
| **license**         | https://creativecommons.org/licenses/by-sa/4.0/                                                         |

### 4. Onboarding Metadata

To onboard large datasets more efficiently, you can use a Jupyter notebook to automate this process. Clone the [Sempyro repository](https://github.com/Health-RI/SeMPyRO) and run the notebook using:

```bash
hatch run docs:jupyter lab
```

As a reference, an **MS8 template/example** is available in the `Usage_example_GDI.ipynb` notebook for streamlined metadata upload to FDP.
