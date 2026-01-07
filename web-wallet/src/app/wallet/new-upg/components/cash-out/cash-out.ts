import { UpgStrategy } from '../../models/upg-strategy.interface';
import { inject } from '@angular/core';
import {Router} from "@angular/router";
import {TicketInfoService} from "../../services/ticket-info.service";

export class CashOut implements UpgStrategy {
  private router = inject(Router);
  private ticketInfoService = inject(TicketInfoService);

  public implement(): void {
    this.router.navigate(['/cash-out' , this.ticketInfoService.ticket])
  }
}
