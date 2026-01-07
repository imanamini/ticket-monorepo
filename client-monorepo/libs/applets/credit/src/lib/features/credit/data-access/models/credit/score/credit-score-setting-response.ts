import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditIcsSettingResponse extends GenericApiResponse {
  fromTime: string;
  toTime: string;
  enabled: boolean;
  limitted?: boolean;
}
