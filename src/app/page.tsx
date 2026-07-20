// SPDX-FileCopyrightText: 2025 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Link } from "@/i18n/navigation";
import PageContainer from "@/components/PageContainer";
import SearchBar from "@/components/Searchbar";
import { use, useEffect, useState } from "react";
import RecentDatasets from "@/components/RecentDatasets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "@/providers/AlertProvider";
import { AxiosError } from "axios";
import ValueList from "@/components/ValueList";
import { useTranslations } from "next-intl";
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
import contentConfig from "@/config/contentConfig";

type HomePageProps = {
  searchParams: Promise<UrlSearchParams>;
};

const HomePage = ({ searchParams }: HomePageProps) => {
  const t = useTranslations();
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
          sort: "newest",
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
        <h1 className="font-bold text-4xl font-title">{t("home.title")}</h1>
        <h2 className="text-xl mt-4 font-body">
          {contentConfig.homepageSubtitle || t("home.subtitle")}
        </h2>
      </div>
      {process.env.NEXT_PUBLIC_HOME_NOTICE_ENABLED?.toLowerCase() ===
        "true" && (
        <div
          className="mx-auto mb-10 w-full max-w-4xl rounded-lg border-l-4 border-l-warning bg-warning/10 p-4 text-left shadow-lg"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="mt-1 h-5 w-5 shrink-0 text-warning"
            />
            <div>
              <h3 className="mb-1 text-lg font-semibold">
                {t("home.noticeTitle")}
              </h3>
              <p className="text-sm leading-6 md:text-base">
                {t("home.noticeMessage")}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center mb-24">
        <div className="w-full lg:w-4/5 xl:w-3/4">
          <SearchBar searchParams={_searchParams} size="large" />
        </div>
      </div>
      {themes.length > 0 && (
        <ValueList
          items={themes}
          filterKey={FilterValueType.THEME}
          title={t("home.themesSectionTitle")}
        />
      )}
      <div className="mb-20 relative text-left flex items-center py-8">
        <div
          className="w-screen absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/hero-bg.svg")`,
            left: "50%",
            right: "auto",
            transform: "translateX(-50%)",
          }}
        ></div>
        <div className="relative z-10 w-full md:w-3/4 lg:w-2/3 xl:w-3/5">
          <h3 className="mb-4 text-2xl">{t("home.aboutPortal")}</h3>
          <p className="text-lg">
            {(contentConfig.aboutContent || t("home.aboutContent"))
              .split("\n")
              .map((line, index, lines) => (
                <span key={index}>
                  {line}
                  {index < lines.length - 1 && <br />}
                </span>
              ))}
          </p>
          <br />
          <Link
            className="link-arrow text-primary hover:text-hover-color"
            href="/about"
          >
            {t("home.readMore")}
          </Link>
        </div>
      </div>

      <div className="text-left flex items-center">
        <div className="relative z-10 w-full my-8">
          <h3 className="mb-4 text-2xl">{t("home.recentDatasets")}</h3>
          <RecentDatasets datasets={datasets} />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
