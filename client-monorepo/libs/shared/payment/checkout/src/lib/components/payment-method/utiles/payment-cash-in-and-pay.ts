import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentMethodStrategyInterface } from '../../../data-access/models/payment-method-strategy.interface';
import { CardConfigInterface } from '../../../data-access/models/card-config.interface';
import { PAYMENT_CASH_IN_CARD_CONFIG } from '../../../data-access/consts/payment-method-card-config';
import { PaymentMethodService } from '../../../data-access/services/payment-method.service';
import { FeatureInformationService } from '../../../data-access/services/feature-information.service';
import { PageManagementService } from '../../../data-access/services/page-management.service';
import { TicketInfoService } from '@client-monorepo/payment/checkout';
import { PageEnum } from '../../../data-access/models/page.enum';

export class PaymentCashInAndPay implements PaymentMethodStrategyInterface {
  private pageManagementService = inject(PageManagementService);
  private ticketInfoService = inject(TicketInfoService);
  private paymentMethodService = inject(PaymentMethodService);
  private router = inject(Router);
  private featureInformationService = inject(FeatureInformationService);

  public async next(): Promise<void> {
    try {
      if (!this.ticketInfoService.state?.amount) {
        // todo check if reason and functionality; delete it if it's not essential
        this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(
          this.paymentMethodService.selectedFeature()?.name,
        );
        sessionStorage.setItem('external-cash-in-data', JSON.stringify(this.paymentMethodService.selectedFeatureInfo));
        this.router.navigate(['/wallet-cash-in', this.ticketInfoService.ticket]);
        return;
      }
      this.pageManagementService.implement(PageEnum.CASH_IN_AND_PAY);
    } catch (error) {
      console.error('Error during next step:', error);
    }
  }

  public config(): CardConfigInterface {
    return PAYMENT_CASH_IN_CARD_CONFIG;
  }
}
