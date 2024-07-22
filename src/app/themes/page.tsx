// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

"use client";

import PageContainer from "@/components/PageContainer";
import ThemesSection, { allThemes } from "@/components/ThemesSection";

const ThemesPage = () => {
  return (
    <PageContainer className="container mx-auto px-8 pt-5">
      <div className="my-8">
        <h1 className="text-left font-bold text-4xl text-primary">
          {" "}
          {allThemes.length} Themes
        </h1>
      </div>
      <ThemesSection showSeeAll={false} />
    </PageContainer>
  );
};

export default ThemesPage;
