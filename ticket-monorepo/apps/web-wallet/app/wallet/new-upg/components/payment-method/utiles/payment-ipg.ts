import {PaymentMethodStrategyInterface} from '../models/payment-method-strategy.interface';
import {CardConfigInterface} from '../../card/card-config.interface';
import {PAYMENT_IPG_CARD_CONFIG} from '../consts/payment-method-card-config';
import {inject} from '@angular/core';
import {PaymentMethodService} from '../services/payment-method.service';
import {NavigateToExternalUrl} from '../../../../../utils/navigation';
import {NgxHybridServiceService} from "@digipay/ngx-hybrid-service";
import {FeatureInformationService} from "../services/feature-information.service";

export class PaymentIpg implements PaymentMethodStrategyInterface {
  private paymentMethodService = inject(PaymentMethodService);
  private ngxHybridService = inject(NgxHybridServiceService);
  private featureInformationService = inject(FeatureInformationService);

  public async next(): Promise<void> {
    try {
      this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(this.paymentMethodService.selectedFeature.name);
      if (this.ngxHybridService.isHybrid()) {
        window.open(this.paymentMethodService.selectedFeatureInfo.payUrl, '_blank');
      } else {
        NavigateToExternalUrl(this.paymentMethodService.selectedFeatureInfo.payUrl);
      }
    } catch (error) {
      console.error('Error during next step:', error);
    }
  }

  public config(): CardConfigInterface {
    return PAYMENT_IPG_CARD_CONFIG;
  }
}
