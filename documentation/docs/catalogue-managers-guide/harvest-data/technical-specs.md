---
slug: /catalogue-managers-guide/technical-specs
sidebar_label: "Technical specifications"
sidebar_position: 8
---

# Technical specifications

Understand harvest timing, limits, and system behaviour to optimise your harvest configuration and troubleshoot issues.

## Harvest timing and frequency

**Standard harvest interval**  
Harvest jobs can be configured with various update frequencies (e.g., daily, weekly, or manual). When set to an automatic interval like daily, a background process automatically triggers the harvester at the end of each specified time interval.

**Custom scheduling**  
Available frequency options include manual, daily, weekly, and other custom intervals. Select "manual" if you want to trigger each harvest manually rather than on an automatic schedule.

**Manual triggers**  
You can trigger a harvest manually at any time by clicking "Reharvest" in the job's Admin section on the harvest source page, regardless of the scheduled interval.

## Initial harvest behaviour

**First harvest characteristics:**
- May take significantly longer than subsequent updates
- Imports all available datasets from the source
- Processes datasets through three stages: gather, fetch, and import
- Creates new dataset records in your catalogue
- All datasets are marked as "new" during the first harvest

**Three-stage harvest process:**
1. **Gather stage:** Identifies objects at the source URL, generates unique GUIDs, and saves them to the database as harvest objects
2. **Fetch stage:** Retrieves complete data for harvested objects if information from gather stage is incomplete
3. **Import stage:** Maps data to CKAN fields and creates/updates/deletes dataset records

**Important considerations:**
- If you delete and reconfigure a harvest source, datasets will be considered "new" again
- Failed deletions during import stage may leave datasets marked as not current indefinitely
- Moving datasets between catalogs in the source may cause them to be treated as new datasets due to GUID generation including catalog references

## Synchronisation behaviour

<!-- VERIFY SYSTEM: How updates and changes are detected -->
**Update detection:**  
The harvester queries the database for previously harvested GUIDs and compares them with GUIDs from the current harvest. Based on this comparison, harvest objects are created and assigned status: `delete`, `new`, or `change`.

**New datasets:**  
Automatically added to your catalogue during each harvest run. Datasets are imported during the import stage after being gathered and fetched.

**Updated datasets:**  
Modified metadata is synchronized from the source. Changes are detected by comparing GUIDs and processing updated datasets during the import stage.

**Deleted datasets:**  
When datasets are removed from the source, the harvester identifies them during the gather stage. These datasets are marked with `'current': False` status and then deleted by calling the package_delete action during the import stage.

**Conflict resolution:**  
The harvester can be configured to prevent overwriting certain fields on update. Without this configuration, harvest updates will overwrite local changes. Field-level protection settings must be configured at the CKAN instance level.
## Performance considerations

**Harvesting large data sources:**

When connecting to sources with thousands of datasets:
- Initial harvest may take several hours
- Subsequent updates are typically faster (only changes are processed)
- Consider using filters to limit scope and improve performance
- Monitor job logs to track progress and identify bottlenecks
- Plan initial harvests during off-peak hours
Long-running harvests may be affected by network interruptions
- Review job logs if harvests fail repeatedly
- Contact support if you experience persistent network issues
- Ensure proper network connectivity between CKAN and the source systemons
- Timeout errors typically trigger automatic retries
- Review job logs if harvests fail repeatedly
- Contact support if you experience persistent network issues

**Optimisation strategies:**
 using the run-test command
- Monitor system resources during large harvests
- Adjust harvest frequency based on source update patterns
- Ensure proper harvester configuration including profiles and compatibility modes for optimal parsing
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

## Monitor harvest operation (e.g., http://localhost:5500/harvest in development)
2. Select your harvest source
3. Select the **Jobs** tab or Admin section
4. Select a specific job to view detailed logs

**Testing harvest operations:**

For development and testing, you can run a harvest test command directly:
```
ckan --config=/srv/app/ckan.ini harvester run-test <id of harvester>
```
The harvester ID is the last part of the URL of the harvest source.

**Background monitoring:**

Three main background processes handle harvesting operations:
- `gather_consumer`: Manages gathering of data sources
- `fetch_consumer`: Fetches data from identified sources  
- `run`: Triggers harvester at specified time intervals

Use `supervisorctl status` to monitor these processes.

**Log information includes:**
- Start and end timestamps
- Job duration
- Number of datasets processed (added, updated, deleted)
- Success or failure status
- Detailed error messages for any failures
- Processing stage information (gather, fetch, import)

**Use logs to:**
- Verify harvest completed successfully
- Identify specific failed datasets or stages
- Diagnose connectivity or configuration
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

[Troubleshoot harvest issues](./troubleshoot.md) - Resolve common problems

[Monitor and manage sources](./manage-sources.md) - Edit, pause, or delete harvest sources
