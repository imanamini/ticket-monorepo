import { PaymentMethodStrategyInterface } from '../../../data-access/models/payment-method-strategy.interface';
import { CardConfigInterface } from '../../../data-access/models/card-config.interface';
import { PAYMENT_IPG_CARD_CONFIG } from '../../../data-access/consts/payment-method-card-config';
import { inject } from '@angular/core';
import { PaymentMethodService } from '../../../data-access/services/payment-method.service';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { FeatureInformationService } from '../../../data-access/services/feature-information.service';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';

export class PaymentIpg implements PaymentMethodStrategyInterface {
  private paymentMethodService = inject(PaymentMethodService);
  private ngxHybridService = inject(NgxHybridServiceService);
  private featureInformationService = inject(FeatureInformationService);
  private actionHandlerService = inject(ActionHandlerService);

  public async next(): Promise<void> {
    try {
      this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(
        this.paymentMethodService.selectedFeature()?.name,
      );
      if (this.ngxHybridService.isHybrid()) {
        window.open(this.paymentMethodService.selectedFeatureInfo.payUrl, '_blank');
      } else {
        await this.actionHandlerService.handle({
          type: ActionType.REDIRECT,
          payload: { url: this.paymentMethodService.selectedFeatureInfo.payUrl, type: RedirectionTypeEnum.self },
        });
      }
    } catch (error) {
      console.error('Error during next step:', error);
    }
  }

  public config(): CardConfigInterface {
    return PAYMENT_IPG_CARD_CONFIG;
  }
}
