// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { FilterItemProps } from "./FilterItem";
import { useFilters } from "@/providers/filters/FilterProvider";
import { Disclosure } from "@headlessui/react";
import Button from "@/components/Button";
import { faCheck, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type EntriesFilterContentProps = FilterItemProps;

type EntryFormItem = {
  key: string;
  label: string;
  value: string;
};

export default function EntriesFilterContent({
  filter,
}: EntriesFilterContentProps) {
  const { activeFilters, addActiveFilter, removeActiveFilter } = useFilters();

  const correspondingActiveFilter = activeFilters.find(
    (f) => f.key === filter.key && f.source === filter.source
  );

  const initialEntryFormItems = filter.entries!.map((entry) => ({
    ...entry,
    value: "",
  }));

  const [entries, setEntries] = useState<EntryFormItem[]>(
    initialEntryFormItems
  );
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!correspondingActiveFilter) {
      setEntries(initialEntryFormItems);
    } else {
      const existingEntries = correspondingActiveFilter.entries!;
      setEntries(existingEntries);
    }
  }, [correspondingActiveFilter]);

  const handleRemoveFilter = () => {
    removeActiveFilter(filter.key, filter.source);
  };

  const handleSubmitValue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isFormValid = entries.every(
      (entry) => entry.value !== undefined && entry.value !== ""
    );

    if (!isFormValid) {
      setShowError(true);
      return;
    }

    const newActiveFilter = {
      source: filter.source,
      type: filter.type,
      key: filter.key,
      label: filter.label,
      entries: entries,
    };

    addActiveFilter(newActiveFilter);
    setShowError(false);
  };

  return (
    <Disclosure.Panel className="px-4 pb-2 pt-4 font-bryant font-normal text-base border-t-2 border-t-primary h-fit">
      <form onSubmit={handleSubmitValue} className="flex flex-col gap-y-8 mt-4">
        <div className="flex flex-col gap-y-3">
          {entries.map((entry) => (
            <div
              key={filter.source + filter.key + entry.key}
              className="flex gap-x-8 justify-between items-center w-full"
            >
              <label className="w-56">{entry.label}</label>
              <input
                className="border rounded-md p-2 w-full"
                placeholder="Enter a value"
                value={entry.value}
                onChange={(event) =>
                  setEntries(
                    entries.map((e) =>
                      e.key === entry.key
                        ? { ...e, value: event.target.value }
                        : e
                    )
                  )
                }
              />
            </div>
          ))}
        </div>
        {showError && (
          <span className="text-red-500">All fields must be filled</span>
        )}
        <div className="flex w-full justify-between">
          <Button
            text="Remove filter "
            icon={faXmarkCircle}
            type="primary"
            flex={true}
            className="text-[14px]"
            onClick={handleRemoveFilter}
          />
          <button
            type="submit"
            className="bg-primary text-white hover:bg-secondary rounded-md px-4 py-2 font-bold transition-colors duration-200 tracking-wide cursor-pointer flex items-center justify-between text-[14px]"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            <span>Apply</span>
          </button>
        </div>
      </form>
    </Disclosure.Panel>
  );
}
