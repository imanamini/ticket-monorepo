import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { TicketInfoService } from './ticket-info.service';
import { PaymentCheckoutApiService } from './payment-checkout-api.service';
import { ApiResultInterface } from '@client-monorepo/common/network';

@Injectable({
  providedIn: 'root',
})
export class UserInformationService {
  public user: any;
  private PaymentCheckoutApiService = inject(PaymentCheckoutApiService);
  private handleErrorService = inject(HandleErrorService);
  private ticketInfoService = inject(TicketInfoService);

  public get(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.user) {
        resolve(this.user);
      } else {
        this.PaymentCheckoutApiService.tac(this.ticketInfoService.ticket())
          .pipe(map((item: any) => item.userDetail))
          .subscribe(
            (response: any) => {
              this.user = response;
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
