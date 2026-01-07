import { ApiResponse } from '../../../api-response.model';

export interface CampaignWalletResponse extends ApiResponse {
  amount: number;
  installmentCount: number;
}
