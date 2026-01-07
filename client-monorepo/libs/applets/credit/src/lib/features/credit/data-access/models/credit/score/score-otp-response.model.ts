import { GenericApiResponse } from '../../generic-api-response.model';

export interface ScoreOtpResponse extends GenericApiResponse {
  trackingCode: string;
}
