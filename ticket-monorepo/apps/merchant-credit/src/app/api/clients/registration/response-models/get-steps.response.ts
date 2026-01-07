import { Step } from '../basic-models/step';
import { BaseApiResponse } from '../../../models/base-api.response';
import { RegistrationState } from '../../../models/registration/states';

export interface GetStepsResponse extends BaseApiResponse {
  currentStep: RegistrationState,
  steps: Step[];
  header: StepsHeader;
}

export interface StepsHeader {
  bottomLeftLabel: string;
  bottomLeftValue: string;
  bottomRightLabel: string;
  bottomRightValue: string;
  color: number;
  title: string;
  topLeftLabel: string;
}
