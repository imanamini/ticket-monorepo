import {Component, Inject, inject, OnDestroy} from '@angular/core';
import { CardService } from './services/card.service';
import { CashOutProcessService } from './services/cash-out-process.service';
import {WalletApiService} from "../../api/wallet-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TICKET_TOKEN} from "./utiles/ticket-token";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'cash-out-page',
  templateUrl: './cash-out-page.component.html',
  styleUrls: ['./cash-out-page.component.scss']
})
export class CashOutPageComponent implements OnDestroy {
  private cardService = inject(CardService);
  private cashOutProcessService = inject(CashOutProcessService);
  private activateRoute = inject(ActivatedRoute);

  constructor(@Inject(TICKET_TOKEN) private ticket: BehaviorSubject<string>) {
    this.ticket.next(this.activateRoute.snapshot.params['ticket']);
    sessionStorage.setItem('ticket' , this.ticket.value)
  }

  ngOnDestroy(): void {
    sessionStorage.clear();
    this.cardService.reset();
    this.cashOutProcessService.reset();
  }
}
