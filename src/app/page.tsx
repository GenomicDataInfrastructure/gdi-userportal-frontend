// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const HomePage = () => {
  const queryParams = useSearchParams();
  const applicationTitle = "WELCOME TO GDI";
  const applicationSubtitle =
    "The Genomic Data Infrastructure (GDI) project is enabling access to genomic and related phenotypic and clinical data across Europe.";

  return (
    <PageContainer className="container mx-auto px-4 pt-5 text-center">
      <div className="my-8">
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
    </PageContainer>
  );
};

export default HomePage;
