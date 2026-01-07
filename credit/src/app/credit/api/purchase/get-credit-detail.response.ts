import { ApiResponse } from '../api-response.model';
import { Redirect } from './redirect.model';
import { CreditWallet } from './credit-wallet.model';
import { ServiceType } from '../../core/models/serviceType.model';

export enum RepaymentOption {
  PAY_IN_ONE,
  PAY_IN_X
}

export interface GetCreditDetailResponse extends ApiResponse {
  serviceType: ServiceType;
  remainingMinutes: number;
  imageId: number;
  businessTitle: string;
  cancelRedirect: Redirect;
  creditDetail: CreditWallet;
  creditAgreement: boolean;
  cellNumber: string;
  repaymentOption: RepaymentOption;
}
