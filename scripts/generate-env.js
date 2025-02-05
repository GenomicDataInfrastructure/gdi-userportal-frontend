// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs");
const path = require("path");

const propertiesPath = path.join(process.cwd(), "public", "properties.json");
const properties = JSON.parse(fs.readFileSync(propertiesPath, "utf8"));

const envContent = Object.entries(properties)
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");

const envPath = path.join(process.cwd(), ".env");
fs.writeFileSync(envPath, envContent);

console.log(
  "Environment variables generated successfully from properties.json"
);
