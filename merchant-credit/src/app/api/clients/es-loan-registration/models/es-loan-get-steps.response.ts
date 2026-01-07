import { BaseApiResponse } from '../../../models/base-api.response';
import { EsLoanStep } from './es-loan-step';

export interface EsLoanGetStepsResponse extends BaseApiResponse {
  steps: EsLoanStep[];
  esLoanStateModel: EsLoanStateModel;
  creditId: string;
  requestAmount: number;
}

export interface EsLoanStateModel {
  state: string;
  icon: string;
  pageDescription: string;
  activeStep: number;
  buttonType: number;
  buttonStyle: number;
  buttonLabel: string;
  stateOwner: string;
}

export interface EsLoanRules {
  rules: EsLoanRule[];
}

export interface EsLoanRule {
  uid: string;
  profileId: string;
  fundProviderId: string;
  fundProviderName: string;
  merchantType: number;
  logoImageId: string;
  label: string;
  details: {
    [key: string]: {
      value: string
    }
  };
  visibleItems: number;
  ruleDetails: {
    label: string;
    value: string;
  }[];
}

export interface GetEsLoanMerchantsResponse extends BaseApiResponse {
  totalRemainingCreditAmount: number;
  merchants: EsloanMerchant[];
  businessRegistrationUrl: string;
  businessSettlementUrl: string;
}

export interface EsloanMerchant {
  creditId: string;
  fundProvider: string;
  status: EsloanMerchantStatus;
  imageId: string;
  legacy: boolean;
  maxCreditAmount: number;
  registrationStatus: string;
  remainingCreditAmount: number;
  businessRegistrationUrl: string;
  title: string;
}

export enum EsloanMerchantStatus {
  PENDING,
  APPROVED,
  REJECTED,
  CANCELED
}


