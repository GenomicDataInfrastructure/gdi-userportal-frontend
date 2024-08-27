// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAlert } from "@/providers/AlertProvider";
import Alert from "@/components/Alert";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

function PageContainer({ children, className }: PageContainerProps) {
  const { alert, onCloseAlert, setAlert } = useAlert();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    setAlert(null);
  }, [pathname, searchParams, setAlert]);

  return (
    <div className={`container mx-auto px-4 pt-20 ${className}`}>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          details={alert.details}
          onClose={onCloseAlert}
        />
      )}
      {children}
    </div>
  );
}

export default PageContainer;
