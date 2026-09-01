---
slug: /search-by-allele-frequency
sidebar_label: "Search by allele frequency"
sidebar_position: 3
---

# Search by allele frequency

Search for datasets containing specific genomic variants using the allele frequency search tool. **Allele frequency** refers to how common a specific genetic variant is within a population.

This search tool allows you to:

- **Identify relevant datasets** with your specific genomic variant of interest
- **Compare variant frequencies** across different populations and research cohorts
- **Assess dataset suitability** by viewing detailed prevalence data to select the most appropriate datasets for your research

## Search by allele frequency

1. Select **Allele Frequency** from the main menu.

2. Select a **Ref Genome**, for example, `GRCh37` or `GRCh38`.

<figure>
<img src="img/explore-datasets/allele-frequency.png" alt="Screenshot showing Allele Frequency option in main navigation menu" width="900" />
<figcaption></figcaption>
</figure>

3. In **Variant**, enter any of the following formats:
   - **Chromosome and position:** For example, `21-9411449`.
   - **Chromosome, position, reference allele, and alternate allele:** For example, `21-9411449-G-T`.

   Once you enter a variant, more fields appear to allow you to filter your search. If you enter an unsupported variant format, the application displays an error message and disables the search until you correct the value.

4. Optionally select one or more filters: **sex**, **country of birth**, and **dataset type**.

<figure>
   <img src="img/explore-datasets/allele-frequency-optional-fields.png" alt="Screenshot showing Allele Frequency option in main navigation menu" width="900" />
   <figcaption></figcaption>
</figure>
      
5. Select **Search** or press **Enter**. The search results display matching datasets in a table.
<figure>
   <img src="img/explore-datasets/allele-frequency-result.png" alt="Screenshot showing Allele Frequency search results" width="900" />
   <figcaption></figcaption>
</figure>

6. To view a dataset's population-level rows, select its expand control (`>`).

<figure>
   <img src="img/explore-datasets/allele-frequency-result-details.png" alt="Screenshot showing allele frequency result details" width="900" />
   <figcaption></figcaption>
</figure>

## Understanding your results

The search results display datasets containing your specified variant in a table with the following columns:

- **Beacon:** The identifier and, when available, country of the Beacon source. The portal uses Beacon technology to retrieve information about whether genomic databases contain specific variants.
- **Dataset:** The identifier of the matching dataset. Select the identifier to open the dataset details in a new window.
- **Dataset Type:** The category of the dataset.
- **Population:** The population identifier from the dataset, in Genome of Europe (GoE) format. This shows the specific subpopulation for the variant data based on combinations of country of birth and sex. For example:
  - `FR_M`: French males
  - `ES_F`: Spanish females
  - `FR`: All individuals born in France (all sexes)
  - `M`: All males (all countries)

  Population identifiers use ISO3166 2-letter country codes (e.g., FR for France, ES for Spain) combined with sex (M for male, F for female).

- **Allele Count:** The number of times the variant appears in the dataset.
- **Allele Number:** The total number of alleles analysed in the dataset for this position.
- **Homozygous:** The number of individuals with two copies of the variant.
- **Heterozygous:** The number of individuals with one copy of the variant.
- **Hemizygous:** The number of individuals with one copy of the variant on a sex chromosome, such as the X or Y chromosome.
- **Frequency:** How common the variant is in that population, shown as a decimal rounded to four places.
- **Actions:** Add an internal dataset to your basket. For an external dataset, select **Access external dataset** when a link is available.

:::tip Tip
Results are grouped by Beacon and dataset. Select the expand control (>) beside a dataset to view its population-level rows. When you select a sex or country-of-birth filter and results come from multiple Beacon sources, the page also displays a summary for the current filter.
:::

The system displays **Not available** when the discovery source does not provide a value. An external dataset may display **External link not available** when no access link is available.
