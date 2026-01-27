---
slug: /catalogue-managers-guide/harvest-data/dcat-ap
sidebar_label: "Harvest from DCAT-AP endpoints"
sidebar_position: 5
---

# Harvest from DCAT-AP endpoints

Connect to European data portals using the DCAT-AP standard to import standardised public sector datasets.

**What is DCAT-AP:**  
Data Catalog Vocabulary - Application Profile is a European standard for describing public sector data catalogues. Many European national and regional portals use DCAT-AP to expose their metadata.

**Prerequisites:**
- The DCAT-AP endpoint URL (typically ends in `/catalog.rdf` or `/dcat-ap.xml`)
- Understanding of which datasets you want to import
- Permission to harvest from the source portal

<br/>

1. Go to **Harvest Sources** and select **Add Harvest Source**. <!-- VERIFY UI: Menu path and button -->

2. Fill out the source details:

   **URL** - Enter the DCAT-AP endpoint URL <!-- VERIFY UI: Field label -->  
   Common formats:
   - `https://portal.example.eu/catalog.rdf`
   - `https://data.example.eu/dcat-ap.xml`
   
   **Source type** - Select **DCAT-AP** <!-- VERIFY UI: Dropdown option -->
   
   **Title** - Enter a descriptive name  
   Example: "Luxembourg National Data Portal"
   
   **Organisation** - Select which organisation will own the imported datasets <!-- VERIFY UI: Field label -->

3. Configure filters (recommended for large portals):

   - Filter by theme or category
   - Limit to specific organisations
   - Focus on health or genomics-related datasets
   - Set dataset limits to test before full harvest

4. Review metadata mapping:

   - Check default DCAT-AP to CKAN field mapping
   - Adjust if the source uses custom properties
   - Verify required GDI fields are mapped correctly

5. Select **Save** to create the source.

6. Select **Reharvest** to begin importing datasets. <!-- VERIFY UI: Button label -->

## Understand metadata mapping

DCAT-AP metadata is automatically mapped to CKAN fields:

| DCAT-AP Property | CKAN Field | Description |
|-----------------|------------|-------------|
| dcat:Dataset | Package | Dataset record |
| dct:title | title | Dataset title |
| dct:description | notes | Dataset description |
| dcat:keyword | tags | Keywords |
| dcat:theme | groups | Themes/categories |
| dct:publisher | organisation | Publishing organisation |
| dcat:distribution | resources | Data files and links |
| dct:issued | metadata_created | Creation date |
| dct:modified | metadata_modified | Last update date |

Review harvest job logs after import to verify mapping quality.

## Find DCAT-AP endpoints

**EU-level portals:**
- [data.europa.eu](https://data.europa.eu/)<sup>↗</sup> - European Data Portal
- EU Open Data Portal API documentation

**National portals:**
- **Germany:** [GovData.de](https://www.govdata.de/)<sup>↗</sup>
- **France:** [data.gouv.fr](https://www.data.gouv.fr/)<sup>↗</sup>
- **Netherlands:** [data.overheid.nl](https://data.overheid.nl/)<sup>↗</sup>
- **Luxembourg:** [data.public.lu](https://data.public.lu/)<sup>↗</sup>

**How to find endpoints:**
- Visit the portal's API documentation
- Look for "API", "Export", "DCAT", or "RDF" sections
- Check for XML or RDF endpoint URLs
- Contact portal administrators for endpoint details

## Verify endpoint quality

**Test the endpoint before harvesting:**

```bash
curl https://example.com/catalog.rdf
```

Check that the response contains valid DCAT-AP XML or RDF metadata.

**Check DCAT-AP version:**  
DCAT-AP 2.0 or later is recommended for compatibility with GDI requirements. Earlier versions may have incomplete metadata fields.

**Review metadata quality:**
- Ensure required fields are present (title, description, publisher)
- Verify licence information is included
- Check that dataset URLs are accessible
- Confirm temporal coverage is specified where relevant

## Optimise for large portals

National portals may contain thousands of datasets. Use filters to import only relevant data:

**Filter by theme:**
- Health and life sciences
- Research and innovation
- Science and technology

**Filter by organisation:**
- Research institutions
- Healthcare providers
- Genomic data centres

**Limit dataset count initially:**
- Test with 100-500 datasets first
- Verify quality and relevance
- Expand filters after successful test

## Troubleshoot issues

**Invalid endpoint URL**  
- Verify the URL returns DCAT-AP formatted data
- Check for typos in the endpoint address
- Try alternative endpoint formats (.rdf, .xml, .ttl)
- Contact the portal support team

**Incomplete metadata**  
- Check the source portal's data quality
- Some portals have incomplete DCAT-AP implementations
- Consider manual enrichment for critical datasets
- Report quality issues to portal administrators

**Too many datasets imported**  
- Review and refine your filter criteria
- Delete irrelevant datasets manually
- Update harvest source with stricter filters
- Consider multiple harvest sources with specific filters

**Character encoding issues**  
- Verify the endpoint uses UTF-8 encoding
- Check harvest logs for encoding errors
- Contact support if non-English characters are corrupted

## Next steps

[Monitor and manage your sources](./manage-sources.md) - Edit, pause, or delete harvest sources

[Review technical specifications](./technical-specs.md) - Understand harvest timing and behaviour
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
