import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditScoringOnBoardingItem {
  title: string;
  value: string;
  bold: boolean;
}

export interface CreditScoringOnBoarding {
  description: string;
  imageId: string;
  order: number;
  title: string;
  items: CreditScoringOnBoardingItem[];
}

export interface GetCreditScoringOnBoardingResponse extends GenericApiResponse {
  onBoardPages: CreditScoringOnBoarding[];
}
