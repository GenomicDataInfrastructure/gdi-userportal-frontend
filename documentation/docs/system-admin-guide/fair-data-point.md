---
slug: /system-admin-guide/fdp
sidebar_label: "Set up FAIR Data Point"
sidebar_position: 10
---

# Set up FAIR Data Point

Use **FAIR Data Point (FDP)** to publish GDI metadata in a standardised RDF format that can be harvested by the User Portal.

The operational FDP setup is maintained outside this repository:

- Follow the [starter-kit deployment guide](https://github.com/GenomicDataInfrastructure/starter-kit/blob/main/deployment-guide.md#fair-data-point) to deploy FDP and connect the instance to the User Portal.
- Use the [GDI metadata repository](https://github.com/GenomicDataInfrastructure/gdi-metadata) to update SHACL shapes on an FDP instance.
- Use the [GDI metadata documentation](https://github.com/GenomicDataInfrastructure/gdi-metadata/tree/main/Documentation) as the source of truth for the current metadata model, field obligations, guidance notes, and controlled vocabularies.

## Deploy FDP

Deploy FDP by following the [FAIR Data Point section of the starter-kit deployment guide](https://github.com/GenomicDataInfrastructure/starter-kit/blob/main/deployment-guide.md#fair-data-point). That guide covers the FDP Docker Compose setup, default accounts, production deployment references, Kubernetes resources, and the information that must be shared so the User Portal can harvest the FDP instance.

## Update SHACL shapes

The GDI SHACL shapes are maintained in the [gdi-metadata repository](https://github.com/GenomicDataInfrastructure/gdi-metadata). Do not update the FDP metadata schemas manually in the FDP UI unless you are explicitly testing a local draft.

Use the automated schema tool from `gdi-metadata` to publish the current shapes:

1. Open [`schema-tool/.env`](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/schema-tool/.env).
2. Set `FDP_HOST` to the FDP instance that should receive the update.
3. Set `FDP_USER` and `FDP_PWD` to credentials for an FDP admin user.
4. From `schema-tool/`, run:

   ```bash
   docker compose up
   ```

The tool uses [`schema-tool/Properties.yaml`](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/schema-tool/Properties.yaml) to combine the shape files, define parent-child relations, and publish the intended shapes to FDP.

## Metadata model

The current GDI metadata model is documented in [`gdi-metadata/Documentation`](https://github.com/GenomicDataInfrastructure/gdi-metadata/tree/main/Documentation):

- [`gdi-metadata-overview.md`](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/Documentation/gdi-metadata-overview.md) describes the class hierarchy, namespaces, and validation approach.
- [`Metadata_submission.csv`](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/Documentation/Metadata_submission.csv) is the field-by-field submission guide, including obligation level, cardinality, guidance notes, and example values.
- [`choicelist.csv`](https://github.com/GenomicDataInfrastructure/gdi-metadata/blob/main/Documentation/choicelist.csv) lists controlled vocabulary values used by enumerated fields.

## Onboard metadata

Automate large-scale metadata uploads using the SeMPyRO Jupyter notebook. Clone the [SeMPyRO repository](https://github.com/Health-RI/SeMPyRO) and run the notebook:

```bash
hatch run docs:jupyter lab
```

Use the `Usage_example_GDI.ipynb` notebook as an example for submitting GDI metadata to FDP.

:::tip Next steps

After setting up FAIR Data Point:

- [Configure metadata schemas](/system-admin-guide/configure-schemas): Define CKAN dataset fields and validation rules
- [Manage data and services](/system-admin-guide/manage-data-services): Configure harvesters to import FDP metadata
- [Monitor and maintain the system](/system-admin-guide/monitor-maintain): Set up ongoing monitoring and maintenance

:::
