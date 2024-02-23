// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import Button from "@/components/button";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

interface ErrorBoundaryProps {
  error?: Error & { digest?: string };
  statusCode?: number;
}

export default function ErrorBoundary({
  error,
  statusCode,
}: ErrorBoundaryProps) {
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  let heading = "Something Went Wrong";
  let message =
    "Our apologies, but our server has encountered an internal error that prevents it from fulfilling your request. This is a temporary issue, and we're on the case to get it fixed. Please try again in a little while.";

  switch (statusCode) {
    case 404:
      heading = "Page Not Found";
      message =
        "The page you're looking for doesn't seem to exist. It might have been moved or deleted.";
      break;
    case 401:
      heading = "Unauthorized";
      message =
        "You're not authorized to access this page. Please log in and try again.";
      break;
  }

  return (
    <section>
      <div className="container mx-auto w-full max-w-3xl p-4 md:p-8">
        <div>
          {process.env.NODE_ENV === "development" && error && (
            <div className="bg-primary p-4 text-warning">
              <p className="font-medium">{error.message}</p>
              {error.stack && (
                <pre className="mt-4 overflow-x-auto">{error.stack}</pre>
              )}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-semibold text-primary md:text-3xl">
            {heading}
          </h1>
          <p className="mt-4 text-secondary">{message}</p>
          <div className="mt-6">
            <Button
              href="/"
              text="Take me home"
              icon={faHouse}
              type="primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
