import { CreditWallet } from './credit-wallet.model';
import { GenericApiResponse } from '../../generic-api-response.model';

export interface WalletsResponse extends GenericApiResponse {
  creditWallets: CreditWallet[];
  creditVolunteers: CreditWallet[];
}
