export type StepUID =
  'credit-revise-step'
  | 'ics-step'
  | 'identity-evaluation-step'
  | 'fund-provider-evaluation-step'
  | 'digipay-credit-revise-step'
  | 'digipay-ics-step'
  | 'digipay-identity-evaluation-step'
  | 'max-credit-amount'
  | 'ics'
  | 'identity-evaluation'
  | 'fund-provider-activation';

export interface Detail {
  needDocuments: boolean;
  needIban: boolean;
}

export interface MaxCreditAmountDetails {
  maxCreditAmount: number;
  description: string;
  requiredDocuments?: string;
}

export interface Step {
  actionType: number;
  buttonLabel: string;
  buttonType: number;
  date: number;
  icon: string;
  label: string;
  tag: string;
  uid: StepUID;
  description: string;
  detail: Detail;
  maxCreditAmountDetails: MaxCreditAmountDetails[];
}
