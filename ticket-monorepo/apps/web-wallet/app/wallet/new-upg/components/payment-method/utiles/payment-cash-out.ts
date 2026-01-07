import {PaymentMethodStrategyInterface} from '../models/payment-method-strategy.interface';
import {CardConfigInterface} from '../../card/card-config.interface';
import {PAYMENT_CASH_IN_CARD_CONFIG, PAYMENT_METHOD_DEFAULT_CARD_CONFIG} from '../consts/payment-method-card-config';
import {inject} from '@angular/core';
import {PageEnum} from '../../../enums/page.enum';
import {PageManagementService} from "../../../services/page-management.service";
import {Router} from "@angular/router";
import {TicketInfoService} from "../../../services/ticket-info.service";

export class PaymentCashOut implements PaymentMethodStrategyInterface {
  private router = inject(Router);
  private ticketInfoService = inject(TicketInfoService);

  public next(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.router.navigate(['/cash-out', this.ticketInfoService.ticket]);
      resolve();
    })
  }

  public config(): CardConfigInterface {
    return null;
  }
}
