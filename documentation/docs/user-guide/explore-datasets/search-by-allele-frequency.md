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

:::tip Sign in for enhanced search

[**Sign in**](/sign-in) to get comprehensive search results. While you can use this tool without an account, signing in allows you to search and view more details, such as `record counts` and other metadata, to help you find what you need.

:::

## Search by allele frequency

1. Select **Allele Frequency** from the main menu.

<figure>
<img src="img/explore-datasets/allele-frequency.png" alt="Screenshot showing Allele Frequency option in main navigation menu" width="900" />
<figcaption></figcaption>
</figure>

2. Enter your search criteria:
   - **Variant:** The full form of the genomic variant, usually represented in the format `chr-position-ref-alt`. Example: `3-45864731-T-C` 
   - **Ref Genome:** Select the reference genome assembly to use for the search.
   - **Cohort:** Select the cohort of interest. Cohorts are groups of individuals sharing common characteristics, for example, those with a specific condition such as COVID.

4. Select **Search** or press **Enter**.


## Understanding your results

The search results display datasets containing your specified variant in a table format. Here's an example of the search results and the information it provides:

<figure>
<img src="img/explore-datasets/allele-frequency-result.png" alt="Screenshot showing Allele Frequency search results" width="900" />
<figcaption></figcaption>
</figure>

- **Dataset**: Name and source of the dataset. These are Beacon identifiers—the portal uses Beacon technology to retrieve information about whether genomic databases contain specific variants. 
- **Population**: Geographic or demographic group, such as countries.
- **Allele Count**: Number of times the variant appears in the dataset.
- **Allele Number**: Total number of alleles analysed in the dataset for this position.
- **Homozygous**: Number of individuals with two copies of the variant.
- **Heterozygous**: Number of individuals with one copy of the variant.
- **Frequency**: How common the variant is in that population (as a decimal).

