// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "keycloak-test.healthdata.nl",
        port: "",
        pathname: "/realms/ckan/protocol/openid-connect/userinfo",
      },
    ],
  },

  async headers() {
    let cspHeaderValue = process.env.CSP_HEADER || "";
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeaderValue.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
};

export default nextConfig;
