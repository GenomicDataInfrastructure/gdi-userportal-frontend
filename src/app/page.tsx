// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import { use, useEffect, useState } from "react";
import RecentDatasets from "@/components/RecentDatasets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "@/providers/AlertProvider";
import { AxiosError } from "axios";
import contentConfig from "@/config/contentConfig";
import ValueList from "@/components/ValueList";
import {
  retrieveFilterValuesApi,
  searchDatasetsApi,
} from "@/app/api/discovery";
import {
  SearchedDataset,
  ValueLabel,
} from "@/app/api/discovery/open-api/schemas";
import { FilterValueType } from "@/app/api/discovery/additional-types";
import { UrlSearchParams } from "@/app/params";

type HomePageProps = {
  searchParams: Promise<UrlSearchParams>;
};

const HomePage = ({ searchParams }: HomePageProps) => {
  const [datasets, setDatasets] = useState<SearchedDataset[]>([]);
  const [themes, setThemes] = useState<ValueLabel[]>([]);
  const { setAlert } = useAlert();
  const _searchParams = use(searchParams);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const filterValues = await retrieveFilterValuesApi(
          FilterValueType.THEME
        );
        setThemes(filterValues);
      } catch (error) {
        if (error instanceof AxiosError) {
          setAlert({
            type: "error",
            message: "Failed to fetch themes",
            details: error.response?.data?.detail,
          });
        }
      }
    }

    fetchThemes();
  }, [setAlert]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await searchDatasetsApi({
          rows: 4,
          sort: "issued desc",
        });
        setDatasets(data.results!);
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
    <PageContainer
      searchParams={_searchParams}
      className="container mx-auto px-4 pt-5 text-center"
    >
      <div className="my-8">
        <h1 className="font-bold text-4xl font-title">
          {contentConfig.homepageTitle}
        </h1>
        <h2 className="text-xl mt-4 font-body">
          {contentConfig.homepageSubtitle}
        </h2>
      </div>
      <div className="flex justify-center mb-24">
        <div className="w-full lg:w-4/5 xl:w-3/4">
          <SearchBar searchParams={_searchParams} size="large" />
        </div>
      </div>
      {themes.length > 0 && (
        <ValueList
          items={themes}
          filterKey={FilterValueType.THEME}
          title="Themes"
        />
      )}
      <div className="mb-20 relative text-left flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/homepage-about-background.png")`,
          }}
        ></div>
        <div className="relative z-10 w-full md:w-3/4 lg:w-2/3 xl:w-3/5 bg-white bg-opacity-75 rounded-lg min-h-[300px]">
          <h3 className="mb-4 text-2xl">About the data portal</h3>
          <p className="text-lg">
            {contentConfig.aboutContent.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < contentConfig.aboutContent.split("\n").length - 1 && (
                  <br />
                )}
              </span>
            ))}
          </p>
          <br />
          <a
            className="text-secondary flex items-center gap-1 transition hover:underline duration-1000"
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

      <div className="text-left flex items-center">
        <div className="relative z-10 w-full my-8">
          <h3 className="mb-4 text-2xl">Most Recent Datasets</h3>
          <RecentDatasets datasets={datasets} />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
