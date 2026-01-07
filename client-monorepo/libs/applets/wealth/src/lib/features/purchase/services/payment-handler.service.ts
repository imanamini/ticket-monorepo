import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IPayment } from '../../../components/core/models/payment.interface';
import { MaknaAuthenticationService } from '../../makna-authentication/services/makna-authentication.service';
import {
  OTP_ROUTE,
  NATIONAL_ID_ROUTE,
  CREATE_PASSWORD_ROUTE,
  INVESTMENT_LIST_ROUTE,
  SIGN_AGREEMENTS_ROUTE,
  CHOICE_PAYMENT_METHOD_ROUTE,
  PURCHASE_ROUTE,
} from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { EVerifyCustomerState } from '../../../components/core/models/verify-customer-state.enum';
import { ICreateFundPayment } from '../../../components/core/models/create-fund-payment.interface';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { ICrowdFundingPurchaseData } from '../../crowds/data-access/models';

@Injectable({
  providedIn: 'root',
})
export class PaymentHandlerService {
  private static _PAYMENT: IPayment | ICrowdFundingPurchaseData;
  navigationService = inject(WealthNavigationService);

  private paymentConfirmed: Subject<{
    aggreement: boolean;
    paymentData: ICreateFundPayment;
  }> = new Subject<{
    aggreement: boolean;
    paymentData: ICreateFundPayment;
  }>();
  paymentConfirmed$ = this.paymentConfirmed.asObservable();

  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  private continuePayment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  continuePayment$ = this.continuePayment.asObservable();

  private maknaAuthenticationService = inject(MaknaAuthenticationService);

  public setPayment(payment: IPayment | ICrowdFundingPurchaseData) {
    PaymentHandlerService._PAYMENT = payment;
  }

  private get getPayment(): any {
    return PaymentHandlerService._PAYMENT;
  }

  public async paymentConfirm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.maknaAuthenticationService.isUserCompletelyRegistered().subscribe((registerRes) => {
        if (registerRes.success && registerRes.result) {
          if (this.getPayment) {
            const isCrowdFunding = this.getPayment?.assetData?.investmentType == 'CrowdFund';
            this.getPayment.amount = isCrowdFunding ? this.roundedAmount(this.getPayment.amount) : this.getPayment.amount;
          } else {
            this.navigationService.navigate([INVESTMENT_LIST_ROUTE]);
          }
        } else {
          this.navigationService.navigate([CREATE_PASSWORD_ROUTE], {
            state: {
              symbol: this.getPayment.symbol,
              amount: this.getPayment.amount,
              units: this.getPayment.units,
              type: this.getPayment.type,
              agreementChecked: this.getPayment.agreementChecked,
              assetData: this.getPayment.assetData,
            },
          });
        }
      });
      resolve(true);
    });
  }

  public checkUserRegistration(): Observable<TServiceResult<boolean>> {
    return this.maknaAuthenticationService.isUserCompletelyRegistered();
  }

  public handleState(state: EVerifyCustomerState, routerState: any): Promise<boolean> {
    return new Promise((resolve) => {
      switch (state) {
        case EVerifyCustomerState.RequiresNationalId:
          this.navigationService.navigate([NATIONAL_ID_ROUTE], {
            state: routerState,
          });
          break;
        case EVerifyCustomerState.RequiresOtp:
          this.navigationService.navigate([OTP_ROUTE], {
            state: routerState,
          });
          break;
        case EVerifyCustomerState.RequiresAgreement:
          this.navigationService.navigate([SIGN_AGREEMENTS_ROUTE], {
            state: routerState,
          });
          break;
        case EVerifyCustomerState.Verified:
          if (routerState.type === 'IPO') {
            this.navigationService.navigate([CHOICE_PAYMENT_METHOD_ROUTE, routerState.symbol], {
              state: routerState,
            });
          } else {
            this.setPayment(routerState);
            this.navigationService.navigate([PURCHASE_ROUTE, routerState.symbol], {
              state: routerState,
            });
            this.continuePayment.next(true);
          }
          break;
      }
      resolve(true);
    });
  }

  private roundedAmount(amount: number): number {
    return Math.floor(amount / 1000) * 1000;
  }
}
