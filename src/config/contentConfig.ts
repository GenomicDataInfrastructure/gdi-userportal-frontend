// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import config from "../../customizations/customizations.json";

interface ContentConfig {
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
  showBasketAndLogin: boolean;
}

const contentConfig: ContentConfig = {
  linkedInUrl: config.NEXT_PUBLIC_LINKEDIN_URL,
  twitterUrl: config.NEXT_PUBLIC_TWITTER_URL,
  githubUrl: config.NEXT_PUBLIC_GITHUB_URL,
  websiteUrl: config.NEXT_PUBLIC_WEBSITE_URL,
  email: config.NEXT_PUBLIC_EMAIL,
  footerText:
    config.NEXT_PUBLIC_FOOTER_TEXT ||
    "GDI project receives funding from the European Union's Digital Europe \n Programme under grant agreement number 101081813.",
  homepageTitle: config.NEXT_PUBLIC_HOMEPAGE_TITLE || "WELCOME TO GDI",
  homepageSubtitle:
    config.NEXT_PUBLIC_HOMEPAGE_SUBTITLE ||
    "The Genomic Data Infrastructure (GDI) project is enabling access to genomic and related phenotypic and clinical data across Europe.",
  aboutContent:
    config.NEXT_PUBLIC_HOMEPAGE_ABOUT_CONTENT ||
    "The Genomic Data Infrastructure (GDI) homepage is your gateway to an extensive network of genomic data designed to revolutionize research, policymaking, and healthcare in Europe. The GDI project aims to provide seamless access to over one million genome sequences, facilitating groundbreaking advancements in personalized medicine for various diseases, including cancer and rare conditions. By integrating genomic, phenotypic, and clinical data, GDI supports precise diagnostics, treatments, and clinical decision-making. Explore our user-friendly platform to connect with crucial datasets, and join our mission to enhance healthcare outcomes and foster innovation across Europe. Visit the GDI website for more information.",
  bannerLink: config.NEXT_PUBLIC_BANNER_LINK || "/howto",
  siteTitle: config.NEXT_PUBLIC_SITE_TITLE || "GDI - User Portal",
  siteDescription:
    config.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Genomic Data Infrastructure User Portal",
  showBasketAndLogin: config.NEXT_PUBLIC_SHOW_BASKET_AND_LOGIN !== "false",
};

export default contentConfig;
