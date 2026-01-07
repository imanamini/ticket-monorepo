import { PaymentMethodStrategyInterface } from '../../../data-access/models/payment-method-strategy.interface';
import { CardConfigInterface } from '../../../data-access/models/card-config.interface';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TicketInfoService } from '@client-monorepo/payment/checkout';

export class PaymentCashOut implements PaymentMethodStrategyInterface {
  private router = inject(Router);
  private ticketInfoService = inject(TicketInfoService);

  public next(): Promise<void> {
    return new Promise((resolve) => {
      this.router.navigate(['/cash-out', this.ticketInfoService.ticket]);
      resolve();
    });
  }

  public config(): CardConfigInterface | null {
    return null;
  }
}
