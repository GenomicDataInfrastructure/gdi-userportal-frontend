---
title: Configure FAIR data point
sidebar_position: 3
---

<!--
SPDX-FileCopyrightText: 2024 Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Configure FAIR data point (FDP)

Follow these steps to install FDP and configure it with GDI-specific SHACL shapes.

For a more comprehensive overview, please refer to the [existing FDP documentation on exposing metadata](https://health-ri.atlassian.net/wiki/spaces/FSD/pages/279183386/Exposing+metadata).

## Install FDP

1. Follow the installation guide in the documentation linked above to set up FDP in your environment
2. Ensure that the FDP instance is accessible and that you have administrative rights to configure metadata schemas

## Install GDI-specific SHACLs

To add GDI-specific SHACL validation, perform the following steps:

### Step 1: Download SHACL Shapes

- Access the GDI-specific SHACL shapes from the [GDI metadata repository](https://github.com/GenomicDataInfrastructure/gdi-metadata/tree/main/Formulasation(shacl)/core/PiecesShape)
- Download each SHACL shape file (e.g., `Resource.ttl` and others)

### Step 2: Upload SHACL Shapes to FDP

1. **Log in** to FDP using an admin account
2. Navigate to **Metadata Schemas** (located in the dropdown under your username)
3. For each shape file:
   - Open the **editor** and paste the contents of `Resource.ttl` (or other shapes)
   - **Add a description** to document the purpose or release information
   - Ensure the **abstract** checkbox is selected when uploading `Resource.ttl`, as most other classes derive from it
   - For other shapes, **uncheck the abstract checkbox**
   - Press **Save and Release** to finalise the shape
   - Provide a meaningful description and **version number** for the release
   - Check the **public** checkbox to make the shape accessible
   - Press **Release** to complete the upload

Repeat these steps for each SHACL shape file.

## Onboard metadata

To onboard large datasets more efficiently, you can use a Jupyter notebook to automate this process.

### Using SeMPyRO

1. Clone the [SeMPyRO repository](https://github.com/Health-RI/SeMPyRO)
2. Run the notebook using:

```bash
hatch run docs:jupyter lab
```

As a reference, an **MS8 template/example** is available in the `Usage_example_GDI.ipynb` notebook for streamlined metadata upload to FDP.

## SHACL shape structure

When adding fields to SHACL shapes, use the following format:

```turtle
[
  sh:path my:new-property ;      # the predicate IRI
  sh:nodeKind sh:Literal ;       # the value type
  sh:minCount 1 ;                # cardinality
  dash:viewer dash:LiteralViewer ;  # UI hint for displaying
  dash:editor dash:TextFieldEditor ; # UI hint for editing
]
```

### Common Shape Properties

- **sh:path**: The property predicate IRI
- **sh:nodeKind**: Value type (sh:Literal, sh:IRI, etc.)
- **sh:minCount / sh:maxCount**: Cardinality constraints
- **sh:datatype**: Specific datatype (xsd:string, xsd:dateTime, etc.)
- **dash:viewer**: UI component for display
- **dash:editor**: UI component for editing

## Validate configurations

After uploading shapes:

1. Test by creating a new dataset in FDP
2. Verify all fields appear correctly in the form
3. Check validation rules are enforced
4. Ensure data can be harvested by CKAN

## Next steps

- [Supported metadata fields](./supported-metadata-fields.md) - View available fields
- [Add new metadata fields](./add-new-metadata-fields.md) - Extend schemas
- [Configure harvesting](../configure-harvesting/index.md) - Harvest from FDP
