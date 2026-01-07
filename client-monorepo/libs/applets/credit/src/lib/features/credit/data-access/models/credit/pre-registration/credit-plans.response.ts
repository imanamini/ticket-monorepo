export interface CreditPlanGroup {
  groupId: string;
  title: string;
  cost: string;
  subtitle: string;
  description: string;
  iconFileName: string;
  active: boolean;
  linkTitle?: string;
  link?: string;
}

export interface CreditPlan {
  chequeAmount: number;
  creditAmount: number;
  installmentAmount: number;
  installmentCount: number;
  payableAmount: number;
  prepaymentAmount: number;
  prepaymentPercentage: number;
  uuid: string;
  creditAmountLabel: string;
  description: string;
  display: {
    usability: boolean;
    title?: string;
    message?: string;
  };
  groupsHeaderTitle?: string;
  groupDetails?: CreditPlanGroup[];
}

export interface CreditPurePlan extends CreditPlan {
  fundProviderCode: number;
  fundProviderTitle: string;
  fundProviderInterestPercentage: number;
}
