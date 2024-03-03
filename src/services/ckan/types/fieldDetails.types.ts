export enum Field {
  THEME = 'theme',
  KEYWORD = 'keyword',
  DATASET = 'dataset',
  CATALOGUE = 'catalogue',
  PUBLISHER = 'publisher',
}

export type FieldDetails = {
  field: Field;
  values: string[];
  count: number;
};
