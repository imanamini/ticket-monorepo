import { GenericApiResponse } from '../../generic-api-response.model';
import { Step } from './step.model';
import { ListOption } from '../profile/credit-profile-response.model';

export interface GetActivationStepDetailResponse extends GenericApiResponse {
  description: string;
  message: string;
  stepFlow: StepFlow[];
}

export interface StepFlow {
  title: string;
  type: number;
  imageId: string;
  description?: string;
  step?: Step;
  listOption?: ListOption;
}
