import { GenericApiResponse } from '../../../generic-api-response.model';

export interface InstallmentSellsStatusResponse extends GenericApiResponse {
  status: INSTALLMENT_SELLS_STATUS_ENUM;
}

export enum INSTALLMENT_SELLS_STATUS_ENUM {
  INITIATED,
  ONBOARDED,
  GENERATED,
  REGISTERED,
  REGISTERED_CHECKED,
  UPLOADED,
  ACCEPTED,
  RECEIVED,
  REJECTED,
  APPROVED,
}
