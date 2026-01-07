import { GenericApiResponse } from '../../generic-api-response.model';
import { OnboardingPage } from './onboarding-page';

export interface OnboardingDataResponse extends GenericApiResponse {
  pages: Array<OnboardingPage>;
}
