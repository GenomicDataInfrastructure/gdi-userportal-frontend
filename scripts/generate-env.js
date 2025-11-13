// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
const fs = require("fs");
const path = require("path");

function loadProperties() {
  const propertiesPath = path.join(process.cwd(), "public", "properties.json");
  try {
    const properties = JSON.parse(fs.readFileSync(propertiesPath, "utf8"));

    Object.entries(properties).forEach(([key, value]) => {
      process.env[key] = value;
    });

    console.log(
      "Environment variables loaded successfully from properties.json"
    );
  } catch (error) {
    console.error("Error loading properties:", error);
    process.exit(1);
  }
}

module.exports = loadProperties;

if (require.main === module) {
  loadProperties();
}
