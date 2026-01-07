import { UsedPremiumCalculationProductModel } from './used-premium-calculation-products.model';

export interface UsedPremiumCalculationModel {
  products: UsedPremiumCalculationProductModel[];
  brand?: string;
  includeTax?: boolean;
  model?: string;
  premiumId?: string;
  taxAmount?: number;
  taxPerson?: number;
  totalPremiumAmount?: number;
  wagePercent?: number;
  wageAmount?: number;
  campaignDiscount?: number;
  campaignWageAmount?: number;
}
