// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import { useSearchParams } from "next/navigation";

const HomePage = () => {
  const queryParams = useSearchParams();
  const homepageTitle =
    process.env.NEXT_PUBLIC_HOMEPAGE_TITLE || "WELCOME TO GDI";
  const homepageSubtitle =
    process.env.NEXT_PUBLIC_HOMEPAGE_SUBTITLE ||
    "The Genomic Data Infrastructure (GDI) project is enabling access to genomic and related phenotypic and clinical data across Europe.";

  return (
    <PageContainer className="container mx-auto px-4 pt-5 text-center">
      <div className="my-8">
        <h1 className="font-bold text-4xl text-primary">{homepageTitle}</h1>
        <h2 className="text-xl mt-4 font-light">{homepageSubtitle}</h2>
      </div>
      <div className="flex justify-center mb-8">
        <div className="w-3/5">
          <SearchBar queryParams={queryParams} size="large" />
        </div>
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
