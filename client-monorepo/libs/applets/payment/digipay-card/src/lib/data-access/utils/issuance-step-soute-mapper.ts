import { DigiCardIssuanceStep } from '../models/digi-card-issuance.enum';

export const stepToRoute: Record<DigiCardIssuanceStep, string | null> = {
  [DigiCardIssuanceStep.KYC]: '/card/issuance/validation',
  [DigiCardIssuanceStep.PLAN_APPROVED]: '/card/issuance/subscription-active',
  [DigiCardIssuanceStep.BIOMETRICS]: '/card/issuance/personal-info',
  [DigiCardIssuanceStep.ADDRESS]: '/card/issuance/personal-info-review',
  [DigiCardIssuanceStep.CUSTOMER_CREATION]: '/transactions',
  [DigiCardIssuanceStep.CARD_ISSUE]: '/transactions',
};
