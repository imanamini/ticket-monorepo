import { GenericApiResponse } from '../../generic-api-response.model';

export enum ConfigPaymentFlow {
  internal,
  external,
}

export interface InstallmentPayConfigResponse extends GenericApiResponse {
  minAmount: number;
  maxAmount: number;
  payableAmount: number;
  partialPaymentEnabled: boolean;
  paymentFlow: ConfigPaymentFlow;
  icon: string;
  colors: [number, number];
  title: string;
  descriptionTitle: string;
  descriptionBody: string;
  hintMessage: string;
}
