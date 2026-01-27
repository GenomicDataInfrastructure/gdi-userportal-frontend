---
slug: /catalogue-managers-guide/harvest-data/dcat-ap
sidebar_label: "DCAT-AP endpoints"
sidebar_position: 5
---

# Harvest from DCAT-AP endpoints

In this guide

> [Configure a DCAT-AP source](#configure-a-dcat-ap-source)  
> [Metadata mapping](#metadata-mapping)  
> [Find DCAT-AP endpoints](#find-dcat-ap-endpoints)  
> [Best practices](#best-practices)  
> [Troubleshoot common issues](#troubleshoot-common-issues)

DCAT-AP (Data Catalog Vocabulary - Application Profile) is a European standard for describing public sector data catalogues. Many European data portals expose their metadata using DCAT-AP.

## Configure a DCAT-AP source

1. Go to **Harvest Sources** → **Add Harvest Source**. <!-- VERIFY UI: Menu path -->

2. Fill out the form:
   - **URL:** Enter the DCAT-AP endpoint URL (typically ends in `/catalog.rdf` or `/dcat-ap.xml`)
   - **Source type:** Select "DCAT-AP" <!-- VERIFY UI: Exact option name -->
   - **Title:** Descriptive name (example: "National Data Portal")
   - **Organization:** Select your organization

3. Configure metadata mapping:
   - Review default DCAT-AP to CKAN field mapping
   - Adjust if the source uses custom properties

4. Select **Save**.

5. Select **Reharvest** to start the harvest. <!-- VERIFY UI: Button label -->

## Metadata mapping

DCAT-AP metadata is automatically mapped to CKAN fields:

| DCAT-AP Property | CKAN Field |
|-----------------|------------|
| dcat:Dataset | Package (Dataset) |
| dct:title | title |
| dct:description | notes (description) |
| dcat:keyword | tags |
| dcat:theme | groups |
| dct:publisher | organization |
| dcat:distribution | resources |
| dct:issued | metadata_created |
| dct:modified | metadata_modified |

Review the mapping in harvest job logs to ensure data quality.

## Find DCAT-AP endpoints

Many European portals provide DCAT-AP exports:

**EU-level portals:**
- [data.europa.eu](https://data.europa.eu/)<sup>↗</sup>
- European Data Portal API

**National portals:**
- Check your country's open data portal documentation
- Look for "API", "Export", or "DCAT" sections

**Discovery:**
- Visit the portal's API documentation
- Look for RDF, XML, or DCAT endpoints
- Contact the portal administrators

## Best practices

**Verify endpoint format**  
Ensure the endpoint returns valid DCAT-AP:
```bash
curl https://example.com/catalog.rdf
```

**Check DCAT-AP version**  
Different versions may have different properties. DCAT-AP 2.0+ is recommended for compatibility with GDI requirements.

**Use filters wisely**  
Large national portals may contain thousands of datasets:
- Filter by theme/category if possible
- Limit to relevant organizations
- Focus on genomic/health-related datasets

**Monitor metadata quality**  
After harvest:
- Check that required fields are populated
- Review dataset descriptions for completeness
- Verify license information is present

## Troubleshoot common issues

**National portals:**
- Germany: GovData.de
- France: data.gouv.fr
- Netherlands: data.overheid.nl
- Many others across Europe

## Troubleshooting

**Invalid RDF/XML**
- Verify the endpoint URL is correct
- Check if the endpoint requires specific headers
- Test the URL in an RDF validator

**Missing required fields**
- Not all DCAT-AP sources include all fields
- Review metadata completeness before harvest
- Plan for manual enrichment if needed

**Large dataset harvests timeout**
- Use filters to reduce scope
- Contact support to adjust timeout settings
- Consider harvest in batches

**Metadata appears in wrong language**
- Check if source provides multilingual metadata
- Configure language preferences in advanced options
- DCAT-AP supports multiple languages per field
