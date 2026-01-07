import { ApiResultInterface } from '@client-monorepo/common/network';

export interface CreditTypesResponse extends ApiResultInterface {
  creditTypes: CreditTypes[];
}
export interface CreditTypes {
  creditId: string;
  title: string;
  description: string;
  balance: number;
  serviceType: number;
  isChecked: boolean;
}

export interface Barcode {
  ttl: number;
  barcodeNumber: string;
  selectedCredit: CreditTypes;
}

export interface InquiryBarcodeData {
  merchantName: string;
  amount: number;
  barcodeNumber: number;
}

export interface PurchaseConfirmation {
  result: Result;
  amount?: number;
  merchantName?: string;
  status: PurchaseConfirmationStatus;
  creditTypes?: CreditTypes[];
  error?: PurchaseConfirmationError;
}

export enum PurchaseConfirmationStatus {
  SUCCESS = 0,
  ERROR = -1,
}

interface PurchaseConfirmationError {
  code: number;
  description: 'SERVICE_TYPE_NOT_FOUND' | 'OFFLINE_PURCHASE_NOT_FOUND';
}

export interface PurchaseResult {
  result: Result;
  receiptData: string;
}

export interface PaymentResult {
  result: Result;
  title: string;
  amount: number;
  activityInfo: Record<number, Record<string, string>>;
  type: number;
}

export interface Result {
  title: string;
  status: number;
  message: string;
  level: string;
}
