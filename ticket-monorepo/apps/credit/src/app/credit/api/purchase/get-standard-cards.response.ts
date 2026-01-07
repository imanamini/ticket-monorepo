import { ApiResponse } from '../api-response.model';

export interface StandardCard {
  title: string;
  fundProviderCode: number;
  fundProviderBusinessId: string;
  description: string;
  icon: string;
  color: string;
}

export interface GetStandardCardsResponse extends ApiResponse {
  fundProviders: StandardCard[];
}
