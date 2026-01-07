import { CreditWallet } from './credit-wallet.model';
import { GenericApiResponse } from '../../generic-api-response.model';

export interface GetWalletResponse extends GenericApiResponse {
  creditWallet: CreditWallet;
}
