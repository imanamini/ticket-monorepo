export interface CreditSmartScoringOngoingPlan {
  fundProvider: {
    fundProviderName: string;
    fundProviderIcon: string;
    fundProviderColor: string;
  };
  user: {
    nationalCode: string;
    phoneNumber: string;
  };
  plan: {
    creditAmount: number;
    installmentCount: number;
  };
}
