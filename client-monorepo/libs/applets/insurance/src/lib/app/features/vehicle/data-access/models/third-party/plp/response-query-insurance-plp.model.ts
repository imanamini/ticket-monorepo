import { RequestQueryInsuranceCardItemModel } from './request-query-insurance-plp.model';

export interface ResponseInitialQueryInsuranceCardItemModel {
  sessionId: string;
  interval: number;
  request?: RequestQueryInsuranceCardItemModel;
}
