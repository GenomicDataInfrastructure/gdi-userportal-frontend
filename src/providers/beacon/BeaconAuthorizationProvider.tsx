// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { BeaconAuthorizationStatus } from "@/app/api/ga4gh/beacon-authorization.types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import contentConfig from "@/config/contentConfig";

export function isBeaconAuthorized(auth?: BeaconAuthorizationStatus): boolean {
  return !!auth && auth.hasResearcherStatus && auth.hasAcceptedTC;
}

export function getBeaconAuthReason(auth?: BeaconAuthorizationStatus): {
  hasResearcherStatus: boolean;
  hasAcceptedTC: boolean;
} {
  return {
    hasResearcherStatus: !!auth?.hasResearcherStatus,
    hasAcceptedTC: !!auth?.hasAcceptedTC,
  };
}

type BeaconAuthorizationState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "error" }
  | { status: "ready"; auth: BeaconAuthorizationStatus };

const BeaconAuthorizationContext = createContext<
  BeaconAuthorizationState | undefined
>(undefined);

export function BeaconAuthorizationProvider({
  children,
  isAuthenticated,
  enabled = contentConfig.beaconSearchEnabled,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
  enabled?: boolean;
}) {
  const [state, setState] = useState<BeaconAuthorizationState>({
    status: "loading",
  });

  useEffect(() => {
    if (!enabled) {
      setState({ status: "unauthenticated" });
      return;
    }

    if (!isAuthenticated) {
      setState({ status: "unauthenticated" });
      return;
    }

    let cancelled = false;
    let requestController: AbortController | undefined;
    setState({ status: "loading" });

    const loadAuthorization = () => {
      requestController?.abort();
      requestController = new AbortController();
      setState({ status: "loading" });

      fetch("/api/beacon/authorization", {
        credentials: "include",
        signal: requestController.signal,
      })
        .then(async (response) => {
          if (cancelled) return;

          if (!response.ok && response.status !== 403) {
            throw new Error(`HTTP ${response.status}`);
          }

          const auth = (await response.json()) as BeaconAuthorizationStatus;
          if (!cancelled) {
            setState({ status: "ready", auth });
          }
        })
        .catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
          console.error(
            "[BeaconAuthorizationProvider] authorization check failed",
            error
          );
          if (!cancelled) {
            setState({ status: "error" });
          }
        });
    };

    loadAuthorization();
    window.addEventListener("focus", loadAuthorization);

    return () => {
      cancelled = true;
      requestController?.abort();
      window.removeEventListener("focus", loadAuthorization);
    };
  }, [enabled, isAuthenticated]);

  return (
    <BeaconAuthorizationContext.Provider value={state}>
      {children}
    </BeaconAuthorizationContext.Provider>
  );
}

export function useBeaconAuthorization(): BeaconAuthorizationState {
  const context = useContext(BeaconAuthorizationContext);
  if (context === undefined) {
    throw new Error(
      "useBeaconAuthorization must be used within a BeaconAuthorizationProvider"
    );
  }
  return context;
}
