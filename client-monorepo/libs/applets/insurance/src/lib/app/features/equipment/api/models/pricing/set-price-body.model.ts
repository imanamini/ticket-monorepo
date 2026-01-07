import { UsedPricingTypeModel } from '../../../routes/used/steps/used-pricing/models/used-pricing-type-model';

export interface SetPriceBodyModel {
  key: string;
  pricingId?: string;
  displayPrice?: string;
  price?: number;
  pricingType?: UsedPricingTypeModel;
}
