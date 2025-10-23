import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "GDI Portal Documentation",
  tagline: "Documentation for the GDI User Portal",
  favicon: "img/favicon.svg",

  // Set the production url of your site here
  url: "https://GenomicDataInfrastructure.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub Pages deployment, this should be the repository name
  baseUrl: "/gdi-userportal-frontend/",

  // GitHub pages deployment config.
  organizationName: "GenomicDataInfrastructure", // Your GitHub username
  projectName: "gdi-userportal-frontend", // Your repository name

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  themes: ["@docusaurus/theme-mermaid"],
  plugins: [],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // // Please change this to your repo.
          // // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    navbar: {
      title: " GDI Portal Documentation",
      logo: {
        alt: "Logo",
        src: "img/logo.svg",
      },
      hideOnScroll: false,
      items: [
        {
          type: "docSidebar",
          sidebarId: "userGuideSidebar",
          position: "right",
          label: "Data users",
        },
        {
          type: "docSidebar",
          sidebarId: "catalogManagersGuideSidebar",
          position: "right",
          label: "Catalog managers",
        },
        {
          type: "docSidebar",
          sidebarId: "developerGuideSidebar",
          position: "right",
          label: "Developers",
        },
        {
          type: "docSidebar",
          sidebarId: "systemAdminGuideSidebar",
          position: "right",
          label: "System admins",
        },
      ],
    },
    // Add search configuration
    algolia: undefined, // Disable algolia if it's configured
    footer: {
      style: "dark",
      links: [
        {
          items: [
            {
              html: `
                <div style="text-align: center; margin: 0.5rem 0;">
                  <a href="https://service.desk.lnds.lu/" target="_blank" rel="noopener noreferrer" style="color: var(--ifm-footer-link-color); text-decoration: none;">Contact support ↗</a>
                  <span style="margin: 0 1rem; color: var(--ifm-footer-link-color);">|</span>
                  <a href="https://www.lnds.lu/" target="_blank" rel="noopener noreferrer" style="color: var(--ifm-footer-link-color); text-decoration: none;">About LNDS ↗</a>
                </div>
              `,
            },
          ],
        },
      ],
      copyright: `${new Date().getFullYear()} Luxembourg National Data Service (LNDS). It is a brand of PNED G.I.E., an economic interest group established by the Luxembourg government and public institutes 2023 <br/> All rights reserved`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
