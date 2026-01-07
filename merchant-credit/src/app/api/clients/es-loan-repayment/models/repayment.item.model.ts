import { SettlementValue } from '../../es-loan-dashboard/es-loan-search-value';
import { ExpectedCreditAllocation } from './expected-creditAllocation.model';
import { ActualCreditAllocation } from './actual-creditAllocation.model';

export interface RepaymentItemModel {
  requestedAmount: number;
  creationDate: number;
  dueDate: number;
  fundProviderCode: string;
  merchantId: string;
  merchantName: string;
  merchantNationalCode: string;
  providerId: string;
  iban: string;
  settlementAmount: number;
  settlementDate: number;
  actualDate: number;
  repaymentDate: number;
  today: number;
  status: SettlementValue;
  expectedCreditAllocation: ExpectedCreditAllocation;
  actualCreditAllocation: ActualCreditAllocation;
  trackingCode: string;
  paidDate: number;
  expectedSettlementDate: number;
  repaymentRemainPeriod: number;
}
