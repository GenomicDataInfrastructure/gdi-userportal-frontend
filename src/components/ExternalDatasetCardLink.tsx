// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";

type ExternalDatasetDialogLinkProps = {
  url: string;
  onOpenChange?: (open: boolean) => void;
  children: (handlers: {
    onClick: (e: React.MouseEvent) => void;
  }) => React.ReactNode;
};

export function ExternalDatasetDialogLink({
  url,
  onOpenChange,
  children,
}: ExternalDatasetDialogLinkProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = () => {
    window.open(url, "_blank", "noopener,noreferrer");
    setShowDialog(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDialog(true);
  };

  return (
    <>
      {children({ onClick: handleClick })}
      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          onOpenChange?.(open);
        }}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>External Dataset</DialogTitle>
            <DialogDescription className="pt-2">
              You are about to be redirected to an external website. This
              dataset is not available for direct access through the GDI User
              Portal and must be requested through the external data provider.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              text="Cancel"
              onClick={() => setShowDialog(false)}
              type="secondary"
              className="mt-2"
            />
            <Button
              text="Continue to External Site"
              onClick={handleConfirm}
              type="primary"
              icon={faExternalLinkAlt}
              className="mt-2"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type ExternalDatasetCardLinkProps = {
  url: string;
};

export default function ExternalDatasetCardLink({
  url,
}: ExternalDatasetCardLinkProps) {
  return (
    <ExternalDatasetDialogLink url={url}>
      {({ onClick }) => (
        <button
          onClick={onClick}
          className="text-xs rounded-md px-3 py-1.5 font-semibold bg-info text-white hover:bg-secondary transition-colors duration-200 shrink-0 whitespace-nowrap cursor-pointer"
        >
          View External →
        </button>
      )}
    </ExternalDatasetDialogLink>
  );
}
