// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import office from "../public/office.jpg";
import dna from "../public/dna.jpg";
import logo from "../public/gdi-logo.png";

const HomePage = () => {
  const queryParams = useSearchParams();
  const applicationTitle = "WELCOME TO GDI";
  const applicationSubtitle = (
    <>
      The Genomic Data Infrastructure (GDI) project is enabling access to
      genomic and related phenotypic and clinical data across Europe.
    </>
  );

  return (
    <PageContainer className="container mx-auto px-4 pt-5 text-center">
      <div className="mb-8 mt-8">
        <h1 className="font-bold text-4xl text-primary">{applicationTitle}</h1>
        <h2 className="text-xl mt-4 font-light">{applicationSubtitle}</h2>
      </div>
      <div className="flex justify-center mb-8">
        <div className="w-4/5">
          <SearchBar queryParams={queryParams} size="large" />
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <Link href="/datasets">
          <button className="inline-block rounded-lg bg-primary px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-secondary">
            Discover GDI datasets
          </button>
        </Link>
      </div>

      <div className="mb-20">
        <div className="rounded-lg bg-white p-8 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-primary">Themes</h3>
          <p className="text-lg">Mock theme boxes will be displayed here.</p>
        </div>
      </div>

      <div className="mb-20">
        <div className="rounded-lg bg-white p-8 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-primary">About</h3>
          <p className="text-lg">Mock about text will be displayed here.</p>
        </div>
      </div>

      <div className="mb-20">
        <div className="rounded-lg bg-white p-8 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-primary">
            Most Recent Datasets
          </h3>
          <p className="text-lg">
            Mock most recent datasets will be displayed here.
          </p>
        </div>
      </div>

      <div className="mb-20 grid items-center gap-10 md:grid-cols-2">
        <div className="relative order-2 flex h-full items-center justify-center md:order-1">
          <Image
            src={office}
            alt="Office"
            className="rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg"
          />
        </div>
        <div className="order-1 rounded-lg bg-white p-8 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg md:order-2">
          <h2 className="mb-4 text-3xl font-bold text-primary">
            What are the benefits?
          </h2>
          <p className="text-lg">
            Insights from the data will support improved clinical diagnostics,
            treatments, and predictive medicine for European citizens. The
            project will also lead to better public health measures to benefit
            citizens, healthcare systems, and the economy.
          </p>
        </div>
      </div>

      <div className="mb-20 grid items-center gap-10 md:grid-cols-2">
        <div className="rounded-lg bg-white p-8 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-primary">The Data</h3>
          <p className="text-lg">
            The project involves human genomic and related phenotypic and
            clinical data held in databases across Europe. Real synthetic data
            will be used for validation before data are available through the
            infrastructure.
          </p>
        </div>
        <div className="relative flex h-full items-center justify-center">
          <Image
            src={dna}
            alt="Data representation"
            className="rounded-lg transition-shadow duration-300 ease-in-out hover:shadow-lg"
          />
        </div>
      </div>

      <div className="mb-6 rounded-xl border bg-primary p-6 text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between md:flex-nowrap">
          <h2 className="text-2xl font-bold text-warning md:mb-0 md:text-3xl lg:text-4xl">
            PARTICIPATE
          </h2>
          <div className="flex flex-wrap gap-4 text-warning">
            <a
              href="https://b1mg-project.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-2 rounded border border-warning px-4 py-2 transition duration-300 ease-in-out md:mr-4 md:px-6 md:py-3 lg:mr-5"
            >
              Learn more about B1MG
            </a>
            <a
              href="https://gdi.onemilliongenomes.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-warning px-4 py-2 transition duration-300 ease-in-out md:px-6 md:py-3"
            >
              Learn more about GDI
            </a>
          </div>
        </div>
      </div>

      <div className="my-12 flex flex-col items-center justify-between md:flex-row">
        <div className="p-4 md:flex-1">
          <h3 className="mb-4 text-3xl font-bold leading-tight text-primary md:text-4xl">
            Realising a vision for European healthcare
          </h3>
          <p className="text-lg text-gray-700">
            The GDI project brings together experts in life science, medicine,
            computer science, ethics, and law.
          </p>
        </div>
        <div className="flex justify-center p-4 md:flex-1 md:justify-end">
          <div className="flex h-64 w-64 transform items-center justify-center overflow-hidden bg-white transition-transform duration-500 ease-in-out hover:scale-110">
            <Image src={logo} alt="GDI Logo" />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
