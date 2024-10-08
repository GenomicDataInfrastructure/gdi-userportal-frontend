/* SPDX-FileCopyrightText: 2024 PNED G.I.E. */

/* SPDX-License-Identifier: Apache-2.0 */
"use client";

import { Disclosure } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FilterItemProps } from "@/utils/convertDataToFilterItemProps";

function FilterItem({ field, label, data, groupKey }: FilterItemProps) {
  const [options, setOptions] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = (newOptions: string[]) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    if (newOptions.length > 0) {
      params.set(`${groupKey}-${field}`, newOptions.join(","));
    } else {
      params.delete(`${groupKey}-${field}`);
    }

    params.set("page", "1");

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  useEffect(() => {
    const paramValue = searchParams?.get(`${groupKey}-${field}`) || "";
    if (paramValue) {
      setOptions(paramValue.split(","));
    } else {
      setOptions([]);
    }
  }, [searchParams, field, groupKey]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newOptions = checked
      ? [...options, value]
      : options.filter((v) => v !== value);

    setOptions(newOptions);
    updateUrl(newOptions);
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="shadow-lg rounded-lg py-4 border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between px-4 py-2 text-left">
                <span className="text-base px-1.5">
                  {label}
                  {options.length > 0 && (
                    <span className="text-info mx-1">
                      ({options.length} filter{options.length > 1 ? "s" : ""}{" "}
                      applied)
                    </span>
                  )}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 pt-4 font-bryant text-base font-normal flex flex-col gap-y-3 text-base border-t-2 border-t-primary max-h-80 overflow-y-auto">
                {data.length > 0 ? (
                  data.map((item) => (
                    <div
                      key={item.value}
                      className="flex items-center hover:bg-warning rounded-md p-2 cursor-pointer w-full transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 border rounded-md checked:accent-warning flex-none"
                        id={`${groupKey}-${item.value}`}
                        value={item.value}
                        checked={options.includes(item.value)}
                        onChange={(e) =>
                          handleCheckboxChange(item.value, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`${groupKey}-${item.value}`}
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
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default FilterItem;
