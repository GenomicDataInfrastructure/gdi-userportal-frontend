"use client";
import { SessionProvider } from "next-auth/react";

function SessionProviderWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default SessionProviderWrapper;
