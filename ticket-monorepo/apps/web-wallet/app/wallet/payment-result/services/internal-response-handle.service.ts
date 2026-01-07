import { Inject, Injectable } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { ColorService } from '../../../user-interface/services/color.service';
import { RouteStateInterface } from '../../../core/services/route-state/route-state.interface';
import { Router } from '@angular/router';
import { PaymentResultStateService } from '../payment-result-state.service';

@Injectable({
  providedIn: 'root'
})
export class InternalResponseHandleService {

  constructor(
    @Inject('RouteStateInterface') private routeStateService: RouteStateInterface,
    private router: Router,
    private paymentResultStateService: PaymentResultStateService
  ) {
  }

  public setStates(): void {
    const state = this.routeStateService.getAll();
    this.routeStateService.get('result').then((result) => {
      this.paymentResultStateService.result = result;
      this.paymentResultStateService.ticketInfo = state.ticketInfo;
      this.paymentResultStateService.backgroundColor =
        ColorService.convertDecimalToRgb(this.paymentResultStateService.result.color);
      this.paymentResultStateService.hideUI = state.hideUI || false;
      this.convertActivityInfoToArray();
    }).catch(() => {
      this.router.navigateByUrl('/').then();
    });
  }

  private convertActivityInfoToArray(): void {
    if (!Array.isArray(this.paymentResultStateService.result.activityInfo)) {
      this.paymentResultStateService.result.activityInfo =
        WalletApiService.fixActivityInfoArray(this.paymentResultStateService.result.activityInfo);
    }
  }
}
