---
slug: /catalogue-managers-guide/harvest-data/troubleshoot
sidebar_label: "Troubleshoot harvest issues"
sidebar_position: 9
---

# Troubleshoot harvest issues

Resolve common harvest problems by reviewing job logs and applying targeted solutions.

**Start here:** Always check harvest job logs for detailed error messages before troubleshooting.

## Check harvest job logs

1. Go to **Harvest Sources**. <!-- VERIFY UI: Menu path -->
2. Select your harvest source.
3. Select the **Jobs** tab. <!-- VERIFY UI: Tab label -->
4. Select the specific job to investigate.
5. Review the detailed log output.

**Look for in logs:**
- Error messages and stack traces
- Authentication failures (401, 403 errors)
- Network connectivity issues
- Specific dataset processing failures
- Timeout warnings
- Number of datasets successfully processed

## Authentication fails

**Symptoms:**
- Job status shows "Authentication failed"
- Error logs show 401 Unauthorized or 403 Forbidden
- No datasets are imported

**Solutions:**
1. Verify API credentials are current and correctly entered
2. Check if authentication tokens need renewal
3. Confirm your API key has necessary permissions
4. Verify your IP address is not blocked by the source
5. Test API access manually using curl
6. Contact source administrators to confirm your access rights

**Test authentication:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://source-url/api
```

## No datasets imported

**Symptoms:**
- Harvest job completes successfully but imports 0 datasets
- Job logs show no errors
- Source should contain datasets

**Solutions:**
1. Verify the source URL is correct and accessible in a browser
2. Check if filters are too restrictive
3. Review the source's dataset visibility (public vs private)
4. Ensure you have authentication if accessing private datasets
5. Verify datasets at the source match your filter criteria
6. Test the endpoint URL manually

**Test the endpoint:**
```bash
curl https://source-url/catalog.rdf
```

## Incomplete or missing metadata

**Symptoms:**
- Datasets import but are missing key information
- Required fields are empty
- Descriptions or titles are truncated or garbled

**Solutions:**
1. Review metadata mapping configuration
2. Check if the source provides all required DCAT-AP fields
3. Verify the source's metadata quality
4. Adjust field mapping in advanced options
5. Consider manual enrichment for critical missing fields
6. Contact source administrators about metadata completeness
7. Check character encoding (UTF-8 recommended)

## Harvest jobs time out or run slowly

**Symptoms:**
- Harvest jobs take many hours to complete
- Jobs fail with timeout errors
- Progress stalls partway through
- Log shows repeated connection attempts

**Solutions:**
1. Reduce dataset count using more specific filters
2. Contact support to adjust timeout settings
3. Split large sources into multiple smaller harvest jobs
4. Schedule harvests during off-peak hours
5. Check network connectivity and bandwidth
6. Monitor source system availability and response time
7. Review source system load (it may be experiencing high traffic)

**Optimisation strategies:**
- Start with 100-500 datasets to test configuration
- Gradually increase scope after successful tests
- Use theme or organisation filters to reduce load
- Harvest during low-traffic periods

## Duplicate datasets

**Symptoms:**
- Same dataset appears multiple times in your catalogue
- Dataset titles or identifiers are duplicated
- Multiple records point to the same source data

**Solutions:**
1. Check if you have multiple harvest sources pointing to the same endpoint
2. Review and compare harvest source configurations
3. Use filters to prevent overlap between harvest sources
4. Verify the source doesn't contain duplicate datasets
5. Manually remove duplicates if necessary
6. Document filter criteria to prevent future duplicates

## Harvest job stuck

**Symptoms:**
- Job shows "Running" status for many hours with no progress
- No new log entries appear
- Cannot start a new harvest

**Solutions:**
1. Wait for automatic timeout (may take several hours)
2. Contact support to manually terminate the stuck job
3. Check if the source system is still responding
4. Review system resource usage
5. Check for network interruptions
6. After termination, review logs before restarting

## Datasets deleted unexpectedly

**Symptoms:**
- Previously harvested datasets are missing from your catalogue
- Harvest logs show deletion events
- Dataset count decreased after harvest

**Solutions:**
1. Check if datasets were removed from the source
2. Review deletion handling policy in harvest configuration
3. Verify the source is still accessible
4. Check if the harvest source URL changed
5. Review harvest job logs for deletion events
6. Contact source administrators about removed datasets
7. Consider pausing harvest if deletions are unexpected

## Incorrect metadata mapping

**Symptoms:**
- Data appears in wrong fields
- Tags or categories are incorrectly assigned
- Dataset relationships are broken
- Field values don't match source

**Solutions:**
1. Review metadata mapping configuration in harvest source settings
2. Check if the source uses a custom metadata schema
3. Adjust field mapping in advanced options
4. Test mapping with a small sample dataset first
5. Document source-specific mapping requirements
6. Verify DCAT-AP version compatibility
7. Contact support for complex mapping scenarios

## Network and connectivity issues

**Source unreachable:**

**Symptoms:**
- Connection timeout errors
- DNS resolution failures
- "Network unreachable" messages

**Solutions:**
1. Verify the source URL is correct (check for typos)
2. Check if the source system is online and accessible
3. Test connectivity using ping or curl
4. Review firewall rules that might block access
5. Verify DNS configuration
6. Try accessing from a different network
7. Contact network administrators

**SSL/TLS certificate errors:**

**Symptoms:**
- Certificate validation failures
- SSL handshake errors
- "Invalid certificate" warnings

**Solutions:**
1. Verify the source uses a valid SSL certificate
2. Check certificate expiration date
3. Ensure certificate matches the domain name
4. Contact source administrators about certificate issues
5. Check if your system trusts the certificate authority

## Data quality and encoding issues

**Character encoding problems:**

**Symptoms:**
- Special characters display incorrectly (� symbols)
- Non-English text appears garbled
- Accents and diacritics are corrupted

**Solutions:**
1. Verify the source uses UTF-8 encoding
2. Check harvest logs for encoding errors
3. Review character set configuration
4. Contact source administrators about encoding standards
5. Test with datasets containing special characters

**Invalid dates or numbers:**

**Symptoms:**
- Date fields show errors or incorrect values
- Numeric values are wrong or unparseable
- Format validation errors in logs

**Solutions:**
1. Check the source's date format (ISO 8601 recommended)
2. Review number formatting (decimal separators, thousands separators)
3. Adjust parsing configuration if available
4. Contact source administrators about format standards
5. Document expected formats for reference

## Get additional help

If you've tried the solutions above and still experience issues:

1. Gather diagnostic information:
   - Harvest source configuration
   - Complete error logs from failed jobs
   - Source URL and type
   - Number of datasets at source
   - When the problem started

2. Contact support with:
   - Detailed problem description
   - Steps you've already tried
   - Diagnostic information
   - Screenshots of error messages

## Next steps

[Review technical specifications](./technical-specs.md) - Understand harvest system behaviour

[Monitor and manage sources](./manage-sources.md) - Edit or pause problematic sources
