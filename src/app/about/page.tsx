// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import PageHeading from "@/components/PageHeading";
import PageSubHeading from "@/components/PageSubHeading";
import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto  px-4 sm:px-2 lg:px-0">
      <div className="mb-8 text-center"></div>
      <PageHeading className="mb-4">
        About Genomic Data Infrastructure (GDI)
      </PageHeading>
      <p>
        The Genomic Data Infrastructure (GDI) project aims to enable access to
        genomic and related phenotypic and clinical data to improve research,
        policymaking and healthcare across Europe. The GDI project aims to
        unlock a data network of over one million genome sequences for research
        and clinical reference. This will create unprecedented opportunities for
        transnational and multi-stakeholder actions in personalised medicine for
        cancer, common, rare and infectious diseases as well as access to a
        reference genome collection representing the European population (Genome
        of Europe).
      </p>

      <PageSubHeading className="my-4">User Portal</PageSubHeading>
      <p>
        The User Portal, developed by the Genomic Data Infrastructure (GDI)
        project, is the central entry point for accessing genomic data. As part
        of the Genomic Data Infrastructure (GDI) project, it unlocks a vast
        repository of over one million genome sequences, this platform is
        currently under development and will serve as the main European-level
        hub for data access, providing a user-friendly interface for researchers
        and healthcare professionals.{" "}
      </p>

      <PageSubHeading className="my-4">Key Objectives</PageSubHeading>
      <ul className="list-inside list-disc">
        <li>
          To link and to provide cross-border access to genomic and related
          phenotypic datasets across Europe
        </li>
        <li>
          To advance understanding of genomics for more precise and faster
          clinical decision making, diagnostics, treatments systems, and to
          benefit the overall economy
        </li>
        <li>
          To align with the development under the European Health Data Space
          (EHDS)
        </li>
        <li>
          To Facilitate research, policy-making, and healthcare improvements
        </li>
        <li>
          To maintain awareness, acceptance and trust in the main groups of
          stakeholders, notably European citizens, data holders, healthcare
          professionals, researchers and public health authorities
        </li>
      </ul>

      <p className="mt-20">
        For more detailed information, please visit the{" "}
        <a
          href="https://gdi.onemilliongenomes.eu/"
          className="text-blue-500 hover:underline"
        >
          GDI Website
        </a>
        .
      </p>
      <p className="mt-4">
        Please report any problems you find in{" "}
        <a
          href="https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/issues"
          className="text-blue-500 hover:underline"
        >
          GitHub Issues
        </a>
        .
      </p>
    </div>
  );
};

export default AboutPage;
