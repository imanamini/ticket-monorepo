import { inject } from '@angular/core';
import { PaymentMethodStrategyInterface } from '../../../data-access/models/payment-method-strategy.interface';
import { CardConfigInterface } from '../../../data-access/models/card-config.interface';
import { PAYMENT_WALLET_CARD_CONFIG } from '../../../data-access/consts/payment-method-card-config';
import { PaymentMethodService } from '../../../data-access/services/payment-method.service';
import { PayByWalletService } from '../../../data-access/services/pay-by-wallet.service';
import { FeatureInformationService } from '../../../data-access/services/feature-information.service';
import { PageManagementService } from '../../../data-access/services/page-management.service';
import { TGS_PROTECTION_STATE } from '../../../data-access/models/tgs-protection-state.enum';
import { PageEnum } from '../../../data-access/models/page.enum';

export class PaymentWallet implements PaymentMethodStrategyInterface {
  private paymentMethodService = inject(PaymentMethodService);
  public payByWalletService = inject(PayByWalletService);
  private pageManagementService = inject(PageManagementService);
  private featureInformationService = inject(FeatureInformationService);

  public async next(): Promise<void> {
    try {
      switch (this.paymentMethodService.selectedFeature()?.protectionState) {
        case TGS_PROTECTION_STATE.NONE:
          this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(
            this.paymentMethodService.selectedFeature()?.name,
          );
          // If feature had IsPreferredGateway = true, Or was single feature ,
          // It means we have to call pay by wallet automatically and show receipt to user,
          // This is a scenario from business,
          // Because when digikala put out module instead of own module for paying, they want to user don't see different scenario
          // When ProtectionState = 0, We have to redirect user to  receipt
          await this.payByWalletService.completePaymentProcess(this.paymentMethodService.selectedFeatureInfo);
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
      throw error;
    }
  }

  public config(): CardConfigInterface {
    return PAYMENT_WALLET_CARD_CONFIG;
  }
}
