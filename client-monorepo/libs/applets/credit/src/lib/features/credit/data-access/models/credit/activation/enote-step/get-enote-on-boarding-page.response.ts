import { GenericApiResponse } from '../../../generic-api-response.model';

export interface GetEnoteOnBoardingPageResponse extends GenericApiResponse {
  iban: string;
  imageId: string;
  message: string;
  note: {
    description: string;
    title: string;
  };
  pageTitle: string;
  payableAmount: number;
  mandatoryFields: string[];
  guaranteeAmount: number;
  trackingCode: string;
  hasRenew: boolean;
}
