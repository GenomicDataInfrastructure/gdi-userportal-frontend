// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { env } from "next-runtime-env";

interface ServerConfig {
  discoveryUrl: string;
  daamUrl: string;
  hdeuDaamUrl: string;
  discoveryHdEuUrl: string;
}

const serverConfig: ServerConfig = {
  daamUrl: env("NEXT_PUBLIC_DAAM_URL") || "http://localhost:8080",
  discoveryUrl: env("NEXT_PUBLIC_DDS_URL") || "http://localhost:8080",
  hdeuDaamUrl: env("NEXT_PUBLIC_HDEU_DAAM_URL") || "http://localhost:8080",
  discoveryHdEuUrl:
    env("NEXT_PUBLIC_FILTER_HDEU_URL") || "http://localhost:8082",
};

export default serverConfig;
