---
slug: /system-admin-guide/fdp
sidebar_label: "Set up FAIR Data Point"
sidebar_position: 10
---

# Set up FAIR Data Point

Install and configure **FAIR Data Point (FDP)** with GDI-specific SHACL shapes to enable standardised metadata management. This guide covers FDP installation, SHACL shape configuration, metadata field specifications, and automated metadata upload.

:::info Additional documentation

For comprehensive FDP setup guidance, see the [Health-RI FDP documentation on exposing metadata](https://health-ri.atlassian.net/wiki/spaces/FSD/pages/279183386/Exposing+metadata).

:::

## Install FAIR Data Point

Follow the installation guide in the Health-RI FDP documentation to set up FDP in your environment. Ensure that your FDP instance is accessible and that you have administrative rights to configure metadata schemas.

## Install GDI-specific SHACL shapes

Add GDI-specific SHACL validation shapes to your FDP instance to ensure metadata compliance with GDI standards.

### Download SHACL shapes

Access the GDI-specific SHACL shapes from the [GDI metadata repository](https://github.com/GenomicDataInfrastructure/gdi-metadata) and download each SHACL shape file (e.g., `Resource.ttl` and others).

### Upload SHACL shapes to FDP

Upload the SHACL shapes to your FDP instance:

1. **Log in to FDP:** Access FDP using an admin account.

2. **Navigate to Metadata Schemas:** Go to Metadata Schemas from the dropdown menu under your username.

3. **Upload each shape file:**
   - Open the editor and paste the contents of `Resource.ttl` (or other shapes)
   - Add a description to document the purpose or release information
   - Select the abstract checkbox when uploading `Resource.ttl`, as most other classes derive from it
   - For other shapes, clear the abstract checkbox
   - Select Save and Release to finalise the shape
   - Provide a meaningful description and version number for the release
   - Select the public checkbox to make the shape accessible
   - Select Release to complete the upload

Repeat these steps for each SHACL shape file.

## Supported metadata fields

The GDI metadata model defines specific fields for datasets and distributions. For complete field specifications, guidance notes, and example values, refer to the [Metadata Submission guide](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/Documentation/Metadata_submission.csv).

### Dataset properties

| Property | Obligation | Description |
| --- | --- | --- |
| `dct:accessRights` | mandatory | Whether the dataset is publicly accessible. Use `PUBLIC` for aggregated/allele-frequency data; `NON_PUBLIC` for subject-level personal data. |
| `dcatap:applicableLegislation` | mandatory | ELI of the applicable legislation (e.g. the EHDS Regulation). |
| `dct:creator` | mandatory | Entity (organisation) responsible for creating the dataset (`foaf:Agent`). |
| `dct:description` | mandatory | Free-text description of the dataset. May be repeated for multiple languages. |
| `dcat:distribution` | mandatory | At least one distribution must be linked. |
| `healthdcatap:hdab` | mandatory* | Health Data Access Body supporting access to the data. |
| `healthdcatap:healthCategory` | mandatory* | EHDS health category from the Commission Regulation Art. 51 list (e.g. human genetic data). |
| `dct:identifier` | mandatory | Primary identifier; recommended format: `Project-Country-Institute-UniqueNumber` (e.g. `GoE_NL_HRI_1`). |
| `dct:publisher` | mandatory | Organisation responsible for making the dataset available (`foaf:Agent`). |
| `dcat:theme` | mandatory | Data theme from the EU Data Theme vocabulary; use `HEAL` for health datasets. |
| `dct:title` | mandatory | Name of the dataset. |
| `dcat:keyword` | recommended | Keywords for discovery (one value per entry, repeat for multiple). |
| `healthdcatap:numberOfRecords` | recommended | Number of data records (rows) in the dataset. |
| `healthdcatap:numberOfUniqueIndividuals` | recommended | Number of unique individuals represented in the dataset. |
| `dct:conformsTo` | optional | Standard the dataset conforms to (e.g. `Externally governed`, `1+MG compliant`). |
| `adms:identifier` | optional | Secondary identifier beyond `dct:identifier`. |
| `adms:status` | optional | Lifecycle status of the metadata record (e.g. `COMPLETED`, `WITHDRAWN`). |
| `dpv:hasLegalBasis` | optional | Legal basis for personal data processing (e.g. `dpv:Consent`). |
| `dct:isReferencedBy` | optional | IRI or DOI of a related publication or resource. |
| `dct:type` | optional | Type of dataset (e.g. `SYNTHETIC_DATA`). |

\* Not yet enforced as mandatory; included for completeness.

### Distribution properties

| Property | Obligation | Description |
| --- | --- | --- |
| `dcat:accessURL` | mandatory | URL to access this distribution. |
| `dcatap:applicableLegislation` | mandatory | ELI of the applicable legislation. |
| `adms:status` | optional | Lifecycle status of the distribution metadata record (e.g. `COMPLETED`, `WITHDRAWN`). |

## Onboard metadata

The [GDI metadata repository](https://github.com/GenomicDataInfrastructure/gdi-metadata/tree/main/Documentation) provides authoritative guidance for understanding and submitting metadata to FDP.

### GDI metadata model

The [GDI Metadata Model Overview](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/Documentation/gdi-metadata-overview.md) describes the complete class hierarchy and namespaces used across the GDI metadata model:

- **Core vocabularies**: DCAT, Dublin Core Terms (DCT), and DCAT-AP for standardised metadata representation
- **Health-specific extensions**: HealthDCAT-AP (`healthdcatap`) for properties such as `hdab`, `healthCategory`, `numberOfRecords`, and `numberOfUniqueIndividuals`
- **Identifiers and status**: ADMS (`adms`) for secondary identifiers and lifecycle status on datasets and distributions
- **Legal and privacy**: DPV for legal basis and ELI for applicable legislation references
- **SHACL validation**: How `.ttl` shape files constrain and validate submitted metadata in FDP

### Metadata submission guide

The [Metadata Submission CSV](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/Documentation/Metadata_submission.csv) provides a field-by-field reference for all dataset, distribution, and data service properties, including cardinality, obligation level (mandatory, recommended, or optional), guidance notes, and example values. A [controlled vocabulary list](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/Documentation/choicelist.csv) (`choicelist.csv`) accompanies the guide with allowed values for enumerated fields.

### Automate metadata upload with SeMPyRO

Automate large-scale metadata uploads using the SeMPyRO Jupyter notebook. Clone the [SeMPyRO repository](https://github.com/Health-RI/SeMPyRO) and run the notebook:

```bash
hatch run docs:jupyter lab
```

The `Usage_example_GDI.ipynb` notebook provides an MS8 template example for streamlined metadata upload to FDP.

:::tip Next steps

After setting up FAIR Data Point:

- [Configure metadata schemas](/system-admin-guide/configure-schemas): Define CKAN dataset fields and validation rules
- [Manage data and services](/system-admin-guide/manage-data-services): Configure harvesters to import FDP metadata
- [Monitor and maintain the system](/system-admin-guide/monitor-maintain): Set up ongoing monitoring and maintenance

:::
