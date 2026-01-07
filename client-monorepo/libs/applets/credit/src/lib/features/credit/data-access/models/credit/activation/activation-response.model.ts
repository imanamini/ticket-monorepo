import { Step } from './step.model';
import { GenericApiResponse } from '../../generic-api-response.model';
import { ACTIVATION_STATUS } from './activation-status';

export interface ActivationResponse extends GenericApiResponse {
  activationCode: string;
  steps: Step[];
  isExpired: boolean;
  isSuspended: boolean;
  status: ACTIVATION_STATUS;
  creationDate: number;
  completedDate: number;
  // these keys are used for the info box placed
  // beneath of the activation steps
  description: string;
  image: string;
  title: string;
  fundProviderCode?: number;
  stepRequirements: {
    additionalLink: string;
    description: {
      prefix: string;
      linkLabel: string;
      postfix: string;
    };
    type: 'CHECK_BOX';
  }[];
  hasOfferedPlans?: boolean;
}
