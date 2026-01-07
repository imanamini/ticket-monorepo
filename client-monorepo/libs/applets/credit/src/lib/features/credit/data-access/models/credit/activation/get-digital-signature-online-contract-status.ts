import { GenericApiResponse } from '../../generic-api-response.model';

export interface GetDigitalSignatureOnlineContractStatus extends GenericApiResponse {
  pageTitle: string;
  title: string;
  message: string;
  imageId: string;
  buttonLabel: string;
  featureName: number;
}
