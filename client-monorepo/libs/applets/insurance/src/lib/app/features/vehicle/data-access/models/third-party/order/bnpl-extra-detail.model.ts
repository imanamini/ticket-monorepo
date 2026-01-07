export interface BnplExtraDetailModel {
  creditAmount: number;
  creditDifferenceAmount: number;
  creditErrorMessage?: string;
  creditMessage?: string;
  creditState: number;
  errorType: string;
  installmentAmount: number;
  installmentCount: number;
  maxLoanAmount: number;
  prePayment: number;
  showVerificationAllocationButton: boolean;
  pricingRuleDiscountPercent: number;
}
