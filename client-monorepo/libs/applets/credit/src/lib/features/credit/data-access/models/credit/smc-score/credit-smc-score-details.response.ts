import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditSmcScoreDetailsResponse extends GenericApiResponse {
  allocationPrepaymentPercentage: number;
  creditAmount: number;
  fundProvider: {
    active: boolean;
    color: string;
    fundProviderCode: number;
    fundProviderType: string;
    icon: string;
    interestPercentage: number;
    label: string;
    name: string;
    title: string;
  };
  installmentCount: number;
}
