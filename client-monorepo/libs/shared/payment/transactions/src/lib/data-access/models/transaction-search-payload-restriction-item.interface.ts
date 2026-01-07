export interface TransactionSearchPayloadRestrictionItemInterface {
  type?: string;
  field?: string;
  value?: string | number | string[] | number[];
  minValue?: string | number;
  maxValue?: string | number;
  operation?: string;
  restrictions?: TransactionSearchPayloadRestrictionItemInterface[];
}
