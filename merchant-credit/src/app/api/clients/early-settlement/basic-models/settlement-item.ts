import { SettlementStatus } from './settlement-status';

export interface SettlementItem {
  requestedAmount: number;
  creationDate: number;
  fundProviderCode: string;
  merchantId: string;
  merchantName: string;
  merchantNationalCode: string;
  providerId: string;
  settlementAmount: number;
  settlementDate: number;
  status: SettlementStatus;
  trackingCode: string;
  paidDate: number;
  expectedSettlementDate: number;
}
