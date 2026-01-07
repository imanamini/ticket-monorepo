import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { CreditRouteStateInterface } from '../../../core/services/route-state/credit-route-state.interface';
import { CreditPayService } from '../../../shared/services/credit-pay.service';

@Component({
  selector: 'app-bnpl-landing',
  templateUrl: './bnpl-landing.component.html',
  styleUrls: ['./bnpl-landing.component.scss']
})
export class BnplLandingComponent implements OnInit {

  state = signal(null);
  creditPayService = inject(CreditPayService);

  constructor(
    @Inject('RouteStateInterface') private routeStateService: CreditRouteStateInterface,
  ) {
    this.state.set(this.routeStateService.getAll());
    if (!this.state().cancelRedirect) {
      this.creditPayService.getTicketInfo().then(res => {
        this.state.set(res);
      });
      return;
    }
  }

  ngOnInit() {
  }

  cancelRedirect() {
    window.open(this.state().cancelRedirect.url, '_self');
  }

}
