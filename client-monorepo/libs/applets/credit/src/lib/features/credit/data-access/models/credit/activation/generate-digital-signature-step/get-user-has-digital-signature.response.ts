import { GenericApiResponse } from '../../../generic-api-response.model';

export interface GetUserHasDigitalSignatureResponse extends GenericApiResponse {
  remainingDays: number;
}
