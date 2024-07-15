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
  const aboutContent =
    process.env.NEXT_PUBLIC_HOMEPAGE_ABOUT_CONTENT || "About the data portal";

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
        <div className="rounded-lg bg-white p-8 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg text-left">
          <p className="text-lg">Mock theme boxes will be displayed here.</p>
        </div>
      </div>

      <div className="mb-20">
        <div className="rounded-lg bg-white p-8 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg text-left">
          <h3 className="mb-4 text-2xl font-bold text-primary">
            About the data portal
          </h3>
          <p className="text-lg">
            {aboutContent.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < aboutContent.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
          <br />
          <a
            className="text-primary flex items-center gap-1 transition hover:underline duration-1000"
            href="/about"
          >
            Read more{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                clipRule="evenodd"
              ></path>
              <path
                fillRule="evenodd"
                d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
      </div>

      <div className="mb-20">
        <div className="rounded-lg bg-white p-8 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg text-left">
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
