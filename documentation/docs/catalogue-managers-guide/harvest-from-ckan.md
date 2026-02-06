---
slug: /catalogue-managers-guide/ckan-sources
sidebar_label: "Harvest from CKAN catalogues"
sidebar_position: 8
---

# Harvest from CKAN catalogues

Synchronise datasets from partner CKAN catalogues to enable cross-institutional collaboration and maintain distributed dataset collections.

**Use CKAN harvesting to:**
- Share datasets between partner institutions running CKAN
- Maintain a central catalogue that aggregates data from multiple CKAN instances
- Keep local copies of important datasets from external catalogues
- Enable seamless collaboration across the GDI network

**Prerequisites:**
- The CKAN instance URL
- API key (if accessing private datasets)
- Permission to harvest from the source

<br/>

1. Go to **Harvest Sources** and select **Add Harvest Source**. <!-- VERIFY UI: Menu path and button -->

2. Fill out the source details:

   **URL** - Enter the CKAN API endpoint <!-- VERIFY UI: Field label -->  
   Format: `https://[ckan-instance]/api/3/action/package_list`  
   Example: `https://catalogue.example.org/api/3/action/package_list`
   
   **Source type** - Select **CKAN** <!-- VERIFY UI: Dropdown option -->
   
   **Title** - Enter a descriptive name  
   Example: \"Partner Institution Catalogue\"
   
   **Organisation** - Select which organisation will own the imported datasets <!-- VERIFY UI: Field label -->

3. Configure authentication (for private datasets):

   - Select **Advanced options**
   - Enter your API key from the source CKAN instance
   - Verify the API key has access to required datasets

4. Set filters (recommended):

   **Filter by organisation:**
   ```json
   {
     \"fq\": \"organization:specific-org\"
   }
   ```

   **Filter by tags:**
   ```json
   {
     \"fq\": \"tags:genomics\"
   }
   ```

   **Limit dataset count:**
   ```json
   {
     \"rows\": 100
   }
   ```

5. Select **Save** to create the source.

6. Select **Reharvest** to begin importing datasets. <!-- VERIFY UI: Button label -->

## Find the correct API endpoint

1. Open the source CKAN instance in your browser.
2. Navigate to `/api` to view API documentation.
3. Look for the Action API v3 section.
4. Use the `package_list` or `package_search` endpoint.

**Common endpoint formats:**
- Package list: `https://example.org/api/3/action/package_list`
- Package search: `https://example.org/api/3/action/package_search`

**Test the endpoint:**
```bash
curl https://example.org/api/3/action/package_list
```

## Prevent duplicate datasets

The harvester automatically tracks source IDs to prevent duplicates from the same source. When harvesting from multiple CKAN instances, use filters to avoid importing the same datasets twice.

**Coordinate with other catalogues:**
- Document which sources you're harvesting from
- Use organisation or tag filters for clear boundaries
- Review harvested datasets regularly for duplicates

## Harvest private datasets

To import private datasets from another CKAN catalogue:

1. Obtain an API key from the source CKAN instance.
2. Verify the API key has access permissions for the private datasets.
3. Add the API key in harvest source advanced options.
4. Choose whether to keep datasets private or make them public in your catalogue.

**Security considerations:**
- Store API keys securely
- Use separate API keys for each harvest source
- Respect the source catalogue's access control policies
- Regularly review and rotate API keys

## Handle custom metadata schemas

If the source CKAN uses custom metadata schemas:

1. Review the source schema documentation.
2. Document custom fields you need to preserve.
3. Configure field mapping in advanced harvest options.
4. Test with a small dataset subset first.
5. Verify all important metadata is transferred correctly.

## Coordinate with source administrators

**Before you start harvesting:**
- Inform source administrators of your plans
- Understand their dataset update schedule
- Confirm you have permission to harvest
- Agree on appropriate harvest frequency
- Respect their terms of use and attribution requirements

**Ongoing communication:**
- Report any harvest issues promptly
- Notify them if you stop harvesting
- Coordinate before making major configuration changes
- Share feedback about data quality

## Troubleshoot issues

**API version mismatch**  
- Verify the source CKAN version (check `/api` page)
- Use the appropriate API version (v3 recommended)
- Consult [CKAN API documentation](https://docs.ckan.org/en/2.11/api/)<sup>↗</sup> for version differences

**Authentication fails**  
- Confirm your API key is current and not expired
- Verify the API key has necessary permissions
- Check the API key is correctly entered in advanced options
- Test the API key directly using curl

**Datasets incomplete or missing fields**  
- Review the source catalogue's metadata schema
- Check field mapping configuration
- Some custom fields may not transfer automatically
- Consider manual enrichment for critical missing metadata

**Rate limiting or timeout errors**  
- The source may limit API request frequency
- Reduce your harvest frequency
- Contact source administrators about rate limits
- Consider harvesting during off-peak hours

**Harvest jobs fail repeatedly**  
- Check source CKAN instance availability
- Review error messages in harvest job logs
- Verify network connectivity to source
- Test API endpoint accessibility manually

:::warning DATASET OWNERSHIP AND ATTRIBUTION

Harvested datasets belong to your organisation in your catalogue, but the original source is tracked in metadata. Always respect the original data provider's licensing terms, attribution requirements, and usage policies.

:::

## Next steps

[Monitor and manage your sources](./manage-harvest-sources.md) - Edit, pause, or delete harvest sources

[Review technical specifications](./harvesting-technical-reference.md) - Understand harvest timing and behaviour
