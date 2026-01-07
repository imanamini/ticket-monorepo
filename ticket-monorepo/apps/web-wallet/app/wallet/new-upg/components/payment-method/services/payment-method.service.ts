import { inject, Injectable } from '@angular/core';
import { TicketInfoFeature } from '../../../../../api/models/tgs-ticket-info.response';
import { TicketInfoStatus } from '../../../../../api/emuns/ticket-info-status.enum';
import { UrlService } from '../../../services/url.service';
import { UpgFeatureName } from '../../../../../api/emuns/upg-feature-name.emun';
import { TgsSelectFeatureResponse } from '../../../../../api/models/tgs-select-feature-response';

@Injectable()
export class PaymentMethodService {
  selectedFeature: TicketInfoFeature;
  selectedFeatureInfo: TgsSelectFeatureResponse;
  urlService = inject(UrlService);

  public checkIfThereIsAHiddenFeature(features: TicketInfoFeature[]): boolean {
    for (let i = 0; i < features.length; i++) {
      if (features[i].visible === false) {
        return true;
      }
    }
    return false;
  }

  public sortFeatures(array: Array<TicketInfoFeature>): Array<TicketInfoFeature> {
    return array.sort((first, second) => {
      return first.order - second.order;
    });
  }

  public updateSelectedFeature(features: Array<TicketInfoFeature>, selectedMethod: string): void {
    if (!selectedMethod) {
      this.automaticFeatureSelection(features);
      return;
    }
    this.selectFeature(this.findSelectedFeature(features, selectedMethod));
  }

  public findSelectedFeature(features: Array<TicketInfoFeature>, selectedMethod: string): TicketInfoFeature {
    for (const selectedItem of features) {
      if (selectedItem.name == UpgFeatureName[selectedMethod].toString()) {
        return selectedItem;
      }
    }
    return null;
  }

  public automaticFeatureSelection(features: Array<TicketInfoFeature>): void {
    const highestSelectionPriorityFeature: TicketInfoFeature = this.findHighLevelValidFeature(features);
    if (highestSelectionPriorityFeature) {
      this.selectFeature(highestSelectionPriorityFeature);
    }
  }

  public findHighLevelValidFeature(featureArray: Array<TicketInfoFeature>): TicketInfoFeature {
    let highLevelOrderFeature: TicketInfoFeature = null;
    let order: number = null;
    for (let i = 0; i < featureArray.length; i++) {
      if (i === 0) {
        order = featureArray[i].order;
      }
      if (featureArray[i].order <= order
        && TicketInfoStatus[featureArray[i].status] === 'ACTIVE'
        && featureArray[i].visible) {
        highLevelOrderFeature = featureArray[i];
      }
    }
    return highLevelOrderFeature;
  }

  public selectFeature(item: TicketInfoFeature): void {
    this.selectedFeature = item;
    this.urlService.addMethodQueryParam(item.name);
  }
}
