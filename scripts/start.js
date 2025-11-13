// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
const loadProperties = require("./generate-env");
const { spawn } = require("child_process");

loadProperties();

const server = spawn("node", ["server.js"], {
  stdio: "inherit",
  env: process.env,
});

server.on("error", (err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    server.kill(signal);
  });
});

server.on("exit", (code) => {
  process.exit(code);
});
