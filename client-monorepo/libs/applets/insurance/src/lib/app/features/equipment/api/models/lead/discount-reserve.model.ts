export interface DiscountReserveModel {
  isValid: boolean;
  invalidMessage: string;
  discountAmount: number;
  payableAmount: number;
  taxAmount: number;
}
