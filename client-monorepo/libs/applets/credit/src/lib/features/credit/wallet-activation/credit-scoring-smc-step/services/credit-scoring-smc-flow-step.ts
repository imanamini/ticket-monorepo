import { CREDIT_SCORING_STEP_STATUS } from '../../../data-access/models/credit-scoring/basic/credit-scoring-step-status';

export interface CreditScoringSmcFlowStep {
  type: CREDIT_SCORING_STEP_STATUS;
  canBack: boolean;
  skipInPrev?: boolean;
}
