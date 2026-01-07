import { GenericApiResponse } from '../../../generic-api-response.model';

export interface DigitalSignatureGenerationOnBoardingResponse extends GenericApiResponse {
  title: string;
  message: string;
  imageId: string;
  buttonLabel: string;
  guideFilmLink: string;
}
