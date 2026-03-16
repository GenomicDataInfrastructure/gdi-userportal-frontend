---
slug: /developer-guide/add-metadata-fields
sidebar_label: "Add metadata fields"
sidebar_position: 3
description: "Add new fields across CKAN, Solr, and services"
---

<!--
SPDX-FileCopyrightText: 2024 Health-RI.

SPDX-License-Identifier: CC-BY-4.0
-->

# Add metadata fields

Add, modify, or delete metadata fields across the CKAN ecosystem, including DCAT-AP schema updates, Solr search configuration, SeMPyRO, Discovery Service, and FAIR Data Point (FDP).

In this guide

> [CKAN DCAT Model](#ckan-dcat-model)  
> [Solr search integration](#solr-search-integration)  
> [SeMPyRO](#sempyro)  
> [FAIR Data Point (FDP)](#fair-data-point-fdp)  
> [Discovery Service](#discovery-service)  

## CKAN DCAT Model

To add DCAT-AP fields missing from the upstream CKAN DCAT extension:

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/ckan/ckanext-dcat
   ```

2. **Add the new field to the schema:**

    - Modify the schema file: `ckanext/dcat/schemas/dcat_ap_full.yaml`
    - Use appropriate field types (e.g., text, repeating subfield, URI).
    - Follow examples from other fields for consistency.

    For more information about scheming, see: [Work with CKAN schemas](/developer-guide/work-with-ckan-schemas).

3. **Extend the existing mapping depending on the DCAT-AP version.** Modify the mapping files located in the directory: `ckanext/dcat/profiles`.

   :::tip Example
   See [PR #302](https://github.com/ckan/ckanext-dcat/pull/302) for a practical example of how to implement mapping for multi-valued fields like `creator` in CKAN DCAT profiles.
   :::

4. **Fix the corresponding unit tests.**

5. **Create a pull request to the CKAN DCAT extension repository.** Ensure that you follow the contributing guidelines for CKAN:
    - Include unit tests for the new fields.
    - Ensure compatibility across different DCAT-AP versions.

6. **Update the following repositories after a new release.** Update development and production Dockerfiles in these repositories( order is important):

    - https://github.com/GenomicDataInfrastructure/gdi-userportal-ckanext-fairdatapoint
    - https://github.com/GenomicDataInfrastructure/gdi-userportal-ckan-docker
    
    Check if CKAN locally works with the new added fields by harvesting an example FDP. 


:::info Note

Always take into account the mapping from CKAN → DCAT in addition to DCAT → CKAN.

:::

## Solr search integration

To make new CKAN fields searchable via Solr, modify the `schema.xml` file.

To add and configure a searchable field:

1. **Define the field type and name.** In the top part of the `schema.xml` file, define the type and name of the new field. The type specifies how Solr will handle the data in the field (e.g., as `text`, `integers`, `dates`, etc.).

    Find the section in `schema.xml` where other fields are defined, and then add your new field with its corresponding type.

    Example:
     ```xml
     <field name="custom_field" type="string" indexed="true" stored="true" />
     ```

    In this example, `custom_field` is the field name with `string` type. The `indexed="true"` attribute enables searching, while `stored="true"` allows retrieval in results.

    :::note Indexing vs Storing

    - **indexed="true"**: The field can be used in searches.
    - **stored="true"**: The field can be retrieved in search results.

    :::


2. **Add the field to search.** Alternative text: In the lower part of the `schema.xml` file, add a `copyField` directive to include the new field in the search index. This allows Solr to use the contents of the new field when performing searches.

    Example:
     ```xml
     <copyField source="custom_field" dest="text" />
     ```
    This example maps the `custom_field` to the text field, which Solr uses for full-text searches. By adding the `copyField` directive, you're instructing Solr to include the contents of `custom_field` in the search index.

3. **Release a new version and update.** After modifying the `schema.xml` file, release a new version of the Solr configuration. Then, update the GenomicDataInfrastructure/gdi-userportal-ckan-docker repository to ensure that the new Solr configuration is used in both development and production environments when running CKAN with Docker Compose.

4. **Test your configuration.** After making these changes, restart your Solr instance and reindex your CKAN data to ensure that the new field is indexed and searchable with the command: 
    ```
    ckan -c /etc/ckan/default/ckan.ini search-index rebuild
    ```


## SeMPyRO

[SeMPyRO](https://github.com/Health-RI/SeMPyRO) validates and transforms metadata between different semantic formats. To extend SeMPyRO with new fields, define the field's RDF properties in the appropriate Python class.

1. **Define field properties.** Before adding a field, identify these required properties:
    - **Predicate** - The RDF term for the field
    - **Cardinality** - Single or multiple-valued
    - **Range** - The datatype or class

2. **Add the field to the class.** Go to the relevant class and add a property definition. Example for the `type` property in `HRI_Dataset`:

    ```python
    type: List[AnyHttpUrl] = Field(
        default=None,
        description="The nature or genre of the resource. HRI recommended",
        rdf_term=DCTERMS.type,
        rdf_type="uri")
    ```

    Each field is defined as a class property with the following structure: 

    - **Line 1**: Property name and range. Use `List[]` for multi-valued fields (cardinality > 1). Common range types include `AnyHttpUrl`, `LiteralField`, or classes like `Agent` or `VCard`.
    - **Line 2**: Set `default=None` for optional fields. Omit this line for mandatory fields.
    - **Line 3**: Human-readable description of the field.
    - **Line 4**: RDF predicate (e.g., `DCTERMS.type`). Common namespaces like `DCTERMS` and `DCAT` are imported by default. Define custom predicates with `URIRef("http://example.com/range#property")`.
    - **Line 5**: RDF type such as `rdfs_literal`, `xsd:string`, or `uri`. Review other properties in the class for guidance.

3. **Regenerate schemas.** Regenerate the JSON and YAML schemas. For the `HRIDataset` class:

    ```bash
    hatch run python sempyro/hri_dcat/hri_dataset
    ```

## FAIR Data Point (FDP)

From a technical point of view, updating the appropriate **SHACL shapes** allows for adding of fields.

To add a field in FDP:

1. In the FDP, log in as an admin user and go to the **Metadata schemas** option.
2. Select the resource to update (e.g. **Catalog**).
3. In the **Form Definition** textarea, add a new entry in the list of `sh:property` values. For example:

    ```bash
    [
    sh:path my:new-property ;      # the predicate IRI
    sh:nodeKind sh:Literal ;       # the value type
    sh:minCount 1 ;                # cardinality
    dash:viewer dash:LiteralViewer ;  # UI hint for displaying
    dash:editor dash:TextFieldEditor ; # UI hint for editing
    ]
    ```

4. Select **Save** if this is a draft and needs further work, or **Save and release** if the work is done.
5. Add a description and select a version number.
6. Select **Release**.

## Discovery Service

Update the Discovery Service to include the new field in both the OpenAPI definitions and the mapping between CKAN and the Discovery Service.

1. **Update OpenAPI definition.** Include the new field in both the CKAN API and the Discovery Service API. Both files are located in the `src/main/openapi` folder:

    - **`ckan.yaml`:** Contains the API returned by CKAN. Based on this YAML, Java classes are automatically generated corresponding to the API definition. For adding a field to a **Dataset**, the primary change will likely be in the **CkanPackage** definition. See the examples there on how to add a property.
    - **`discovery.yaml`:** Defines what the Discovery service should return. You can make this definition whatever you want it to be—it does not have to correspond one-to-one with CKAN. To add a property here, modify the **RetrievedDataset** definition. Again, see the examples in the file.

2. **Update the mapping**. Run the following command to regenerate the Java classes based on the OpenAPI definitions:

    ```bash
    mvn clean compile
    ```

    :::info Expected errors
    This command regenerates the classes reflecting the OpenAPI objects. Compilation errors are expected until the mapping is completed in the next step.
    :::

3. **Add the mapping between the CKAN and Discovery service fields.** 

    - Modify the `RetrievedDatasetBuilder` in `src/main/java/io/github/genomicdatainfrastructure/discovery/utils/PackageShowMapper.java`. 
    - Review existing field mappings in this file for implementation patterns.

4. **Update test cases.** 

    - Update the test cases in `src/test/java/io/github/genomicdatainfrastructure/discovery/services/PackageShowMapperTest.java`. 
    - Update both empty and filled dataset examples, ensuring that both the `CkanPackage` objects (representing CKAN API output) and the expected `RetrievedDataset` output reflect the new fields.

5. **Verify the implementation** with automated testing (`mvn test`) and manual testing. Run the application (`mvn compile quarkus:dev`) and use Postman to confirm that the mapping and output match expectations.
