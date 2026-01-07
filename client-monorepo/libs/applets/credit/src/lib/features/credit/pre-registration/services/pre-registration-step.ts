export enum PRE_REGISTRATION_STEP_TYPE {
  BASE,
  CONDITIONS,
  COLLATERAL,
  PRE_SUBSCRIPTION,
  SUBSCRIPTION,
  JOURNEY_TYPE,
  CONFIRM_PLAN,
}

export interface PreRegistrationStep {
  type: PRE_REGISTRATION_STEP_TYPE;
  skipInPrev: boolean;
  skipInNext: boolean;
}
