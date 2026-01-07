import { GenericApiResponse } from '../../generic-api-response.model';

export interface ConfigResponse extends GenericApiResponse {
  maxUploadSize: number;
  otpLength: number;
}
