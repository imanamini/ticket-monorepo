export interface ActualCreditAllocation {
  digipayFee: number;
  fundProviderFee: number;
  feeLabel: string;
  fundProviderInterest: number;
  fundProviderInterestLabel: string;
  settlementAmount: number;
  requestedAmount: number;
  settlementDate: number;
}
