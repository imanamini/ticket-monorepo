export enum CREDIT_CALCULATION_STEP_TYPE {
  BASE,
  COLLATERAL,
  JOURNEY_TYPE,
}

export interface CreditCalculationStep {
  type: CREDIT_CALCULATION_STEP_TYPE;
}
