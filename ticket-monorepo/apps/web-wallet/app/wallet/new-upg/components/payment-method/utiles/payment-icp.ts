import {PaymentMethodStrategyInterface} from '../models/payment-method-strategy.interface';
import {CardConfigInterface} from '../../card/card-config.interface';
import {PAYMENT_CASH_IN_CARD_CONFIG} from '../consts/payment-method-card-config';
import {inject} from '@angular/core';
import {PageEnum} from '../../../enums/page.enum';
import {PaymentMethodService} from "../services/payment-method.service";
import {TGS_PROTECTION_STATE} from "../../../../../api/emuns/tgs-protection-state.enum";
import {PageManagementService} from "../../../services/page-management.service";
import {FeatureInformationService} from "../services/feature-information.service";

export class PaymentIcp implements PaymentMethodStrategyInterface {
  private pageManagementService = inject(PageManagementService);
  private paymentMethodService = inject(PaymentMethodService);
  private featureInformationService = inject(FeatureInformationService);

  public async next(): Promise<void> {
    try {
      this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(this.paymentMethodService.selectedFeature.name);
      const isValidCashInAmount: boolean = (this.paymentMethodService.selectedFeatureInfo.amount - this.paymentMethodService.selectedFeatureInfo.walletBalance) >= this.paymentMethodService.selectedFeatureInfo.cashInAmount;
      if (!isValidCashInAmount) {
        this.pageManagementService.implement(PageEnum.ICP_INVALID_AMOUNT);
        return;
      }

      switch (this.paymentMethodService.selectedFeature.protectionState) {
        case TGS_PROTECTION_STATE.NONE:
          this.pageManagementService.implement(PageEnum.ICP_VALID_AMOUNT);
          break;
        case TGS_PROTECTION_STATE.PIN:
          this.pageManagementService.implement(PageEnum.CPPIN);
          break;
        case TGS_PROTECTION_STATE.OTP:
          this.pageManagementService.implement(PageEnum.CPOTP);
          break;
      }
    } catch (error) {
      console.error('Error during next step:', error);
    }
  }

  public config(): CardConfigInterface {
    return PAYMENT_CASH_IN_CARD_CONFIG;
  }
}






























