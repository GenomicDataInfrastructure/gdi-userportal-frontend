---
slug: /catalogue-managers-guide/harvest-data/ckan-sources
sidebar_label: "CKAN instances"
sidebar_position: 6
---

# Harvest from CKAN instances

In this guide

> [Configure a CKAN source](#configure-a-ckan-source)  
> [Find API endpoints](#find-api-endpoints)  
> [Avoid duplicates](#avoid-duplicates)  
> [Advanced configuration](#advanced-configuration)  
> [Best practices](#best-practices)  
> [Troubleshoot common issues](#troubleshoot-common-issues)

## Overview

Synchronize datasets from other CKAN catalogues to enable cross-institutional collaboration and maintain distributed dataset collections.

**When to use CKAN harvest:**
- Share datasets between partner institutions running CKAN
- Maintain a central catalogue that aggregates data from multiple CKAN instances
- Keep local copies of important datasets from external CKAN catalogues

## Configure a CKAN source

To set up a CKAN harvest source, you need:
- Access to the CKAN instance URL
- API key (if required for private datasets)

1. Go to **Harvest Sources** → **Add Harvest Source**. <!-- VERIFY UI: Menu path -->

2. Fill out the form:
   - **URL:** Enter the CKAN API endpoint (format: `https://[ckan-instance]/api/3/action/package_list`)
   - **Source type:** Select "CKAN" <!-- VERIFY UI: Exact option name -->
   - **Title:** Descriptive name (example: "Partner Institution Catalogue")
   - **Organization:** Select your organization

3. Add authentication (if needed):
   - In **Advanced options**, enter API key
   - Required only for accessing private datasets

4. Configure filters (optional):
   - Filter by organization
   - Filter by tags or groups
   - Limit to specific datasets

5. Select **Save**.

6. Select **Reharvest** to start the harvest. <!-- VERIFY UI: Button label -->

## Find API endpoints

To find the correct CKAN API endpoint:

1. Open the source CKAN instance in your web browser.
2. Go to the API documentation (usually at `/api`).
3. Look for the Action API v3 endpoint.
4. Use `package_list` or `package_search` actions.

**Example endpoints:**
- Package list: `https://example.org/api/3/action/package_list`
- Package search: `https://example.org/api/3/action/package_search`

## Avoid duplicates

When you harvest from multiple CKAN instances, use filters to prevent duplicate datasets.

**Filter by organization:**
```json
{
  "fq": "organization:specific-org"
}
```

**Filter by tags:**
```json
{
  "fq": "tags:genomics"
}
```

**Exclude already harvested datasets:**  
The harvester automatically tracks source IDs to prevent duplicates from the same source.

## Advanced configuration

**Harvest private datasets**

To harvest private datasets from another CKAN instance:

1. Obtain an API key from the source CKAN instance.
2. Ensure the API key has access to the datasets.
3. Add the API key in harvest source advanced options.
4. Decide visibility: keep private or make public in your catalogue.

**Custom metadata schemas**

If the source CKAN uses custom schemas:

1. Document the custom fields.
2. Configure field mapping in advanced options.
3. Test with a small subset first.
4. Verify all important metadata is preserved.

**Filter by query**

Use CKAN's search query syntax to filter datasets:

```json
{
  "fq": "tags:genomics AND organization:university",
  "rows": 100
}
```

## Best practices

**Verify API accessibility**  
Test the API endpoint before you set up the harvest:
```bash
curl https://example.org/api/3/action/package_list
```

**Coordinate with source administrators**  
- Inform them of your harvest plans
- Understand their update schedule
- Respect their terms of use

**Monitor source changes**  
- Watch for CKAN upgrades at the source
- Monitor for schema changes
- Adjust mapping if needed

**Respect harvest frequency**  
- Don't over-harvest (excessive API calls)
- Align frequency with source update schedule
- Consider the source system's load

## Troubleshoot common issues

**API version mismatch**
- Verify the source CKAN version
- Use the appropriate API version
- Consult CKAN API documentation

**Authentication failures**
- Check API key is valid and not expired
- Verify API key permissions
- Ensure API key is correctly configured

**Incomplete datasets**
- Some fields may not transfer if source uses custom schema
- Review field mapping configuration
- Consider manual enrichment for missing fields

**Rate limiting**
- Source may limit API calls
- Reduce harvest frequency if you encounter errors
- Contact source administrators about limits

:::warning DATASET OWNERSHIP

Harvested datasets from other CKAN instances belong to your organization in your catalogue, but the original source is tracked. Always respect the original data provider's licensing and attribution requirements.

:::
