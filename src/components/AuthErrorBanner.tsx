// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

type AuthErrorBannerProps = {
  authError?: string;
};

const authErrorMessages: Record<string, { title: string; message: string }> = {
  "missing-terms": {
    title: "Login blocked",
    message:
      "You must accept the terms and conditions before you can access the portal.",
  },
};

const AuthErrorBanner = ({ authError }: AuthErrorBannerProps) => {
  if (!authError || !(authError in authErrorMessages)) {
    return null;
  }

  const { title, message } = authErrorMessages[authError];

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
