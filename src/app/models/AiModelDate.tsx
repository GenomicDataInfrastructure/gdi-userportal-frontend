// SPDX-FileCopyrightText: 2026 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";

export default function AiModelDate({ value }: { value: string }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return isMounted ? <time dateTime={value}>{formatDate(value)}</time> : null;
}
