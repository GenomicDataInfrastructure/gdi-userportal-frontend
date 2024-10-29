import Button from "@/components/Button";
import { FilterType } from "@/services/discovery/types/filter.type";
import { faCheck, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { useState } from "react";
import { FilterItemProps } from "./FilterItem";

type FreeTextFilterContentProps = FilterItemProps;

type FreeTextFilterValue = {
  value: string;
  operator: FilterType;
};

type FreeTextFilterOutput = {
  filterKey: string;
  values: FreeTextFilterValue[];
};

export default function FreeTextFilterContent({
  filter,
}: FreeTextFilterContentProps) {
  const [nbFilters, setNbFilters] = useState(1);
  const [openedDropdown, setOpenedDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenedDropdown(openedDropdown === index ? null : index);
  };

  const handleAddNewFilter = () => {
    setNbFilters((nbFilters) => nbFilters + 1);
  };

  const handleSelectOperator = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    console.log("Done");
    event.stopPropagation();
    const operator = (event.target as HTMLElement).innerText;
    const operatorInput = document.getElementById(
      `${filter.key}-${index}-operator`
    ) as HTMLInputElement;
    const operatorDisplay = document.getElementById(
      `${filter.key}-${index}-operator-display`
    ) as HTMLSpanElement;
    operatorInput.value = operator;
    operatorDisplay.innerText = operator;
    operatorDisplay.classList.remove("text-[#a0a0a0]");
    setOpenedDropdown(null);
  };

  const handleSubmitValue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const filterValues: FreeTextFilterValue[] = Array.from({
      length: nbFilters,
    }).reduce((acc: FreeTextFilterValue[], _, index) => {
      const value = formData.get(`${filter.key}-${index}-value`) as string;
      const operator = formData.get(
        `${filter.key}-${index}-operator`
      ) as FilterType;

      if (value && operator) {
        acc.push({ value, operator });
      }

      return acc;
    }, []);

    const filterOutput: FreeTextFilterOutput = {
      filterKey: filter.key,
      values: filterValues,
    };

    return filterOutput;
  };

  return (
    <Disclosure.Panel className="px-4 pb-2 pt-4 font-bryant font-normal text-base border-t-2 border-t-primary h-fit">
      <form onSubmit={handleSubmitValue} className="flex flex-col gap-y-9">
        {Array.from({ length: nbFilters }, (_, index) => (
          <div key={index} className="flex flex-col gap-y-3">
            <div className="flex gap-x-8 justify-between items-center w-full">
              <label htmlFor={`${filter.key}-${index}-value`} className="w-24">
                Value
              </label>
              <input
                id={`${filter.key}-${index}-value`}
                name={`${filter.key}-${index}-value`}
                className="border rounded-md p-2 w-full"
                placeholder="Enter a value"
              />
            </div>
            <div className="flex items-center w-full gap-x-8 justify-between">
              <label htmlFor={`operator`} className="w-24">
                Operator
              </label>
              <div className="relative w-full">
                <div
                  onClick={() => toggleDropdown(index)}
                  onBlur={() => setOpenedDropdown(null)}
                  tabIndex={0}
                  className="flex items-center justify-between p-2 bg-white border rounded-md cursor-pointer"
                >
                  <span
                    id={`${filter.key}-${index}-operator-display`}
                    className="text-[#a0a0a0]"
                  >
                    Select an operator
                  </span>
                  <span className="ml-2">&#9662;</span>
                </div>
                {index === openedDropdown && (
                  <div
                    className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {filter.operators &&
                      filter.operators.map((operator) => (
                        <div
                          key={operator + index}
                          className="p-2 hover:bg-warning cursor-pointer"
                          onClick={(event) =>
                            handleSelectOperator(event, index)
                          }
                        >
                          {operator}
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <input
                type="hidden"
                id={`${filter.key}-${index}-operator`}
                name={`${filter.key}-${index}-operator`}
              />
            </div>
          </div>
        ))}
        <div className="flex w-full justify-between">
          <Button
            text="Add another filter"
            icon={faPlusCircle}
            type="primary"
            flex={true}
            className="text-[14px]"
            onClick={handleAddNewFilter}
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
