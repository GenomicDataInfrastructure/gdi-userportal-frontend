// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";

type AuthErrorBannerProps = {
  authError?: string;
};

const KNOWN_AUTH_ERRORS = ["missing-terms"];

const AuthErrorBanner = ({ authError }: AuthErrorBannerProps) => {
  const t = useTranslations("auth");

  if (!authError || !KNOWN_AUTH_ERRORS.includes(authError)) {
    return null;
  }

  const title = t(`${authError}.title`);
  const message = t(`${authError}.message`);

  return (
    <div
      className="mx-auto mb-10 w-full max-w-4xl rounded-lg border-l-4 border-l-warning bg-warning/10 p-4 text-left shadow-lg"
      role="alert"
    >
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-6 md:text-base">{message}</p>
    </div>
  );
};

export default AuthErrorBanner;
