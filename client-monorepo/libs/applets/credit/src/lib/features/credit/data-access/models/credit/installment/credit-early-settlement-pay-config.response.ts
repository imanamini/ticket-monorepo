import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditEarlySettlementPayConfigResponse extends GenericApiResponse {
  title: string;
  subTitle: string;
  description: string;
  colors: number[];
  icon: string;
}
