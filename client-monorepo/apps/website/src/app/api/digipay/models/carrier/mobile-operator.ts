import { OperatorIds } from './operator-ids';

export interface MobileOperator {
  imageId: string;
  name: string;
  description: string;
  operatorId: OperatorIds;
  prefixes: Prefix[];
  colorRange: number[];
}

export interface Prefix {
  value: string;
  types: number[];
}
