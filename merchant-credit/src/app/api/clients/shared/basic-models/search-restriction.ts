export interface SearchRestriction {
  field: string;
  type: 'collection' | 'range' | 'simple' | 'or';
  value?: any;
  values?: any;
  operation?: string;

}
