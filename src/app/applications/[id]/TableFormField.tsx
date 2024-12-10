// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useApplicationDetails } from "@/providers/application/ApplicationProvider";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  FormFieldTableValue,
  RetrievedApplicationFormField,
} from "@/app/api/access-management/open-api/schemas";

type TableFormFieldProps = {
  formId: number;
  field: RetrievedApplicationFormField;
  title: string;
  editable: boolean;
  validationWarning?: string;
};

function TableFormField({
  formId,
  field,
  title,
  editable,
  validationWarning,
}: TableFormFieldProps) {
  const { updateInputFields } = useApplicationDetails();
  const [tableValues, setTableValues] = useState<FormFieldTableValue[][]>(
    field.tableValues || [[]]
  );

  const handleInputChange = (
    rowIndex: number,
    column: string,
    value: string
  ) => {
    const updatedTableValues = [...tableValues];
    const row = updatedTableValues[rowIndex] || [];
    const columnIndex = row.findIndex((item) => item.column === column);

    if (columnIndex > -1) {
      row[columnIndex].value = value;
    } else {
      row.push({ column, value });
    }

    updatedTableValues[rowIndex] = row;
    setTableValues(updatedTableValues);

    const serializedTableValues = JSON.stringify(updatedTableValues);
    updateInputFields(formId, field.id!, serializedTableValues);
  };

  const addRow = () => {
    setTableValues([...tableValues, []]);
  };

  const deleteRow = (rowIndex: number) => {
    const updatedTableValues = tableValues.filter(
      (_, index) => index !== rowIndex
    );
    setTableValues(updatedTableValues);
    const serializedTableValues = JSON.stringify(updatedTableValues);
    updateInputFields(formId, field.id!, serializedTableValues);
  };

  const isDisabled = !editable;

  return (
    <div className="flex flex-col py-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg sm:text-xl">
          {title} {field.optional ? "(Optional)" : ""}
        </h3>
        <button
          onClick={addRow}
          disabled={isDisabled}
          className="ml-4 mt-2 py-2 px-4 bg-primary text-white rounded-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Row
        </button>
      </div>
      <table className="mt-4 border-collapse">
        <thead>
          <tr>
            {field.tableColumns!.map((column) => (
              <th key={column.key} className="px-4 py-2">
                {column.label!.find((label) => label.language === "en")?.name ||
                  column.label![0].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableValues.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {field.tableColumns!.map((column) => (
                <td key={column.key} className="px-2 py-2">
                  <input
                    type="text"
                    value={
                      row.find((item) => item.column === column.key)?.value ||
                      ""
                    }
                    onChange={(e) =>
                      handleInputChange(rowIndex, column.key!, e.target.value)
                    }
                    disabled={isDisabled}
                    className={`w-full p-2 border-2 rounded-md ${
                      isDisabled
                        ? "border-slate-200 cursor-not-allowed bg-slate-50 opacity-50"
                        : "border-primary focus:outline-none focus:ring-primary"
                    }`}
                  />
                </td>
              ))}
              <td>
                <button
                  onClick={() => deleteRow(rowIndex)}
                  disabled={isDisabled}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className={`w-full h-5 w-5 pl-2 ${
                      isDisabled
                        ? "text-slate-200 cursor-not-allowed"
                        : "text-secondary hover:text-warning"
                    }`}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {validationWarning && (
        <span className="text-red-600 mt-2">{validationWarning}</span>
      )}
    </div>
  );
}

export default TableFormField;
