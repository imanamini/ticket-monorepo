import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { Payment } from '../models/payment.interface';
import { PaymentProcess } from '../helpers/payment-process';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { RESULT_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { FundsService } from '../../../../components/core/services/v1/funds.service';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';
import { IOrderRequest } from '../../../../components/core/models/fund-schemas/fund-order-request.interface';
import { IOrderResponse } from '../../../../components/core/models/fund-schemas/fund-order-response.interface';
import { ICheckoutRequest } from '../../../../components/core/models/fund-schemas/fund-checkout-request.interface';

@Injectable({
  providedIn: 'root',
})
export class FundsPaymentService implements Payment {
  private _fundsService = inject(FundsService);
  private paymentProcess = inject(PaymentProcess);
  private navigationService = inject(WealthNavigationService);

  order(order: IOrderRequest): Observable<TServiceResult<IOrderResponse>> {
    return this._fundsService.createBuyOrder(order);
  }

  checkout(data: ICheckoutRequest) {
    const subscibe$ = this._fundsService.checkout(data).subscribe((res) => {
      if (res.success) {
        this.paymentProcess._processCheckout(res.result, data);
      } else {
        this._handleFailed(res, data.symbol);
      }
      subscibe$.unsubscribe();
    });
  }

  private _handleFailed(res: any, symbol: string) {
    if (res?.error?.code === ErrorCodes.orderStatusIsNotDraft) {
      this.navigationService.navigate([RESULT_ROUTE], {
        queryParams: {
          instrumentSymbol: symbol,
        },
      });
    }
  }
}
