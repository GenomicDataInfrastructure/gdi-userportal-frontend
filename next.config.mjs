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
};

export default nextConfig;
