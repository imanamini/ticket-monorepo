import { InAppTacResponse } from '../tac/in-app-tac.response';

export interface PaymentInfo extends InAppTacResponse {
  ticket: string;
  amount: number;
  certFile: string;
  pspCode: string;
  walletBalance: number;
  images: string[];
  ipgImages: string[];
}
