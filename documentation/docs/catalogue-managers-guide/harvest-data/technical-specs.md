---
slug: /catalogue-managers-guide/harvest-data/technical-specs
sidebar_label: "Technical specifications"
sidebar_position: 3
---

# Technical specifications

In this guide

> [Harvest frequency](#harvest-frequency)  
> [Initial harvest behavior](#initial-harvest-behavior)  
> [Data synchronization](#data-synchronization)  
> [Performance considerations](#performance-considerations)  
> [Data Portal synchronization](#data-portal-synchronization)  
> [Monitor and logs](#monitor-and-logs)

This page documents technical details of how the GDI harvester operates, including timing, limits, and synchronization behavior.

## Harvest frequency

<!-- VERIFY SYSTEM: All values below -->
- **Standard harvest interval:** [NEEDS VERIFICATION]
- **Custom scheduling:** [NEEDS VERIFICATION]
- **Manual trigger:** Available anytime from the harvest source page

## Initial harvest behavior

<!-- VERIFY SYSTEM: All specifications below -->
- **First-time data pull:** [NEEDS VERIFICATION]
- **Dataset limit per harvest:** [NEEDS VERIFICATION]
- **Timeout settings:** [NEEDS VERIFICATION]
- **Retry policy:** [NEEDS VERIFICATION]

## Data synchronization

<!-- VERIFY SYSTEM: Synchronization method -->
- **Update detection:** [NEEDS VERIFICATION]
- **Deletion handling:** [NEEDS VERIFICATION]
- **Conflict resolution:** [NEEDS VERIFICATION]

## Performance considerations

**Large data sources**

When you harvest from sources with many datasets:
- The initial harvest may take several hours
- Consider using filters to limit the scope
- Monitor job logs for performance metrics

**Network reliability**

- The harvester includes automatic retry logic for transient failures
- Long-running harvests may be affected by network interruptions
- Check job logs if harvests fail repeatedly

## Data Portal synchronization

<!-- VERIFY SYSTEM: Data Portal synchronization timing -->
**Publication timing**  
Harvested datasets appear in the [GDI Data Portal](https://portal.gdi.lu/)<sup>↗</sup> after import to the catalogue (for public datasets).

**Update propagation**  
Changes from harvest updates propagate to the Data Portal on the same schedule.

## Monitor and logs

All harvest operations are logged with:
- Start and end timestamps
- Number of datasets processed
- Success/failure status
- Detailed error messages for failures

Access logs: **Harvest Sources** → [Your Source] → **Jobs** tab
