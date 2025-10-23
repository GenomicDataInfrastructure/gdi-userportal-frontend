// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Button from "@/components/Button";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export function EmptyEntitlements() {
  return (
    <div className="mb-7 flex w-full flex-col items-center justify-center gap-4">
      <p className="text-md text-center text-primary">
        <span>You don&apos;t have any entitlement yet.</span>
        <br />
        <span>
          Wait for your application(s) to be approved, or submit a new
          application.
        </span>
      </p>
      <Button
        icon={faPlusCircle}
        text="Add datasets"
        href="/datasets"
        type="primary"
        className="text-xs"
      />
    </div>
  );
}
