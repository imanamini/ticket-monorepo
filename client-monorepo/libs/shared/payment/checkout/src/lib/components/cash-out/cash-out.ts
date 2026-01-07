import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UpgStrategy } from '../../data-access/models/upg-strategy.interface';
import { TicketInfoService } from '@client-monorepo/payment/checkout';

export class CashOut implements UpgStrategy {
  private router = inject(Router);
  private ticketInfoService = inject(TicketInfoService);

  public implement(): void {
    this.router.navigate(['/cash-out', this.ticketInfoService.ticket]);
  }
}
