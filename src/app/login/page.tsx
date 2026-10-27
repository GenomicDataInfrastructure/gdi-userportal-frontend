// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

function startLogin() {
  const callbackUrl =
    new URL(window.location.href).searchParams.get("callbackUrl") || "/";
  return signIn("keycloak", { callbackUrl });
}

export default function LoginPage() {
  const t = useTranslations();
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      void startLogin();
    }
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <button type="button" onClick={() => void startLogin()}>
        {t("auth.login")}
      </button>
    </div>
  );
}
