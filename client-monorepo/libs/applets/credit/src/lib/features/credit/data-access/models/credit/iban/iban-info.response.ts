import { GenericApiResponse } from '../../generic-api-response.model';

export interface IbanInfoResponse extends GenericApiResponse {
  ownersInfo: { firstName: string; lastName: string }[];
  bankCode: string;
  bankName: string;
  imageId: string;
}
