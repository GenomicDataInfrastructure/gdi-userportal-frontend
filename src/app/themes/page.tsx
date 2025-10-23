// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Suspense } from "react";
import PageContainer from "@/components/PageContainer";
import ValueList from "@/components/ValueList";
import Error from "@/app/error";
import LoadingContainer from "@/components/LoadingContainer";
import { retrieveFilterValuesApi } from "../api/discovery";
import { ValueLabel } from "@/app/api/discovery/open-api/schemas";
import { FilterValueType } from "@/app/api/discovery/additional-types";
import { UrlSearchParams } from "@/app/params";

async function getThemes(): Promise<ValueLabel[]> {
  try {
    return await retrieveFilterValuesApi(FilterValueType.THEME);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type ThemesPageProps = {
  searchParams: Promise<UrlSearchParams>;
};

export default async function ThemesPage({ searchParams }: ThemesPageProps) {
  const _searchParams = await searchParams;

  let themes: ValueLabel[];

  try {
    themes = await getThemes();
  } catch (error) {
    console.error(error);
    return <Error statusCode={500} />;
  }

  return (
    <PageContainer
      searchParams={_searchParams}
      className="container mx-auto px-4 pt-5"
    >
      <div className="my-8 flex items-center gap-2 px-4 sm:px-6 lg:px-8">
        <h1 className="text-left font-title text-2xl sm:text-3xl">Themes</h1>
        <span className="bg-info text-white text-sm px-2 py-1 rounded-full">
          {themes.length}
        </span>
      </div>
      <Suspense
        fallback={
          <LoadingContainer
            text="Retrieving themes. This may take a few moments."
            className="mt-4 px-4 text-center sm:mt-8 sm:px-8"
          />
        }
      >
        {themes.length > 0 ? (
          <ValueList
            items={themes}
            filterKey={FilterValueType.THEME}
            title="Themes"
          />
        ) : (
          <p className="text-center text-sm text-info">No themes found.</p>
        )}
      </Suspense>
    </PageContainer>
  );
}
