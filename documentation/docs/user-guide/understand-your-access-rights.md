---
slug: /understand-your-access-rights
sidebar_label: "Understand your access rights"
sidebar_position: 3
---

# Understand your access rights

Before you log in to the Data Portal, understand your access rights and the requirements for accessing genomic datasets.

## How dataset access works

The GDI Portal uses the **GA4GH Passport and Visa** system to securely manage access to genomic datasets. In order to use this passport system, you must log in through **LS-AAI**.

Think of your GA4GH credentials like international travel documents:

- **Passport**: A GA4GH credential carrying your identity assertions and relevant Visa authorisations, issued by or made available for retrieval through LS-AAI after it authenticates you
- **Visas**: Digital certificates proving you have permission to access specific datasets, issued by data access committees. Your Passport may contain one or more Visas granting you access to datasets across the European genomic data network.

Your Passport can contain multiple Visas of different types. The GDI Portal uses active Visas that confirm your approved access to a specific dataset. Other Visa types may confirm your affiliation, researcher status, accepted terms, or linked identities. These support access decisions but do not appear as dataset entitlements.

:::tip What is GA4GH?

GA4GH, the Global Alliance for Genomics and Health, develops standards for responsible genomic data sharing. Its Passport and Visa system lets the portal receive and verify your approved access information. For technical information about the standards behind GA4GH Passports, see [GA4GH Data Security](https://ga4gh.github.io/data-security/)<sup>↗</sup>.

:::

## Why log in with LS-AAI?

You must log in through LS-AAI so that the GDI Portal can retrieve your GA4GH Passport and associated visas, which are necessary for accessing datasets.

LS-AAI, the Login Service for Academic and Administrative Institutions, lets you log in to the GDI Portal with an existing institutional account such as Google, LinkedIn, university, or other organisational accounts. This means you do not need to create a new account specifically for the GDI Portal.

When you log in with LS-AAI:

- **LS-AAI retrieves your passport and visas**, which determine what datasets you can access in the portal.
- **If LS-AAI cannot retrieve a Passport**, you will not be able to retrieve your approved datasets (entitlements) even if your application has been approved.
