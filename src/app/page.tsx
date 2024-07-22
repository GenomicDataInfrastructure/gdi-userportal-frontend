// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import ThemesSection from "@/components/ThemesSection";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { datasetList } from "@/services/discovery/index.public";
import { SearchedDataset } from "@/services/discovery/types/dataset.types";
import RecentDatasets from "@/components/RecentDatasets";
import aboutBackground from "../public/homepage-about-background.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "@/providers/AlertProvider";
import { AxiosError } from "axios";
import serverConfig from "@/config/serverConfig";

const HomePage = () => {
  const queryParams = useSearchParams();
  const [datasets, setDatasets] = useState<SearchedDataset[]>([]);
  const { setAlert } = useAlert();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await datasetList({
          limit: 4,
          sort: "createdAt desc",
        });
        setDatasets(response.data.datasets);
      } catch (error) {
        if (error instanceof AxiosError) {
          setAlert({
            type: "error",
            message:
              error.response?.data?.title ||
              `Failed to fetch datasets, status code: ${error.response?.status}`,
            details: error.response?.data?.detail,
          });
        }
      }
    }
    fetchData();
  }, [setAlert]);

  return (
    <PageContainer className="container mx-auto px-4 pt-5 text-center">
      <div className="my-8">
        <h1 className="font-bold text-4xl text-primary">
          {serverConfig.homepageTitle}
        </h1>
        <h2 className="text-xl mt-4 font-light">
          {serverConfig.homepageSubtitle}
        </h2>
      </div>
      <div className="flex justify-center mb-24">
        <div className="w-full lg:w-4/5 xl:w-3/4">
          <SearchBar queryParams={queryParams} size="large" />
        </div>
      </div>

      <ThemesSection maxThemes={12} />

      <div className="mb-20 relative text-left flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${aboutBackground.src})`,
          }}
        ></div>
        <div className="relative z-10 w-full md:w-3/4 lg:w-2/3 xl:w-3/5 bg-white bg-opacity-75 rounded-lg min-h-[300px]">
          <h3 className="mb-4 text-2xl font-bold text-primary">
            About the data portal
          </h3>
          <p className="text-lg">
            {serverConfig.aboutContent.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < serverConfig.aboutContent.split("\n").length - 1 && (
                  <br />
                )}
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

      <div className="relative text-left flex items-center">
        <div className="relative z-10 w-full my-8">
          <h3 className="mb-4 text-2xl font-bold text-primary">
            Most Recent Datasets
          </h3>
          <RecentDatasets datasets={datasets} />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
