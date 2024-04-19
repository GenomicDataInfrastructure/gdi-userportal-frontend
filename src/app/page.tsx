// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dna from "../public/dna.jpg";
import logo from "../public/gdi-logo.png";
import gdi_visuals from "../public/gdi-visuals.png";
import office from "../public/office.jpg";
import { DatasetCounter } from "./DatasetCounter";
import { PortalStatistics } from "./PortalStatistics";

const HomePage = () => {
  const queryParams = useSearchParams();

  return (
    <PageContainer className="container mx-auto px-4 pt-5">
      <div className="grid gap-14 md:grid-cols-[2fr,1fr]">
        <div className="text-center md:pl-4 md:pr-4 lg:text-left">
          <DatasetCounter />
          <SearchBar queryParams={queryParams} size="large" />
          <div className="mx-auto mt-12 w-full rounded-lg bg-white transition-shadow duration-300 ease-in-out hover:shadow-sm lg:mx-0 lg:w-1/2">
            <h2 className="mb-4 text-4xl font-bold text-primary">
              WELCOME TO GDI
            </h2>
            <p className="mb-6 text-lg">
              The Genomic Data Infrastructure (GDI) project is enabling access
              to genomic and related phenotypic and clinical data across Europe.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link href="/datasets">
                <button className="inline-block rounded bg-primary px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-secondary">
                  Discover GDI datasets
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-[600px]">
            <Image
              src={gdi_visuals}
              alt="GDI Visualization"
              width={600}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex h-40 w-full justify-center">
        <PortalStatistics />
      </div>

      <div className="mb-36 grid items-center gap-10 md:grid-cols-2">
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

      <div className="mb-36 grid items-center gap-10 md:grid-cols-2">
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

      <div className="mb-36 rounded-xl border bg-primary p-8 text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between md:flex-nowrap">
          <h2 className="mb-6 text-2xl font-bold text-warning md:mb-0 md:text-3xl lg:text-4xl">
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
