// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto  px-4 sm:px-2 lg:px-0">
      <div className="mb-8 text-center"></div>
      <h1 className="mb-4 text-2xl font-bold text-claret sm:text-3xl lg:text-4xl">
        About Genomic Data Infrastructure (GDI)
      </h1>
      <p className="text-gray-700">
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

      <h2 className="my-4 text-2xl font-bold text-claret">User Portal</h2>
      <p className="text-gray-700">
        The User Portal, developed by the Genomic Data Infrastructure (GDI)
        project, is the central entry point for accessing genomic data. As part
        of the Genomic Data Infrastructure (GDI) project, it unlocks a vast
        repository of over one million genome sequences, this platform is
        currently under development and will serve as the main European-level
        hub for data access, providing a user-friendly interface for researchers
        and healthcare professionals.{" "}
      </p>

      <h2 className="my-4 text-2xl font-bold text-claret">Key Objectives</h2>
      <ul className="list-inside list-disc text-gray-700">
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

      <p className="mt-20 text-gray-700">
        For more detailed information, please visit the{" "}
        <a href="https://gdi.onemilliongenomes.eu/" className="text-blue-500">
          GDI Website
        </a>
        .
      </p>
      <p className="mt-4 text-gray-700">
        Please report any problems you find in{" "}
        <a
          href="https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/issues"
          className="text-blue-500"
        >
          GitHub Issues
        </a>
        .
      </p>
    </div>
  );
};

export default AboutPage;
