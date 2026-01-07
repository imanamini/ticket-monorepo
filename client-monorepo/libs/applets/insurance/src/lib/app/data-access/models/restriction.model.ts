export interface RestrictionModel {
  field: string;
  operation?: string;
  type: string;
  value?: string;
  title?: string;
  minValue?: number;
  maxValue?: number;
  values?: string[];
}
