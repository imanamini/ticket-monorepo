type collectionType = 'simple' | 'collection' | 'range';

export interface RequestCardInsuranceRestrictsModel {
  type: collectionType;
  field: string;
  operation: string;
  minValue: string;
  maxValue: string;
  value: string;
  values: string[];
}
