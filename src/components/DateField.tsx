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

const DateField: React.FC<DateFieldProps> = ({ value, onChange, className }) => {
    return (
        <div className={className}>
            <label htmlFor="date" className="block font-bold text-secondary mb-2">
                Date
            </label>
            <div className="flex items-center">
                <DatePicker
                    id="date"
                    selected={value}
                    onChange={onChange}
                    className="block w-full h-12 p-2 border-2 border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
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






