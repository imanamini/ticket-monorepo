import { Injectable } from '@angular/core';
import { PricingListModel } from '../../../../../api/models/pricing/pricing.model';
@Injectable({
  providedIn: 'root'
})
export class UsedPricingService {

  handlePricingList(pricing: PricingListModel[]): PricingListModel[] {
    return pricing.map((item) => {
      return {...item, title: this.generateCardTitle(item)};
    });
  }

  generateCardTitle(pricing: PricingListModel): string {
    const maxValue = pricing.maxValue ? pricing.maxValue / (10 * 1000000) : null;
    const minValue = pricing.minValue ? pricing.minValue / (10 * 1000000) : null;
    if (pricing.isFirstRange) {
      return 'کمتر از ' + maxValue + ' میلیون تومان';
    } else if (pricing.isLastRange) {
      return 'بیشتر از ' + minValue + ' میلیون تومان';
    } else {
      return 'از ' + minValue + ' تا ' + maxValue + ' میلیون تومان';
    }
  }
}
