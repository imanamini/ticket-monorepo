import { GenericApiResponse } from '@client-monorepo/common/network';

export interface InvoicePaymentExtraInfo {
  key: string;
  value: string;
}

export interface InvoicePaymentResponse extends GenericApiResponse {
  creditorName: string;
  creationDate: number;
  invoiceNumber: string;
  totalAmount: number;
  trackingCode: number;
  uniqueInvoiceNumber: string;
  extraInfo: InvoicePaymentExtraInfo[];
}
