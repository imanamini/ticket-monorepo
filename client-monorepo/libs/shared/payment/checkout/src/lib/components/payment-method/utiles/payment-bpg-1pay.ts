import { inject } from '@angular/core';
import { PaymentMethodStrategyInterface } from '../../../data-access/models/payment-method-strategy.interface';
import { CardConfigInterface } from '../../../data-access/models/card-config.interface';
import { PAYMENT_BPG_CARD_CONFIG } from '../../../data-access/consts/payment-method-card-config';
import { PaymentMethodService } from '../../../data-access/services/payment-method.service';
import { FeatureInformationService } from '../../../data-access/services/feature-information.service';
import { PageManagementService } from '../../../data-access/services/page-management.service';
import { TGS_PROTECTION_STATE } from '../../../data-access/models/tgs-protection-state.enum';
import { PageEnum } from '../../../data-access/models/page.enum';
import { StorageService } from '@client-monorepo/common/utilities';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';

export class PaymentBpg1Pay implements PaymentMethodStrategyInterface {
  private paymentMethodService = inject(PaymentMethodService);
  private pageManagementService = inject(PageManagementService);
  private featureInformationService = inject(FeatureInformationService);
  private storageService = inject(StorageService);
  private hybridService = inject(NgxHybridServiceService);
  public async next(): Promise<void> {
    try {
      switch (this.paymentMethodService.selectedFeature()?.protectionState) {
        case TGS_PROTECTION_STATE.NONE:
          this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(
            this.paymentMethodService.selectedFeature()?.name,
          );
          // set redirectionTimestamp not to get pin
          // in callback of bpg, hybrid opens new webview which triggers pin functionality in app.component
          if (this.hybridService.isHybrid()) {
            this.storageService.setRedirectionTimestamp(Date.now());
          }
          document.location.replace(this.paymentMethodService.selectedFeatureInfo.payUrl);
          break;
        case TGS_PROTECTION_STATE.PIN:
          this.pageManagementService.implement(PageEnum.PIN);
          break;
        case TGS_PROTECTION_STATE.OTP:
          this.pageManagementService.implement(PageEnum.OTP);
          break;
      }
    } catch (error) {
      console.error('Error during next step:', error);
    }
  }

  public config(): CardConfigInterface {
    return PAYMENT_BPG_CARD_CONFIG;
  }
}
