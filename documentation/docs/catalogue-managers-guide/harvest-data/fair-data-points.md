---
slug: /catalogue-managers-guide/harvest-data/fair-data-points
sidebar_label: "FAIR Data Points"
sidebar_position: 4
---

# Harvest from FAIR Data Points

In this guide

> [Configure a FAIR Data Point source](#configure-a-fair-data-point-source)  
> [Best practices](#best-practices)  
> [Troubleshoot common issues](#troubleshoot-common-issues)

FAIR Data Points follow the [FAIR principles](https://www.go-fair.org/fair-principles/)<sup>↗</sup> (Findable, Accessible, Interoperable, Reusable) and provide standardized metadata access for scientific data.

## Configure a FAIR Data Point source

To set up a FAIR Data Point harvest source, you need:
- Access to the FAIR Data Point URL
- API token (if required - contact the FDP administrator)

1. Go to **Harvest Sources** → **Add Harvest Source**. <!-- VERIFY UI: Menu path -->

2. Fill out the form:
   - **URL:** Enter the FAIR Data Point base URL (format: `https://[hostname]/fdp`)
   - **Source type:** Select "FAIR Data Point" <!-- VERIFY UI: Exact option name -->
   - **Title:** Descriptive name (example: "Institution XYZ FDP")
   - **Organization:** Select your organization

3. Add authentication (if required):
   - In **Advanced options**, enter your API token
   - Format depends on the FDP implementation (check with the source administrator)

4. Select **Save**.

5. Select **Reharvest** to start the harvest. <!-- VERIFY UI: Button label -->

## Best practices

**Verify accessibility**  
Before you create the harvest source:
- Open the FDP URL in your web browser
- Check if it returns valid metadata
- Ensure you have necessary permissions

**Test with small datasets**  
If possible, test the harvest with a subset of data first to verify:
- Metadata mapping is correct
- All required fields are populated
- Data quality meets your standards

**Review metadata mapping**  
After the first harvest:
- Check that GDI required fields are populated
- Review metadata quality in imported datasets
- Adjust mapping configuration if needed

**Monitor regularly**  
- Check harvest job logs periodically
- Ensure datasets update as expected
- Watch for schema changes at the source

## Troubleshoot common issues

**Authentication failures**
- Verify your API token is current
- Check token format matches the FDP's requirements
- Contact the FDP administrator to confirm your access

**Incomplete metadata**
- Review the FDP's metadata completeness
- Check if all DCAT-AP required fields are provided
- Consider manual enrichment for critical missing fields

**Connection timeouts**
- Large FDPs may take time to respond
- Contact support to adjust timeout settings if needed
- Consider filtering to reduce dataset count
