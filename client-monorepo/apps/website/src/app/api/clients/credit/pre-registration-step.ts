export enum PRE_REGISTRATION_STEP_TYPE {
  CHEQUE,
  ADDITIONAL_INFO,
  PLAN_INFO,
  CONDITIONS,
}

export interface PreRegistrationStep {
  type: PRE_REGISTRATION_STEP_TYPE;
}
