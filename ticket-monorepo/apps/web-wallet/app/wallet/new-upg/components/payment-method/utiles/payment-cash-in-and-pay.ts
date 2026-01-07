import {PaymentMethodStrategyInterface} from '../models/payment-method-strategy.interface';
import {CardConfigInterface} from '../../card/card-config.interface';
import {PAYMENT_CASH_IN_CARD_CONFIG} from '../consts/payment-method-card-config';
import {inject} from '@angular/core';
import {PageEnum} from '../../../enums/page.enum';
import {PageManagementService} from "../../../services/page-management.service";
import {TicketInfoService} from "../../../services/ticket-info.service";
import {Router} from "@angular/router";
import {PaymentMethodService} from "../services/payment-method.service";
import {NavigateToExternalUrl} from "../../../../../utils/navigation";
import {FeatureInformationService} from "../services/feature-information.service";

export class PaymentCashInAndPay implements PaymentMethodStrategyInterface {
  private pageManagementService = inject(PageManagementService);
  private ticketInfoService = inject(TicketInfoService);
  private paymentMethodService = inject(PaymentMethodService);
  private router = inject(Router);
  private featureInformationService = inject(FeatureInformationService);

  public async next(): Promise<void> {
    try {
      if (!this.ticketInfoService.state?.amount) {
        this.paymentMethodService.selectedFeatureInfo = await this.featureInformationService.get(this.paymentMethodService.selectedFeature.name);
        sessionStorage.setItem('external-cash-in-data', JSON.stringify(this.paymentMethodService.selectedFeatureInfo))
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
