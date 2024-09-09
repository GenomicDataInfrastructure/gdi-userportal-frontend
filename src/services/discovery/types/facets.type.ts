import { ValueLabel } from "./datasetSearch.types";

export type Facet = {
  facetGroup: string;
  key: string;
  label: string;
  values: ValueLabel[];
};
