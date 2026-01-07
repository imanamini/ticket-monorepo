import { PaymentMethodStrategyInterface } from '../models/payment-method-strategy.interface';
import { CardConfigInterface } from '../../card/card-config.interface';
import { PAYMENT_CPG_CARD_CONFIG } from '../consts/payment-method-card-config';
import { inject } from '@angular/core';
import { PaymentMethodService } from '../services/payment-method.service';
import {TGS_PROTECTION_STATE} from "../../../../../api/emuns/tgs-protection-state.enum";
import {PageEnum} from "../../../enums/page.enum";
import {PageManagementService} from "../../../services/page-management.service";
import {NavigateToExternalUrl} from "../../../../../utils/navigation";
import {FeatureInformationService} from "../services/feature-information.service";

export class PaymentCpg implements PaymentMethodStrategyInterface {
  private paymentMethodService = inject(PaymentMethodService);
  private pageManagementService = inject(PageManagementService);
  private featureInformationService = inject(FeatureInformationService);

  public async next(): Promise<void> {
    try {
      switch (this.paymentMethodService.selectedFeature.protectionState) {
        case TGS_PROTECTION_STATE.NONE:
          this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(this.paymentMethodService.selectedFeature.name);
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
    return PAYMENT_CPG_CARD_CONFIG;
  }

}
