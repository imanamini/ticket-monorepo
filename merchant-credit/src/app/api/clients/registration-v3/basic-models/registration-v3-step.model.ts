export enum StepUID {
  SAMAN_CREDIT_REVISE_STEP = 'saman-credit-revise-step',
  SAMAN_ICS_STEP = 'saman-ics-step',
  SAMAN_IDENTITY_EVALUATION_STEP = 'saman-identity-evaluation-step',
  SAMAN_FUND_PROVIDER_EVALUATION_STEP = 'saman-fund-provider-evaluation-step',
  // DIGIPAY_CREDIT_REVISE_STEP = 'digipay-credit-revise-step',
  // DIGIPAY_ICS_STEP = 'digipay-ics-step',
  // DIGIPAY_IDENTITY_EVALUATION_STEP = 'digipay-identity-evaluation-step',
  // CREDIT_REVISE_STEP = 'credit-revise-step',
  // ICS_STEP = 'ics-step',
  // IDENTITY_EVALUATION_STEP = 'identity-evaluation-step',
  // FUND_PROVIDER_EVALUATION_STEP = 'fund-provider-evaluation-step',
}

export interface Detail {
  needDocuments: boolean;
  needIban: boolean;
}

export interface MaxCreditAmountDetails {
  maxCreditAmount: number;
  description: string;
}

export interface RegistrationStep {
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
