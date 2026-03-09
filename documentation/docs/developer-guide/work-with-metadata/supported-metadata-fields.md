---
title: Supported metadata fields
sidebar_position: 4
---

<!--
SPDX-FileCopyrightText: 2024 Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Supported metadata fields for datasets

Review the metadata fields currently supported by the GDI User Portal for datasets and distributions.

## Dataset fields

Datasets support these metadata fields:

| Property Name       | Example Data                                                                                                                                                   |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **contact_point**   | VCard(hasEmail=[mailto:data-access-committee@xumc.nl], full_name=[Data Access Committee of the x UMC], hasUID=https://ror.org/05wg1m734)                       |
| **creator**         | Agent(name=[Academic Medical Centre], identifier=https://ror.org/05wg1m734)                                                                                    |
| **description**     | This dataset is part of the GDI MS8 milestone, focused on the distributed analysis of COVID-19 cases (GWAS) and allele frequency lookup for infectious diseases. It contains synthetic data designed to replicate COVID-19-related genetic studies, including risk variants associated with severe disease outcomes. The data is used for federated analysis across multiple nodes to identify genomic associations and variant prevalence. |
| **number_of_patients** | 100                                                                                                                                                        |
| **issued**          | 2024-07-01T11:11:11                                                                                                                                            |
| **keywords**        | Covid, Smokers, (free to choose)                                                                                                                               |
| **identifier**      | GDID-[0-9a-f]{8}-[0-9a-f]{4}                                                                                                                                   |
| **modified**        | 2024-06-04T13:36:10.246Z                                                                                                                                       |
| **publisher**       | Agent(name=[Radboud University Medical Centre], identifier=https://ror.org/05wg1m734, mbox=[mailto:test@health-ri.nl])                                         |
| **theme**           | http://publications.europa.eu/resource/authority/data-theme/HEAL                                                                                               |
| **title**           | COVID-19 GWAS and Allele Frequency Lookup Dataset for GDI MS 8                                                                                                 |
| **number_of_participant** | 100                                                                                                                                                    |
| **phenotypes**      | Age (min and max)                                                                                                                                              |
| **accessRights**    | DUO:0000006, DUO:0000017, DUO:0000018 (General research use, Infectious Disease research use, Genomic research on complex diseases)                          |

## Distribution fields

Distributions support these metadata fields:

| Property Name      | Example Data                                                                                              |
|--------------------|----------------------------------------------------------------------------------------------------------|
| **title**          | GWAS and Allele Frequency Lookup Data Distribution for GDI MS8                                           |
| **description**    | VCF file containing COVID-19 case/control data for GDI MS8 demonstration                                 |
| **access_url**     | https://example.com/dataset/GDI-MS8-COVID19.vcf                                                          |
| **media_type**     | https://www.iana.org/assignments/media-types/application/vcf                                             |
| **licence**        | https://creativecommons.org/licenses/by-sa/4.0/                                                          |

## Field types and formats

### Contact Point (VCard)

Structure:
- `hasEmail`: Contact email address (mailto: format)
- `full_name`: Full name of contact person or committee
- `hasUID`: Organisation identifier (preferably ROR ID)

### Creator and Publisher (Agent)

Structure:
- `name`: Organisation or person name
- `identifier`: Organisation identifier (ROR ID recommended)
- `mbox`: Optional email address (mailto: format)

### Dates and Times

- **issued**: Publication date (ISO 8601 format: YYYY-MM-DDTHH:MM:SS)
- **modified**: Last modification date (ISO 8601 format)

### Identifiers

- **identifier**: Unique dataset identifier (pattern: GDID-[0-9a-f]{8}-[0-9a-f]{4})
- **theme**: Theme/category URI from EU data themes
- **media_type**: IANA media type URI

### Access Rights

Use Data Use Ontology (DUO) codes:
- DUO:0000006 - General research use
- DUO:0000017 - Infectious disease research use
- DUO:0000018 - Genomic research on complex diseases

## Extending metadata fields

To add new fields to this list:

1. Follow the [Add new metadata fields](./add-new-metadata-fields.md) guide
2. Update SHACL shapes in [FDP configuration](./configure-fair-datapoint.md)
3. Update CKAN schemas following [schema documentation](../develop-extensions/understand-ckan-schemas.md)
4. Test harvesting from FDP to CKAN

## Next steps

- [Add new metadata fields](./add-new-metadata-fields.md) - Extend the schema
- [Configure FAIR Data Point](./configure-fair-datapoint.md) - Set up FDP
- [Understand metadata structure](./understand-metadata-structure.md) - Learn storage patterns
