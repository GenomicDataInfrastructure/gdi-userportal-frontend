// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { createContext, useContext } from "react";

const AiModelSupportContext = createContext(false);
export const useAiModelSupport = () => useContext(AiModelSupportContext);
export const AiModelSupportProvider = AiModelSupportContext.Provider;
