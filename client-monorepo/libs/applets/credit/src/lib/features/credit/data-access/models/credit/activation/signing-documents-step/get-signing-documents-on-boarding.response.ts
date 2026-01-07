import { GenericApiResponse } from '../../../generic-api-response.model';

export interface GetSigningDocumentsOnBoardingResponse extends GenericApiResponse {
  title: string;
  message: string;
  imageId: string;
  buttonLabel: string;
  guidFilmLink: string;
  countDownSeconds: number;
}
