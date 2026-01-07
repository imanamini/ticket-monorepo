export type CreditTrackerEvent =
  | 'CREDIT_SCORING_SUCCESS'
  | 'CREDIT_SCORING_FAILED'
  | 'credit_smart_scoring_pre_signup'
  | 'credit_smart_scoring_init'
  | 'credit_smart_scoring_select_plan';

export const PageNameMapper: {
  [key in CreditTrackerEvent]: string;
} = {
  CREDIT_SCORING_FAILED: 'credit-scoring-result',
  CREDIT_SCORING_SUCCESS: 'credit-scoring-result',
  credit_smart_scoring_pre_signup: 'credit-scoring-pre-signup',
  credit_smart_scoring_init: 'credit-scoring-onboarding',
  credit_smart_scoring_select_plan: 'credit-select-plan',
};
