// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { usePathname } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { useState } from "react";

interface CrmEmbedScriptProps {
  portalId: string;
}

function isProtectedPathname(pathname: string | null): boolean {
  return /(?:^|\/)(?:requests|applications)(?:\/|$)/.test(pathname ?? "");
}

export default function CrmEmbedScript({
  portalId,
}: CrmEmbedScriptProps): React.ReactNode {
  const pathname = usePathname();
  const { status } = useSession();
  const [loadFailed, setLoadFailed] = useState(false);

  if (
    status !== "unauthenticated" ||
    isProtectedPathname(pathname) ||
    loadFailed
  ) {
    return loadFailed ? (
      <p role="alert" className="text-sm text-red-700">
        The CRM widget is temporarily unavailable.
      </p>
    ) : null;
  }

  return (
    <Script
      src="https://gdi-crm.dyn.cloud.e-infra.cz/embed.js"
      data-portal={portalId}
      strategy="afterInteractive"
      onError={(error) => {
        console.error("[crm-embed] failed to load", error);
        setLoadFailed(true);
      }}
    />
  );
}
