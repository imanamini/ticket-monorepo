import { GenericApiResponse } from '../../generic-api-response.model';

export interface LandingConfig {
  title: string;
  bannerImageId: string;
  campaignInfo: CampaignInfo;
  tacInfo: {
    title: string;
    url: string;
    isEnable: boolean;
  };
  description: {
    note: string;
    keywords: Array<string>;
  };
}

export interface CampaignInfo {
  title: string;
  type: number;
  isEnable: boolean;
}

export interface CreditScoringConfirmationMessage {
  color: number;
  keywords: string[];
  message: string;
  title: string;
  icon: string;
}

export interface CreditScoringFeeInfo {
  fee: string;
  tax: string;
  total: string;
}

export interface CreditScoringConfigResponse extends GenericApiResponse {
  confirmationMessage: CreditScoringConfirmationMessage;
  landingConfig: LandingConfig;
  feeInfo: CreditScoringFeeInfo;
}
