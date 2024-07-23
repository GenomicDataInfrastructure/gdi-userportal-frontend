// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { env } from "next-runtime-env";

interface ServerConfig {
  discoveryUrl: string;
  daamUrl: string;
  linkedInUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  gitlabUrl?: string;
  websiteUrl?: string;
  email?: string;
  footerText: string;
  homepageTitle: string;
  homepageSubtitle: string;
  aboutContent: string;
  bannerLink: string;
  siteTitle: string;
  siteDescription: string;
}

const serverConfig: ServerConfig = {
  daamUrl: env("NEXT_PUBLIC_DAAM_URL") || "http://localhost:8080",
  discoveryUrl: env("NEXT_PUBLIC_DDS_URL") || "http://localhost:8080",
  linkedInUrl: env("NEXT_PUBLIC_LINKEDIN_URL"),
  twitterUrl: env("NEXT_PUBLIC_TWITTER_URL"),
  githubUrl: env("NEXT_PUBLIC_GITHUB_URL"),
  gitlabUrl: env("NEXT_PUBLIC_GITLAB_URL"),
  websiteUrl: env("NEXT_PUBLIC_WEBSITE_URL"),
  email: env("NEXT_PUBLIC_EMAIL"),
  footerText:
    env("NEXT_PUBLIC_FOOTER_TEXT") ||
    "GDI project receives funding from the European Union's Digital Europe \n Programme under grant agreement number 101081813.",
  homepageTitle: env("NEXT_PUBLIC_HOMEPAGE_TITLE") || "WELCOME TO GDI",
  homepageSubtitle:
    env("NEXT_PUBLIC_HOMEPAGE_SUBTITLE") ||
    "The Genomic Data Infrastructure (GDI) project is enabling access to genomic and related phenotypic and clinical data across Europe.",
  aboutContent:
    env("NEXT_PUBLIC_HOMEPAGE_ABOUT_CONTENT") ||
    "The Genomic Data Infrastructure (GDI) homepage is your gateway to an extensive network of genomic data designed to revolutionize research, policymaking, and healthcare in Europe. The GDI project aims to provide seamless access to over one million genome sequences, facilitating groundbreaking advancements in personalized medicine for various diseases, including cancer and rare conditions. By integrating genomic, phenotypic, and clinical data, GDI supports precise diagnostics, treatments, and clinical decision-making. Explore our user-friendly platform to connect with crucial datasets, and join our mission to enhance healthcare outcomes and foster innovation across Europe. Visit the GDI website for more information.",
  bannerLink: env("NEXT_PUBLIC_BANNER_LINK") || "/howto",
  siteTitle: env("NEXT_PUBLIC_SITE_TITLE") || "GDI - User Portal",
  siteDescription:
    env("NEXT_PUBLIC_SITE_DESCRIPTION") ||
    "Genomic Data Infrastructure User Portal",
};

export default serverConfig;
