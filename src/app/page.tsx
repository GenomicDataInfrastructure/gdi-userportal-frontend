// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import { useSearchParams } from "next/navigation";
import bgBackground from "../public/bg-background.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

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

      <div className="mb-20 relative text-left flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgBackground.src})`,
          }}
        ></div>
        <div className="relative z-10 w-full md:w-3/4 lg:w-2/3 xl:w-3/5 bg-white bg-opacity-75 p-8 rounded-lg">
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
            Read more
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-4 h-4"
            />
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
