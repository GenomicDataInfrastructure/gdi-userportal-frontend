/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */

"use client";

import React, { useEffect, useState } from "react";
import { marked } from "marked";
import renderer from "./renderer";
import PageContainer from "@/components/PageContainer";
import LoadingContainer from "@/components/LoadingContainer";
import Error from "@/app/error";

type Status = "loading" | "error" | "success";

interface AboutResponse {
  status: Status;
  content?: string;
  errorCode?: number;
}

const AboutPage: React.FC = () => {
  const [response, setResponse] = useState<AboutResponse>({
    status: "loading",
  });

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setResponse({ status: "loading" });
        const response = await fetch("/about.md");
        if (!response.ok) {
          throw new Error("Failed to fetch the markdown file.");
        }
        const text = await response.text();

        marked.use({ renderer });
        const htmlContent = marked.parse(text);

        setResponse({
          content: htmlContent,
          status: "success",
        });
      } catch (error) {
        console.error("Error in fetchMarkdown:", error);
        setResponse({ status: "error", errorCode: 500 });
      }
    };

    fetchMarkdown();
  }, []);

  if (response.status === "loading") {
    return (
      <LoadingContainer
        text="Loading content. This may take a few moments."
        className="mt-4 px-4 text-center sm:mt-8 sm:px-8"
      />
    );
  }

  if (response.status === "error") {
    return <Error statusCode={response.errorCode} />;
  }

  return (
    <PageContainer className="container mx-auto px-4 pt-5">
      <div className="my-8 flex items-center gap-2">
        <h1 className="text-left font-medium text-2xl sm:text-3xl">About</h1>
      </div>
      <div
        className="text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: response.content || "" }}
      />
    </PageContainer>
  );
};

export default AboutPage;
