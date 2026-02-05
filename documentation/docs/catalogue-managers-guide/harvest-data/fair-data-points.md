---
slug: /catalogue-managers-guide/fair-data-points
sidebar_label: "Harvest from FAIR Data Points"
sidebar_position: 4
---

# Harvest from FAIR Data Points

Connect to FAIR Data Points to import scientific datasets that follow FAIR principles (Findable, Accessible, Interoperable, Reusable).

**What are FAIR Data Points:**  
Standardised metadata endpoints for scientific data that ensure data can be easily found and reused by researchers. Learn more about [FAIR principles](https://www.go-fair.org/fair-principles/)<sup>↗</sup>.

**Prerequisites:**
- The FAIR Data Point base URL
- API token (if required by the source)
- Permission to harvest from the FDP

<br/>

1. Go to **Harvest Sources** and select **Add Harvest Source**. <!-- VERIFY UI: Menu path and button -->

2. Fill out the source details:

   **URL** - Enter the FAIR Data Point base URL <!-- VERIFY UI: Field label -->  
   Format: `https://[hostname]/fdp`
   
   **Source type** - Select **FAIR Data Point** <!-- VERIFY UI: Dropdown option -->
   
   **Title** - Enter a descriptive name  
   Example: "ELIXIR Luxembourg FDP"
   
   **Organisation** - Select which organisation will own the imported datasets <!-- VERIFY UI: Field label -->

3. Configure authentication (if required):

   - Select **Advanced options**
   - Enter your API token
   - Confirm the token format with the FDP administrator

4. Select **Save** to create the source.

5. Select **Reharvest** to begin importing datasets. <!-- VERIFY UI: Button label -->

## Verify the harvest

**Before you create the source:**
- Open the FDP URL in your browser to verify it's accessible
- Check that metadata is returned correctly
- Confirm you have necessary access permissions

**After the first harvest:**
- Review imported datasets for metadata completeness
- Check that required GDI fields are populated
- Verify data quality meets your standards

## Troubleshoot issues

**Authentication fails**  
- Verify your API token is current and correctly formatted
- Contact the FDP administrator to confirm access permissions
- Check that your IP address is allowed (if the FDP has IP restrictions)

**Metadata incomplete**  
- Review the source FDP's metadata quality
- Check if all DCAT-AP required fields are provided by the source
- Consider manual enrichment for critical missing fields
- Contact the source administrator about data quality issues

**Connection timeouts**  
- Large FDPs with many datasets may respond slowly
- Try harvesting during off-peak hours
- Contact support to request timeout setting adjustments
- Consider using filters to reduce the dataset count

**Datasets not updating**  
- Check the FDP's last modified timestamps
- Verify your harvest schedule is appropriate
- Review harvest job logs for synchronisation errors
- Confirm the FDP supports incremental updates

## Next steps

[Monitor and manage your sources](./manage-sources.md) - Edit, pause, or delete harvest sources

[Review technical specifications](./technical-specs.md) - Understand harvest timing and behaviour
