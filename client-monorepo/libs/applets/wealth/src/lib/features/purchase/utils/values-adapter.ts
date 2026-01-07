import { IFundDetail } from '../../../components/core/models/fund-schemas';
import { ICrowdFundingPurchaseData } from '../../crowds/data-access/models';
import { ValueLimiter } from '../models/value-limiter.interface';

export class fundProfileAdapter implements ValueLimiter {
  constructor(private fundProfile: IFundDetail) {}
  minValue() {
    return this.fundProfile.minBuyableAmount;
  }
  maxValue() {
    return this.fundProfile.maxBuyableAmount;
  }
}

export class crowdProfileAdapter implements ValueLimiter {
  constructor(private crowdProfile: ICrowdFundingPurchaseData) {}
  minValue() {
    return this.crowdProfile.minimumAllowedPrice;
  }
  maxValue() {
    return this.crowdProfile.maximumAllowedPrice;
  }
}
