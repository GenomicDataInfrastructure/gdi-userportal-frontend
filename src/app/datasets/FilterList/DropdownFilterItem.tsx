// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Disclosure } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterItemProps } from "./FilterItem";

type DropdownFilterContentProps = FilterItemProps;

export default function DropdownFilterContent({
  filter,
}: DropdownFilterContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const paramValue =
      searchParams?.get(`${filter.source}-${filter.key}`) || "";
    if (paramValue) {
      setOptions(paramValue.split(","));
    } else {
      setOptions([]);
    }
  }, [searchParams, filter.key, filter.source]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newOptions = checked
      ? [...options, value]
      : options.filter((v) => v !== value);

    setOptions(newOptions);
    updateUrl(newOptions);
  };

  const updateUrl = (newOptions: string[]) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    if (newOptions.length > 0) {
      params.set(`${filter.source}-${filter.key}`, newOptions.join(","));
    } else {
      params.delete(`${filter.source}-${filter.key}`);
    }

    params.set("page", "1");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  return (
    <Disclosure.Panel className="px-4 pb-2 pt-4 font-bryant font-normal flex flex-col gap-y-3 text-base border-t-2 border-t-primary max-h-80 overflow-y-auto">
      {filter.values!.length > 0 ? (
        filter.values!.map((item) => (
          <div
            key={item.value}
            className="flex items-center hover:bg-warning rounded-md p-2 cursor-pointer w-full transition-colors"
          >
            <input
              type="checkbox"
              className="h-4 w-4 border rounded-md checked:accent-warning flex-none"
              id={`${filter.source}-${item.value}`}
              value={item.value}
              checked={options.includes(item.value)}
              onChange={(e) =>
                handleCheckboxChange(item.value, e.target.checked)
              }
            />
            <label
              htmlFor={`${filter.source}-${item.value}`}
              className="ml-2.5 flex-1 cursor-pointer"
            >
              {item.label}
            </label>
          </div>
        ))
      ) : (
        <div className="text-center">No results found.</div>
      )}
    </Disclosure.Panel>
  );
}
