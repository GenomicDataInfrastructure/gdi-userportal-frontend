// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/utils/tailwindMerge";

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  disabled?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value ? new Date(event.target.value) : null;
    onChange?.(dateValue);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <input
          type="date"
          value={value ? value.toISOString().substring(0, 10) : ""}
          onChange={handleDateChange}
          className={cn(
            "w-full p-2 border-2 border-primary rounded-md focus:outline-none focus:ring-primary",
            disabled && "border-slate-200 cursor-not-allowed opacity-50",
            className
          )}
          disabled={disabled}
        />
      </Popover.Trigger>
    </Popover.Root>
  );
};
