// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";

import { useEffect } from "react";
import Button from "@/components/Button";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section>
      <div className="container mx-auto w-full max-w-3xl p-4 md:p-8">
        <div>
          {process.env.NODE_ENV !== "development" && (
            <div className="bg-primary p-4 text-warning">
              <p className="font-medium">{error.message}</p>
              {error.stack && (
                <pre className="mt-4 overflow-x-auto">{error.stack}</pre>
              )}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-semibold text-primary md:text-3xl">
            Internal Server Error
          </h1>
          <p className="mt-4 text-secondary">
            Our apologies, but our server has encountered an internal error that
            prevents it from fulfilling your request. This is a temporary issue,
            and we&apos;re on the case to get it fixed. Please try again in a
            little while
          </p>
          <div className="mt-6">
            <Button href="/" text="Take me home" icon={faHouse} />
          </div>
        </div>
      </div>
    </section>
  );
}
