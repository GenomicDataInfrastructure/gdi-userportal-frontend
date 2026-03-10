// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/dotenv-config.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["/node_modules/(?!(iso-639-3)/)"],
  testPathIgnorePatterns: [
    "/.next/",
    "/node_modules/",
    "/tests/", // Ignore Playwright tests
    "/playwright-report/", // Just in case
  ],
};
