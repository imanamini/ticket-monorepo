import { GenericApiResponse } from '../../generic-api-response.model';

export interface ContractSummaryOptionalItem {
  actionType: 'SHOW_HTML';
  payload: string;
  title: string;
}

export interface CreditContractListResponse extends GenericApiResponse {
  contractSummaryHeader: ContractSummaryHeader;
  contractSummaryMessage: ContractSummaryMessage;
  contractSummaryList: ContractSummary[];
  optionalItems: ContractSummaryOptionalItem[];
}

export interface ContractSummaryHeader {
  fundProviderCode: number;
  debt: number;
  installmentCount: number;
  balance: number;
}

export interface ContractSummaryMessage {
  message: string;
  messageColor: string;
  bgColor: string;
  borderColor: string;
}

export interface ContractSummary {
  trackingCode: string;
  contractType: ContractType;
  debt: number;
  credit: number;
  installmentCount: number;
  imageId: string;
  installments: Installment[];
}

export enum ContractType {
  FINAL,
  DRAFT,
  REFUND,
  CLOSE,
}

export interface Installment {
  amount: number;
  netAmount: number;
  penaltyAmount: number;
  date: number;
  number: number;
  persianNumber: string;
  trackingCode: string;
  badge: Badge;
  payStatus: INSTALLMENT_PAY_STATUS;
}

export interface Badge {
  text: string;
  color: string;
}

export enum INSTALLMENT_PAY_STATUS {
  DRAFT,
  PAY_CANDIDATE,
  PAYABLE,
  PAY_IN_PROGRESS,
  PAID,
  UNPAYABLE,
  REFUNDED,
  REFUNDING,
}
