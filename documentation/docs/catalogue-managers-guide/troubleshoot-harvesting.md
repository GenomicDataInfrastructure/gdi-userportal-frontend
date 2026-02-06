---
slug: /catalogue-managers-guide/troubleshoot
sidebar_label: "Troubleshoot harvesting"
sidebar_position: 9
---

# Troubleshoot harvest issues

Understand known issues and limitations with the harvesting process.

## Test a harvest source

To verify a harvest source is working correctly:

1. Access the CKAN container terminal
2. Run the command: `ckan --config=/srv/app/ckan.ini harvester run-test <id of harvester>`
   - For FAIR Data Points, the harvester id is the last part of the URL of the harvest source
   - For DCAT-AP sources, the harvester id is the part of the URL of the harvest source

If successful, you'll see datasets uploaded in CKAN.

## Check background processes

The automated harvesting relies on three background processes. If harvesting is not working as expected, verify these processes are running:

```bash
supervisorctl status
```

You should see output showing that these processes are RUNNING:
- `ckan_fetch_consumer`
- `ckan_gather_consumer`
- `crond`

## Known deletion issues

When datasets are removed from the source, they should be deleted from your catalogue during the next harvest. However, there is a known caveat:

**If a dataset is set for deletion and something goes wrong during the `import_stage`, the dataset stays forever as no more current one.**

This means if there's an error during the deletion process, the dataset will remain in the database but not be shown, and won't be properly cleaned up by subsequent harvests.

## MIME type configuration

For DCAT-AP sources, the harvester looks at MIME types to parse files. If you're having issues harvesting DCAT-AP sources:

- For turtle format files (.ttl), you need to provide `text/turtle` as `rdf_format` in the configuration
- For RDF/XML files (.rdf), the MIME type should be `application/rdf+xml`

## Reconfiguring harvest sources

Be aware that if you delete a harvest source and then re-configure it:

**Datasets will be considered "new" rather than updates to existing datasets.**

This means you may end up with duplicate datasets if the original harvested datasets were not deleted before reconfiguring the source.

## FAIR Data Point-specific behaviour

When harvesting from FAIR Data Points:

**If a dataset is moved in FDP from one catalogue to another catalogue (by updating `DCTERMS.isPartOf` reference on the dataset level), it will be considered a new dataset.**

This is because the CKAN harvester guid includes the catalogue id, so moving a dataset between catalogues changes its identifier.

## Next steps

[Review technical specifications](./harvesting-technical-reference.md) - Understand harvest system behaviour

[Monitor and manage sources](./manage-harvest-sources.md) - Manage your harvest sources
