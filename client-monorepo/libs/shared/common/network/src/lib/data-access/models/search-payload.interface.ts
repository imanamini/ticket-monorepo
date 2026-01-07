import { PagedPayloadInterface } from '@client-monorepo/common/network';

export interface SearchPayloadInterface<TField> extends PagedPayloadInterface {
  restrictions: Restriction<TField>[];
  orders: Order[];
}

export type Restriction<TField> = {
  type: RestrictionTypes;
  field: TField;
  value?: string | boolean | any;
  values?: string[] | number[];
  operation?: string;
  minValue?: number;
  maxValue?: number;
};

export type Order = {
  field: string;
  order: OrderTypes;
};

export enum OrderTypes {
  ASC = 'asc',
  DESC = 'desc',
}

export enum RestrictionTypes {
  SIMPLE = 'simple',
  COLLECTION = 'collection',
  RANGE = 'range',
  AND = 'and',
  OR = 'or',
}
