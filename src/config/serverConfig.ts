// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { env } from "next-runtime-env";

interface ServerConfig {
  discoveryUrl: string;
  daamUrl: string;
}

const serverConfig: ServerConfig = {
  daamUrl: env("NEXT_PUBLIC_DAAM_URL") || "http://localhost:8080",
  discoveryUrl: env("NEXT_PUBLIC_DDS_URL") || "http://localhost:8080",
};

export default serverConfig;
