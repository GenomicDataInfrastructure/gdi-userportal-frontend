import {
  faBook,
  faFile,
  faFilter,
  faMagnifyingGlass,
  faSort,
  faTags,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./button";
import MultipleSelector from "./ui/multipleSelector";

const options = [
  {
    data: [
      {
        label: "Anka Bolka",
        value: "Anka Bolka",
      },
      { label: "Afdeling NKR-analyse", value: "Afdeling NKR-analyse" },
      { label: "Aleksandar Medarevic", value: "Aleksandar Medarevic" },
      {
        label: "Data and Policy Information Service",
        value: "Data and Policy Information Service",
      },
      {
        label: "Prof. Dr. Martin Steinlechner",
        value: "Prof. Dr. Martin Steinlechner",
      },
    ],
    placeholder: "Publishers",
    icon: faUser,
  },
  {
    data: [
      {
        label: "UMCG",
        value: "UMCG",
      },
      { label: "LUMC", value: "LUMC" },
      { label: "EU", value: "EU" },
      { label: "LNDS", value: "LNDS" },
    ],
    placeholder: "Catalogues",
    icon: faBook,
  },
  {
    data: [
      {
        label: "http://purl.obolibrary.org/obo/SCDO_0000494",
        value: "http://purl.obolibrary.org/obo/SCDO_0000494",
      },
      {
        label: "https://www.wikidata.org/wiki/Q11000047",
        value: "https://www.wikidata.org/wiki/Q11000047",
      },
      {
        label: "https://www.wikidata.org/wiki/Q12131",
        value: "https://www.wikidata.org/wiki/Q12131",
      },
      {
        label: "https://www.wikidata.org/wiki/Q9349858",
        value: "https://www.wikidata.org/wiki/Q9349858",
      },
      {
        label: "https://www.wikidata.org/wiki/Q232323",
        value: "https://www.wikidata.org/wiki/Q232323",
      },
    ],
    placeholder: "Themes",
    icon: faTags,
  },
  {
    data: [
      {
        label: "Addiction",
        value: "Addiction",
      },
      { label: "Antiviral", value: "Antiviral" },
      { label: "Biomedical Research", value: "Biomedical Research" },
      { label: "Data Bank", value: "Data Bank" },
    ],
    placeholder: "Keywords",
    icon: faMagnifyingGlass,
  },
  {
    data: [
      {
        label: "CSV",
        value: "CSV",
      },
      { label: "JSON", value: "JSON" },
      { label: "XLSX", value: "XLSX" },
    ],
    placeholder: "Formats",
    icon: faFile,
  },
  {
    data: [
      {
        label: "Relevance",
        value: "Relevance",
      },
      { label: "Last Created", value: "Last Created" },
      { label: "Last Modified", value: "Last Modified" },
    ],
    placeholder: "Sorting",
    icon: faSort,
  },
];

function FilterList() {
  return (
    <div className="flex flex-col gap-y-10 rounded-lg px-6 py-8">
      <h1 className="text-lg">
        <span className="mr-2">
          <FontAwesomeIcon icon={faFilter} />
        </span>
        Filters
      </h1>
      {options.map((option) => {
        return (
          <div key={option.placeholder}>
            <div className="mb-3 flex items-center gap-x-3">
              <FontAwesomeIcon
                icon={option.icon}
                className="text-xs font-extrabold text-info"
              />
              <p className="text-bold text-info">{option.placeholder}</p>
            </div>
            <MultipleSelector
              defaultOptions={option.data}
              placeholder={option.placeholder}
              className="text-[0.8rem]"
              emptyIndicator={
                <p className="text-center text-[0.8rem] leading-10">
                  No results found.
                </p>
              }
              badgeClassName="bg-warning text-black text-[0.7rem]"
            />
          </div>
        );
      })}
      <div className="mt-4">
        {
          <Button
            text="Clear Filters"
            type="secondary"
            className="w-full text-[7px] md:text-xs"
          ></Button>
        }
      </div>
    </div>
  );
}

export default FilterList;
