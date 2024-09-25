// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import ThemesSection, { allThemes } from "@/components/ThemesSection";

const ThemesPage = () => {
  return (
    <PageContainer className="container mx-auto px-4 pt-5">
      <div className="my-8 flex items-center gap-2">
        <h1 className="text-left font-title text-2xl sm:text-3xl">Themes</h1>
        <span className="bg-info text-white text-sm px-2 py-1 rounded-full">
          {allThemes.length}
        </span>
      </div>
      <ThemesSection showSeeAll={false} />
    </PageContainer>
  );
};

export default ThemesPage;
