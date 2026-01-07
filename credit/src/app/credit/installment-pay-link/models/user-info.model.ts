import { InstallmentPayLinkResponse } from '../../api/installment-pay-link/installment-pay-link.response';

export interface IplUserInfo extends InstallmentPayLinkResponse {
  uuid?: string;
  cellNumber?: string;
  userId?: string;
}
