import { inject } from '@angular/core';
import { PaymentMethodStrategyInterface } from '../../../data-access/models/payment-method-strategy.interface';
import { CardConfigInterface } from '../../../data-access/models/card-config.interface';
import { PAYMENT_CASH_IN_CARD_CONFIG } from '../../../data-access/consts/payment-method-card-config';
import { PaymentMethodService } from '../../../data-access/services/payment-method.service';
import { FeatureInformationService } from '../../../data-access/services/feature-information.service';
import { PageManagementService } from '../../../data-access/services/page-management.service';
import { PageEnum } from '../../../data-access/models/page.enum';
import { TGS_PROTECTION_STATE } from '../../../data-access/models/tgs-protection-state.enum';

export class PaymentIcp implements PaymentMethodStrategyInterface {
  private pageManagementService = inject(PageManagementService);
  private paymentMethodService = inject(PaymentMethodService);
  private featureInformationService = inject(FeatureInformationService);

  public async next(): Promise<void> {
    try {
      this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(
        this.paymentMethodService.selectedFeature()?.name,
      );
      const isValidCashInAmount: boolean =
        (this.paymentMethodService.selectedFeatureInfo?.amount ?? 0) -
          (this.paymentMethodService.selectedFeatureInfo?.walletBalance ?? 0) >=
        (this.paymentMethodService.selectedFeatureInfo?.cashInAmount ?? 0);
      if (!isValidCashInAmount) {
        this.pageManagementService.implement(PageEnum.ICP_INVALID_AMOUNT);
        return;
      }

      switch (this.paymentMethodService.selectedFeature()?.protectionState) {
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
