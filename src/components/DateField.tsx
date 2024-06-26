// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
}

const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <label htmlFor="date" className="mb-2 block font-bold text-secondary">
        Date
      </label>
      <div className="flex items-center">
        <DatePicker
          id="date"
          selected={value}
          onChange={onChange}
          className="block h-12 w-full rounded-md border-2 border-primary p-2 text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          placeholderText="dd/mm/yyyy"
          dateFormat="dd/MM/yyyy"
          calendarClassName="rounded-lg shadow-lg p-2"
          dayClassName={() => "p-2 rounded-full hover:bg-blue-200"}
          popperPlacement="bottom-start"
        />
      </div>
    </div>
  );
};

export default DateField;
