---
slug: /catalogue-managers-guide/harvest-data/troubleshoot
sidebar_label: "Troubleshoot"
sidebar_position: 7
---

# Troubleshoot harvest issues

In this guide

> [Check harvest job logs](#check-harvest-job-logs)  
> [Authentication errors](#authentication-errors)  
> [No datasets imported](#no-datasets-imported)  
> [Incomplete metadata](#incomplete-metadata)  
> [Slow or timeout issues](#slow-or-timeout-issues)  
> [Duplicate datasets](#duplicate-datasets)  
> [Job stuck in running state](#job-stuck-in-running-state)  
> [Network and connectivity issues](#network-and-connectivity-issues)  
> [Data quality issues](#data-quality-issues)

Always check the harvest job logs for detailed error messages before you troubleshoot.

## Check harvest job logs

To view detailed harvest logs:

1. Go to **Harvest Sources**.
2. Select your harvest source.
3. Select the **Jobs** tab.
4. Select the specific job to investigate.
5. Review the detailed log output.

**What to look for in logs:**
- Error messages and stack traces
- Number of datasets processed
- Specific dataset failures
- Network connectivity issues
- Authentication problems
- Timeout warnings

## Authentication errors

**Symptoms:**
- Job status shows "Authentication failed"
- Error logs mention 401 or 403 errors
- No datasets are imported

**Solutions:**
- Verify API credentials are correct and current
- Check if the source requires updated authentication tokens
- Ensure your API key has necessary permissions
- Verify your IP address is not blocked by the source
- Contact the source administrator to confirm your access

## No datasets imported

**Symptoms:**
- Harvest job completes successfully but 0 datasets imported
- Job logs show no errors
- Source should contain datasets

**Solutions:**
- Verify the source URL is correct and accessible
- Test the URL in a browser or with curl
- Check if filters are too restrictive
- Review the source's dataset visibility settings
- Ensure the source contains public datasets (unless you have authenticated access)
- Check if datasets match your filter criteria

## Incomplete metadata

**Symptoms:**
- Datasets import but missing key information
- Required fields are empty
- Descriptions or titles are truncated

**Solutions:**
- Review metadata mapping configuration
- Check if the source provides all required DCAT-AP fields
- Verify the source's metadata quality
- Consider manual enrichment for critical missing fields
- Adjust field mapping in advanced options
- Contact source administrators about metadata completeness

## Slow or timeout issues

**Symptoms:**
- Harvest jobs take hours to complete
- Jobs fail with timeout errors
- Progress stalls partway through

**Solutions:**
- Reduce the number of datasets per harvest using filters
- Contact support to adjust timeout settings
- Consider splitting large sources into multiple harvest jobs
- Schedule harvests during off-peak hours
- Check network connectivity and bandwidth
- Monitor source system availability

## Duplicate datasets

**Symptoms:**
- Same dataset appears multiple times
- Dataset titles or IDs are duplicated

**Solutions:**
- Check if you have multiple harvest sources pointing to the same endpoint
- Review harvest source configuration
- Use filters to prevent overlap between harvest sources
- Check if source has duplicate datasets
- Clean up duplicates manually if necessary

## Job stuck in running state

**Symptoms:**
- Job shows as running for extended period
- No progress updates in logs
- Cannot start new harvest

**Solutions:**
- Wait for automatic timeout (may take several hours)
- Contact support to manually terminate the job
- Check if source system is responsive
- Review system logs for errors
- Restart the harvest after termination

## Datasets deleted unexpectedly

**Symptoms:**
- Datasets that were harvested are now missing
- Harvest logs show deletions

**Solutions:**
- Check if datasets were removed from source
- Review deletion handling policy in harvest configuration
- Verify source is still accessible
- Check if harvest source URL changed
- Review harvest job logs for deletion events

## Incorrect metadata mapping

**Symptoms:**
- Data appears in wrong fields
- Tags or categories are incorrect
- Relationships are broken

**Solutions:**
- Review metadata mapping configuration
- Check if source uses custom schema
- Adjust field mapping in advanced options
- Test mapping with sample dataset
- Document source-specific mapping requirements

## Network and connectivity issues

**Source is unreachable**

Symptoms:
- Connection timeout errors
- DNS resolution failures
- Network unreachable messages

Solutions:
- Verify source URL is correct
- Check if source system is online
- Test connectivity from your network
- Check firewall rules
- Verify DNS configuration
- Contact network administrators

**SSL/TLS certificate errors**

Symptoms:
- Certificate validation failures
- SSL handshake errors

Solutions:
- Verify source uses valid SSL certificate
- Check certificate expiration
- Contact source administrators about certificate issues
- Review SSL/TLS configuration requirements

## Data quality issues

**Encoding problems**

Symptoms:
- Special characters display incorrectly
- Non-English text is garbled

Solutions:
- Check source encoding (UTF-8 recommended)
- Review character encoding configuration
- Contact source administrators about encoding

**Invalid dates or numbers**

Symptoms:
- Date fields show errors
- Numeric values are incorrect

Solutions:
- Check source date format
- Review number format (decimal separators, etc.)
- Adjust parsing configuration if available
