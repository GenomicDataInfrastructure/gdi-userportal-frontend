// const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const domains = ["demo.dev.datopian.com", "admin.opendatani.gov.uk"];
const analytics_src = process.env.ANALYTICS_SRC;
const analytics_id = process.env.ANALYTICS_ID;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains,
  },
  serverRuntimeConfig: {
    ISR_TOKEN: process.env.ISR_TOKEN ? process.env.ISR_TOKEN : "secret",
    GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY
      ? process.env.GOOGLE_MAPS_KEY
      : "secret",
  },
  publicRuntimeConfig: {
    GHOST_CMS_URL: process.env.GHOST_CMS_URL
      ? process.env.GHOST_CMS_URL
      : "https://luccasmmg.ghost.io",
    GHOST_CMS_KEY: process.env.GHOST_CMS_KEY ? process.env.GHOST_CMS_KEY : "",
    DATA_API_URL: process.env.DATA_API_URL
      ? process.env.DATA_API_URL
      : "https://gql.datopian.com/v1/",
    DOMAINS: domains,
    ORG: false,
    DMS: process.env.DMS
      ? process.env.DMS.replace(/\/?$/, "")
      : "https://demo.dev.datopian.com/",
    CMS: process.env.CMS
      ? process.env.CMS.replace(/\/?$/, "")
      : "https://demo.dev.datopian.com/",
    ANALYTICS_SRC: analytics_src,
    ANALYTICS_ID: analytics_id,
    ANALYTICS_GA_ID: process.env.ANALYTICS_GA_ID,
    SITE_TITLE: process.env.SITE_TITLE
      ? process.env.SITE_TITLE
      : "DataHub Open Data",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
