import { inject, Injectable, signal } from '@angular/core';
import { TgsSelectFeatureResponse } from '../models/tgs-select-feature-response';
import { UrlService } from './url.service';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { TicketInfoStatus } from '../models/ticket-info-status.enum';
import { TicketInfoFeature } from '../models/app-pay-features.response';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  selectedFeature = signal<TicketInfoFeature | undefined>(undefined);
  selectedFeatureInfo: TgsSelectFeatureResponse | undefined;
  urlService = inject(UrlService);

  public checkIfThereIsAHiddenFeature(features: TicketInfoFeature[]): boolean {
    for (let i = 0; i < features.length; i++) {
      if (!features[i].visible) {
        return true;
      }
    }
    return false;
  }

  public sortFeatures(array: Array<TicketInfoFeature>): Array<TicketInfoFeature> {
    return array.sort((first, second) => {
      // Primary sort by order (default sorting)
      const orderDiff = first.order - second.order;

      // If orders are the same, check for BPG payment methods
      if (orderDiff === 0) {
        const PAYMENT_BPG_1PAY = APP_ACTIONS.PAYMENT_BPG_1PAY.toString();
        const PAYMENT_BPG_4PAY = APP_ACTIONS.PAYMENT_BPG_4PAY.toString();

        // If both are BPG methods, prioritize 4pay over 1PAY
        if (
          (first.method === PAYMENT_BPG_1PAY || first.method === PAYMENT_BPG_4PAY) &&
          (second.method === PAYMENT_BPG_1PAY || second.method === PAYMENT_BPG_4PAY)
        ) {
          // Convert to number for proper comparison - higher method value 4pay should come first
          return Number(first.method) - Number(second.method);
        }
      }

      // Default sorting by order
      return orderDiff;
    });
  }

  public updateSelectedFeature(features: Array<TicketInfoFeature>, selectedMethod: any): void {
    if (!selectedMethod) {
      this.automaticFeatureSelection(features);
      return;
    }
    this.selectFeature(this.findSelectedFeature(features, selectedMethod));
  }

  public findSelectedFeature(features: Array<TicketInfoFeature>, selectedMethod: any): TicketInfoFeature | undefined {
    for (const selectedItem of features) {
      if (selectedItem.method == APP_ACTIONS[selectedMethod].toString()) {
        return selectedItem;
      }
    }
    return undefined;
  }

  public automaticFeatureSelection(features: Array<TicketInfoFeature>): void {
    const highestSelectionPriorityFeature: TicketInfoFeature | undefined = this.findHighLevelValidFeature(features);
    if (highestSelectionPriorityFeature) {
      this.selectFeature(highestSelectionPriorityFeature);
    }
  }

  public findHighLevelValidFeature(featureArray: Array<TicketInfoFeature>): TicketInfoFeature | undefined {
    let highLevelOrderFeature: TicketInfoFeature | undefined = undefined;
    let highestPriority = Number.MAX_SAFE_INTEGER; // Start with highest possible number

    for (let i = 0; i < featureArray.length; i++) {
      // Find items with lower order number (higher priority) that are active and visible
      if (featureArray[i].order < highestPriority && TicketInfoStatus[featureArray[i].status] === 'ACTIVE' && featureArray[i].visible) {
        highestPriority = featureArray[i].order;
        highLevelOrderFeature = featureArray[i];
      }
    }
    return highLevelOrderFeature;
  }

  public selectFeature(item?: TicketInfoFeature): void {
    if (!item) return;
    this.selectedFeature.set(item);
    this.urlService.addMethodQueryParam(item.method);
  }

  public resetCheckoutData() {
    this.selectedFeature.set(undefined);
    this.selectedFeatureInfo = undefined;
  }
}
