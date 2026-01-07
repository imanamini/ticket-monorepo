import {RecappedMerchant} from "../../../clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";

export interface BNPLOnboardingMerchantsResponse {
  info: { message: string };
  merchants: RecappedMerchant[];
}
