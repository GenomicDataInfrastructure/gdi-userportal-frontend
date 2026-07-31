// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { env } from "next-runtime-env";

interface ServerConfig {
  discoveryUrl: string;
  daamUrl: string;
  entitlementsV2Enabled: boolean;
}

const serverConfig: ServerConfig = {
  daamUrl: env("NEXT_PUBLIC_DAAM_URL") || "http://localhost:8080",
  discoveryUrl: env("NEXT_PUBLIC_DDS_URL") || "http://localhost:8080",
  entitlementsV2Enabled: process.env.ENTITLEMENTS_V2_ENABLED === "true",
};

export default serverConfig;
