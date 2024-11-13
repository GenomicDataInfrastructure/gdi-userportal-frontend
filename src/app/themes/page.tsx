// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Suspense } from "react";
import PageContainer from "@/components/PageContainer";
import ValueList from "@/components/ValueList";
import { filterValuesList } from "@/services/discovery";
import Error from "@/app/error";
import LoadingContainer from "@/components/LoadingContainer";
import { ValueLabel } from "@/services/discovery/types/datasetSearch.types";
import { FilterValueType } from "@/services/discovery/types/dataset.types";

async function getThemes(): Promise<ValueLabel[]> {
  try {
    const response = await filterValuesList(FilterValueType.THEME);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default async function ThemesPage() {
  let themes: ValueLabel[];

  try {
    themes = await getThemes();
  } catch (error) {
    return <Error statusCode={500} />;
  }

  return (
    <PageContainer className="container mx-auto px-4 pt-5">
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
