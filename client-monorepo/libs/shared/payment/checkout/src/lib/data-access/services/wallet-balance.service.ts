import { inject, Injectable } from '@angular/core';
import { HandleErrorService } from './handle-error.service';
import { TicketInfoService } from './ticket-info.service';
import { PaymentCheckoutApiService } from './payment-checkout-api.service';
import { ApiResultInterface } from '@client-monorepo/common/network';
import { WalletBalanceResponse } from '@client-monorepo/payment/wallet';

@Injectable({
  providedIn: 'root',
})
export class WalletBalanceService {
  public state!: WalletBalanceResponse;
  private paymentCheckoutApiService = inject(PaymentCheckoutApiService);
  private handleErrorService = inject(HandleErrorService);
  private ticketInfoService = inject(TicketInfoService);

  public get(): Promise<WalletBalanceResponse> {
    return new Promise<WalletBalanceResponse>((resolve, reject) => {
      if (this.state) {
        resolve(this.state);
      } else {
        this.paymentCheckoutApiService.getUpgWalletBalance(this.ticketInfoService.ticket()).subscribe(
          (response: WalletBalanceResponse) => {
            this.state = response;
            resolve(response);
          },
          (errorResponse: ApiResultInterface) => {
            this.handleErrorService.check(errorResponse);
            reject(errorResponse);
          },
        );
      }
    });
  }
}
