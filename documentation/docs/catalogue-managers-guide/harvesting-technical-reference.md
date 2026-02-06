---
slug: /catalogue-managers-guide/technical-specs
sidebar_label: "Harvesting technical reference"
sidebar_position: 10
---

# Technical specifications

Understand harvest timing, limits, and system behaviour to optimise your harvest configuration and troubleshoot issues.

## Harvest timing and frequency

<!-- VERIFY SYSTEM: Actual harvest intervals and scheduling options -->
**Standard harvest interval**  
[NEEDS VERIFICATION] - Check with system administrators for default schedule

**Custom scheduling**  
[NEEDS VERIFICATION] - Available options for custom harvest frequencies

**Manual triggers**  
You can trigger a harvest manually at any time from the harvest source page, regardless of the scheduled interval.

## Initial harvest behaviour

<!-- VERIFY SYSTEM: First-time harvest specifications -->
**First harvest characteristics:**
- May take significantly longer than subsequent updates
- Imports all available datasets from the source
- Processes datasets in batches
- Creates new dataset records in your catalogue

**Timeout settings:** [NEEDS VERIFICATION]  

**Dataset limits:** [NEEDS VERIFICATION]  

**Retry policy:** [NEEDS VERIFICATION] - Automatic retry behaviour for failed harvests

## Synchronisation behaviour

<!-- VERIFY SYSTEM: How updates and changes are detected -->
**Update detection:** [NEEDS VERIFICATION]  
How the harvester identifies changed datasets at the source

**New datasets:**  
Automatically added to your catalogue during each harvest run

**Updated datasets:**  
Modified metadata is synchronised from the source

**Deleted datasets:** [NEEDS VERIFICATION]  
Behaviour when datasets are removed from the source

**Conflict resolution:** [NEEDS VERIFICATION]  
How the system handles conflicts between local edits and source updates

## Performance considerations

**Harvesting large data sources:**

When connecting to sources with thousands of datasets:
- Initial harvest may take several hours
- Subsequent updates are typically faster (only changes are processed)
- Consider using filters to limit scope and improve performance
- Monitor job logs to track progress and identify bottlenecks
- Plan initial harvests during off-peak hours

**Network reliability:**

- The harvester includes automatic retry logic for transient network failures
- Long-running harvests may be affected by network interruptions
- Timeout errors typically trigger automatic retries
- Review job logs if harvests fail repeatedly
- Contact support if you experience persistent network issues

**Optimisation strategies:**

- Use specific filters rather than harvesting entire catalogues
- Schedule harvests during low-traffic periods
- Start with a small test harvest before full import
- Monitor system resources during large harvests
- Adjust harvest frequency based on source update patterns

## Data Portal synchronisation

<!-- VERIFY SYSTEM: Data Portal publication timing -->
**Publication to GDI Data Portal:**

Harvested datasets appear in the [GDI Data Portal](https://portal.gdi.lu/)<sup>↗</sup> after import to the catalogue (for public datasets only).

**Update propagation:**  
Changes from harvest updates propagate to the Data Portal on the same schedule as manually created datasets.

**Private datasets:**  
Private harvested datasets remain visible only within your organisation and do not appear in the public Data Portal.

## Monitor harvest operations

**Access harvest logs:**

1. Go to **Harvest Sources**
2. Select your harvest source
3. Select the **Jobs** tab
4. Select a specific job to view detailed logs

**Log information includes:**
- Start and end timestamps
- Job duration
- Number of datasets processed (added, updated, deleted)
- Success or failure status
- Detailed error messages for any failures
- Network and connectivity information
- Processing performance metrics

**Use logs to:**
- Verify harvest completed successfully
- Identify specific failed datasets
- Diagnose authentication or connectivity issues
- Monitor processing time and performance
- Track changes over time

## System limits and quotas

<!-- VERIFY SYSTEM: Any limits on harvest operations -->

**Potential limits to be aware of:**
- Maximum datasets per harvest run
- API rate limits from source systems
- Network timeout thresholds
- Storage quota for harvested datasets
- Concurrent harvest job limits

Contact system administrators for specific limit information applicable to your GDI instance.

## Next steps

[Troubleshoot harvest issues](./troubleshoot-harvesting.md) - Resolve common problems

[Monitor and manage sources](./manage-harvest-sources.md) - Edit, pause, or delete harvest sources
