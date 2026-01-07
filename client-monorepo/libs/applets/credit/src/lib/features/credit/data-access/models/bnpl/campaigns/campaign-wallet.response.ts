import { GenericApiResponse } from '../../generic-api-response.model';

export interface CampaignWalletResponse extends GenericApiResponse {
  amount: number;
  installmentCount: number;
}
