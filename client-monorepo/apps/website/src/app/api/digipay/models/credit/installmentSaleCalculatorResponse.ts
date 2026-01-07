import { ApiResult } from '../api-result.model';

export interface InstallmentSaleCalculatorItem {
  installmentChequeCount: number;
  installmentChequeAmount: number;
  totalAmount: number;
  creditAmount: number;
  allocationPrepaymentAmount: number;
  allocationPrepaymentPercentage: number;
  monthCount: number;
  planId: string;
  groupId: string;
}

export interface InstallmentSaleCalculatorResponse {
  result: ApiResult;
  installmentOffers: InstallmentSaleCalculatorItem[];
}
