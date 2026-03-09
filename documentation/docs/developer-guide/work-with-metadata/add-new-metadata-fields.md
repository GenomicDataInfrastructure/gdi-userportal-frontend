---
title: Add new metadata fields
sidebar_position: 2
---

<!--
SPDX-FileCopyrightText: 2024 Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Add new metadata fields

Follow these steps to add, modify, or delete fields across various components of the CKAN ecosystem, including DCAT-AP schema updates, Solr search configuration, SeMPyRO, Discovery Service, and FAIR Data Point (FDP).

## Table of contents

1. [CKAN DCAT Model](#ckan-dcat-model)
2. [Solr Search Integration](#solr-search-integration)
3. [SeMPyRO](#sempyro)
4. [FAIR Data Point](#fair-data-point)
5. [Discovery Service](#discovery-service)

---

## CKAN DCAT model

When a schema change falls under DCAT-AP 3 or an earlier version of DCAT-AP but is not yet present, follow these steps:

### Step 1: Fork and Clone the Repository

```bash
git clone https://github.com/ckan/ckanext-dcat
```

### Step 2: Add the New Field to the Schema

- Modify the schema file: `ckanext/dcat/schemas/dcat_ap_full.yaml`
- Use appropriate field types (e.g., text, repeating subfield, URI)
- Follow examples from other fields for consistency

For more information about scheming, see [Understand CKAN schemas](../develop-extensions/understand-ckan-schemas.md).

### Step 3: Extend the Existing Mapping

Modify the mapping files depending on the DCAT-AP version, located in the directory: `ckanext/dcat/profiles`

### Step 4: Fix the Corresponding Unit Tests

Update unit tests to reflect the new field additions.

### Step 5: Create a Pull Request

Create a pull request to the CKAN DCAT extension repository. Ensure that you follow the contributing guidelines for CKAN:

- Include unit tests for the new fields
- Ensure compatibility across different DCAT-AP versions

### Step 6: Update GDI Repositories

After a new release, update development and production Dockerfiles in these repositories (order is important):

1. [gdi-userportal-ckanext-fairdatapoint](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-fairdatapoint)
2. [gdi-userportal-ckan-docker](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker)

Check if CKAN locally works with the newly added fields by harvesting an example FDP.

### Example of New Field

An example of a missing mapping in CKAN DCAT can be found here:  
[Multi-valued field creator in CKAN DCAT](https://github.com/ckan/ckanext-dcat/pull/302).

:::warning Bidirectional Mapping
Always take into account the mapping from CKAN → DCAT in addition to DCAT → CKAN.
:::

---

## Solr search integration

If you're adding a new field in CKAN and you want it to be searchable via Solr, follow these steps to modify the `schema.xml` file.

### Step 1: Define the Field Type and Name

In the top part of the `schema.xml` file, define the type and name of the new field. The type specifies how Solr will handle the data in the field (e.g., as `text`, `integers`, `dates`, etc.).

- Navigate to the section in `schema.xml` where other fields are defined
- Add your new field with its corresponding type

**Example:**

```xml
<field name="custom_field" type="string" indexed="true" stored="true" />
```

Here, `custom_field` is the name of the field, and it's set as a string type. It is also indexed (which makes it searchable) and stored (so it can be returned in search results).

### Step 2: Add the Field to Search

In the lower part of the `schema.xml` file, you'll need to add this field to the list of fields that are searchable by Solr. This is typically done in a section that defines which fields are indexed for searches.

**Example:**

```xml
<copyField source="custom_field" dest="text" />
```

This example maps the `custom_field` to the `text` field, which Solr uses for full-text searches. By adding the `copyField` directive, you're instructing Solr to include the contents of `custom_field` in the search index.

### Step 3: Release a New Version and Update

When finished, release a new version and update [gdi-userportal-ckan-docker](https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker) in the development and production Dockerfile.

### Configuration Notes

#### Indexing vs Storing

- **indexed="true"**: The field can be used in searches
- **stored="true"**: The field can be retrieved in search results

#### Testing the Configuration

After making these changes, you should restart your Solr instance and reindex your CKAN data to ensure that the new field is indexed and searchable with the command:

```bash
ckan -c /etc/ckan/default/ckan.ini search-index rebuild
```

---

## SeMPyRO

[SeMPyRO](https://github.com/Health-RI/SeMPyRO) handles semantic metadata parsing.

### Prerequisites

Fields are easy to add to SeMPyRO. You'll need to know a few things:

- The **predicate** of the field
- **Cardinality** (single or multiple-valued)
- **Range** or datatype

### Adding a Field

Once that's identified, go to the relevant class and add a property as follows. Here's an example of the `type` property of `HRI_Dataset`:

```python
type: List[AnyHttpUrl] = Field(
    default=None,
    description="The nature or genre of the resource. HRI recommended",
    rdf_term=DCTERMS.type,
    rdf_type="uri")
```

**Line 1**: `type` is the name of the property. Its range is an `AnyHttpUrl`, which is a helper for any URL. Other examples include `LiteralField` or classes like `Agent` or `VCard`. It is multi-valued because it's in a `List`. If the maximum cardinality is one, it should not be in a `List`.

**Line 2**: `default=None` indicates the field is optional and by default undefined. Leave this line out for mandatory fields.

**Line 3**: A human-readable description of the field.

**Line 4**: The predicate definition. In this case, it's `dcterms:type`. Some common namespaces, like `DCTERMS` and `DCAT`, are imported by default. A full URI can also be defined, for example with `URIRef("http://example.com/range#property")`.

**Line 5**: The RDF type. There are many possible values here, such as `rdfs_literal`, `xsd:string`, or `uri`. It's recommended to look at other properties to understand what is necessary.

### Regenerate Schemas

Once this is done, the JSON and YAML schemas need to be re-generated. For the `HRIDataset` class, this can be done by running:

```bash
hatch run python sempyro/hri_dcat/hri_dataset
```

---

## FAIR data point

For the technical point of view, updating the appropriate **SHACL shapes** allows for adding fields.

### Steps to Add a Field in FDP

1. In the FDP, log in as an admin user and go to the **Metadata schemas** option
2. Select the resource to update (e.g., **Catalogue**)
3. In the **Form Definition** textarea, add a new entry in the list of `sh:property` values. For example:

```turtle
[
  sh:path my:new-property ;      # the predicate IRI
  sh:nodeKind sh:Literal ;       # the value type
  sh:minCount 1 ;                # cardinality
  dash:viewer dash:LiteralViewer ;  # UI hint for displaying
  dash:editor dash:TextFieldEditor ; # UI hint for editing
]
```

4. Click **Save** if this is a draft and needs further work, or **Save and release** if the work is done
5. Add a description and select a version number
6. Click **Release**

For detailed FDP configuration, see [Configure FAIR Data Point](./configure-fair-datapoint.md).

---

## Discovery service

The **Dataset Discovery** service requires two parts to be updated: the **OpenAPI definitions** and the **mapping**.

### OpenAPI Definition

Two definitions need to be updated, both located in the `src/main/openapi` folder:

#### ckan.yaml

This file contains the API returned by CKAN. Based on this YAML, Java classes are automatically generated corresponding to the API definition. For adding a field to a **Dataset**, the primary change will likely be in the **CkanPackage** definition. See the examples there on how to add a property.

#### discovery.yaml

This file defines what the Discovery service should return. You can make this definition whatever you want it to be—it does not have to correspond one-to-one with CKAN. To add a property here, modify the **RetrievedDataset** definition. Again, see the examples in the file.

### Mapping

Once you have changed the definitions, follow these steps:

#### Step 1: Compile and Regenerate Classes

```bash
mvn clean compile
```

The command will probably generate a bunch of errors, but will regenerate the classes reflecting the OpenAPI objects.

#### Step 2: Add the Mapping

Add the mapping between the CKAN and Discovery service fields. The main place you want to look is most likely:

`src/main/java/io/github/genomicdatainfrastructure/discovery/utils/PackageShowMapper.java`

Modify the `RetrievedDatasetBuilder`. See the code there for examples on how to map fields.

#### Step 3: Update Test Cases

Test cases are found in:

`src/test/java/io/github/genomicdatainfrastructure/discovery/services/PackageShowMapperTest.java`

Make sure to update:
1. Empty dataset examples
2. Filled examples

You'll need to update both the `CkanPackage` objects (which reflect the CKAN API output) as well as the expected output, which is in the form of a `RetrievedDataset`.

#### Step 4: Test

Test using both automatic testing `mvn test`, as well as run the package (`mvn compile quarkus:dev`) and check with Postman if mapping and output is as expected.

---

## Next steps

- [Understand metadata structure](./understand-metadata-structure.md) - Learn storage patterns
- [Configure FAIR Data Point](./configure-fair-datapoint.md) - Set up FDP
- [Supported metadata fields](./supported-metadata-fields.md) - View current fields
- [Configure harvesting](../configure-harvesting/index.md) - Set up data harvesting
