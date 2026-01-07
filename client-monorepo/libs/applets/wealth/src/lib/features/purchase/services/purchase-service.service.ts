import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { AppFundData } from '../../../data-access/models/app-fund-data.model';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import {
  CALLBACK_CASHIN_PAYMENT_API,
  CALLBACK_CROWD_PAYMENT_API,
  CALLBACK_PAYMENT_API,
  CREATE_BUY_ORDER_API,
  CREATE_PAYMENT_API,
  CREATE_SELL_ORDER_API,
  CUSTOMER_INFO_API,
  GET_SEJAMI_PROFILE,
  ONLINE_NAV_API,
  PURCHASE_API,
  REGISTER_CUSTOMER_API,
  REGISTER_CUSTOMER_OTP_API,
  SELL_API,
  SELL_OTP_API,
  SELLABLE_UNITS_API,
} from '../../../data-access/constants/api';
import { ICreatePaymentResult } from '../models/create-payment-result.interface';
import { ISellOrder } from '../../../components/core/models/sell-order.interface';
import { ISellOrderData } from '../../../components/core/models/sell-order-data.interface';
import { ICheckoutRequest } from '../../../components/core/models/fund-schemas/fund-checkout-request.interface';
import { IVerifyCustomer } from '../../../components/core/models/verify-customer.interface';
import { EVerifyCustomerState } from '../../../components/core/models/verify-customer-state.enum';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private assetsSubject: BehaviorSubject<TServiceResult<AppFundData[]>> = new BehaviorSubject<TServiceResult<AppFundData[]>>(null);
  public assets$ = this.assetsSubject.asObservable();
  private baseApiService = inject(BaseApiService);

  getAssets(): any {
    return this.assetsSubject.value;
  }

  onBuyFund(amount: number) {
    return this.baseApiService.post(PURCHASE_API, { amount: amount });
  }

  getInfo() {
    return this.baseApiService.get(CUSTOMER_INFO_API);
  }

  sendSellOtp(count: number, fund: string) {
    return this.baseApiService.post(`${SELL_API}?fundName=${fund}`, {
      unitCount: count.toString(),
    });
  }

  onSellFund(count: number, fund: string, otp: string) {
    return this.baseApiService.post(`${SELL_API}?fundName=${fund}`, {
      unitCount: count.toString(),
      actionOtp: otp,
    });
  }

  getOtp(symbol: string) {
    return this.baseApiService.post(`${REGISTER_CUSTOMER_OTP_API}`, { symbol });
  }

  getSellOtp(symbol: string) {
    return this.baseApiService.post(`${SELL_OTP_API}`, { symbol });
  }

  /**
   *
   * @param otp
   * @param isCrowdFunding
   * @param symbol (optional)
   */
  registerCustomer(otp: string, isCrowdFunding: boolean, symbol?: string): Observable<TServiceResult<IVerifyCustomer>> {
    const data = { symbol, otp, registerAfterAgreement: true };
    return this.baseApiService.post(REGISTER_CUSTOMER_API, data).pipe(
      catchError((e) => {
        return of(e);
      }),
    );
  }

  buyOrder({ symbol, amount, instrumentUnit }: { symbol: string; amount: number; instrumentUnit: number }) {
    return this.baseApiService.post(CREATE_BUY_ORDER_API, {
      symbol,
      amount,
      instrumentUnit,
    });
  }

  createPayment(data: ICheckoutRequest): Observable<TServiceResult<ICreatePaymentResult>> {
    return this.baseApiService
      .post(CREATE_PAYMENT_API, {
        orderId: data.orderId,
        clientMetadata: data.clientMetadata,
        ipoPaymentMethod: data.ipoPaymentMethod,
      })
      .pipe(
        catchError((e) => {
          return of(e);
        }),
      );
  }

  sellOrder(data: ISellOrderData): Observable<TServiceResult<ISellOrder>> {
    return this.baseApiService
      .post(CREATE_SELL_ORDER_API, {
        symbol: data.symbol,
        instrumentUnit: data.instrumentUnit,
        otp: data.otp,
      })
      .pipe(
        catchError((err) => {
          return of(err);
        }),
      );
  }

  callbackPayment(callbackQueryString: string) {
    return this.baseApiService.post(CALLBACK_PAYMENT_API, {
      callbackQueryString,
    });
  }

  callbackCrowdPayment(callbackQueryString: string) {
    return this.baseApiService.post(CALLBACK_CROWD_PAYMENT_API, {
      callbackQueryString,
    });
  }
  callbackCashinPayment(callbackQueryString: string) {
    return this.baseApiService.post(CALLBACK_CASHIN_PAYMENT_API, {
      callbackQueryString,
    });
  }

  getSellableUnits(instrument: string): Observable<TServiceResult<number>> {
    return this.baseApiService.get(SELLABLE_UNITS_API + `?symbol=${instrument}`);
  }

  onlineNav(symbol: string) {
    return this.baseApiService.get(ONLINE_NAV_API + `?symbol=${symbol}`);
  }

  getSejamiProfile(symbol: string) {
    return this.baseApiService.get(GET_SEJAMI_PROFILE + `?symbol=${symbol}`);
  }
}
