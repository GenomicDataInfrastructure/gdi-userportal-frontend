// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/dotenv-config.js"],
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        tsconfig: {
          allowJs: true,
          rootDir: ".",
          ignoreDeprecations: "6.0",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^server-only$": "<rootDir>/src/__mocks__/server-only.ts",
    "^next-intl$": "<rootDir>/src/__mocks__/next-intl.ts",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(iso-639-3|@rdfjs|@comunica|@vocabulary|@zazuko|shacl-engine|rdf-validate-datatype|rdf-literal|rdf-validation|grapoi|clownface|is-graph-pointer|componentsjs|rdf-parse-n3|readable-stream)/)",
  ],
  testPathIgnorePatterns: [
    "/.next/",
    "/node_modules/",
    "/tests/", // Ignore Playwright tests
    "/playwright-report/", // Just in case
  ],
};
