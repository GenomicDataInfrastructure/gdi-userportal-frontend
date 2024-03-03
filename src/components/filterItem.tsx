// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MultipleSelector, { type Option } from "./ui/multipleSelector";

export type FilterItemProps = {
  label: string;
  data: Option[];
  icon: IconDefinition;
};

function FilterItem({ label, data, icon }: FilterItemProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-x-3">
        <FontAwesomeIcon
          icon={icon}
          className="text-xs font-extrabold text-info"
        />
        <p className="text-bold text-info">{label}</p>
      </div>
      <MultipleSelector
        label={label}
        defaultOptions={data}
        placeholder={label}
        className="text-[0.8rem]"
        emptyIndicator={
          <p className="text-center text-[0.8rem] leading-10">
            No results found.
          </p>
        }
        badgeClassName="bg-warning text-black text-[0.7rem] max-w-full break-all"
      />
    </div>
  );
}

export default FilterItem;
