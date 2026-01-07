export interface FeeDetails {
  type: FeeDetailType;
  value: number;
}

export enum FeeDetailType {
  FIX_AMOUNT,
  PERCENTAGE,
}
