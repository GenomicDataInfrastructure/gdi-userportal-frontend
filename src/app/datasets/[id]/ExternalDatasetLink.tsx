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

type ExternalDatasetLinkProps = {
  url: string;
};

export default function ExternalDatasetLink({ url }: ExternalDatasetLinkProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = () => {
    setShowDialog(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="inline-flex items-center gap-2 text-xs rounded-md px-3 py-2 font-semibold bg-info text-white hover:bg-secondary transition-colors duration-200 w-fit"
      >
        <span>Access External Dataset</span>
        <span>→</span>
      </button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
