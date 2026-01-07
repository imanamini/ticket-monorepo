import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import {
  CANCEL_IPO_ORDER_API,
  GET_IPO_AGREEMENTS_API,
  GET_IPO_LANDING_BANNER_API,
  GET_IPO_PROFILE_API,
  REMOVE_IPO_ORDER_API,
} from '../../../data-access/constants/api';
import { catchError, map } from 'rxjs/operators';
import { IIPOProfile } from '../models/ipo-profile.interface';
import { IIPOLandingBanner } from '../models/ipo-landing-banner.interface';
import { EIpoPaymentMethodAgreement } from '../../choice-payment-way/models/ipo-payment-method-agreement';

@Injectable({
  providedIn: 'root',
})
export class IPOService {
  private static bannerData: TServiceResult<IIPOLandingBanner>;
  bannerData$ = IPOService.bannerData;

  constructor(private baseApiService: BaseApiService) {}

  getProfile(symbol: string): Observable<TServiceResult<IIPOProfile>> {
    return this.baseApiService.get(GET_IPO_PROFILE_API + symbol).pipe(
      catchError((e) => {
        return of(e);
      }),
    );
  }

  getAgreements(
    symbol: string,
    agreementType: EIpoPaymentMethodAgreement
  ): Observable<TServiceResult<{ agreements: string[] }>> {
    return this.baseApiService
      .get(GET_IPO_PROFILE_API + symbol + GET_IPO_AGREEMENTS_API + `?paymentMethod=${agreementType}`)
      .pipe(
        catchError((e) => {
          return of(e);
        }),
      );
  }

  removeOrder(
    symbol: string,
  ): Observable<TServiceResult<{ agreements: string[] }>> {
    return this.baseApiService
      .put(REMOVE_IPO_ORDER_API + symbol + CANCEL_IPO_ORDER_API)
      .pipe(
        catchError((e) => {
          return of(e);
        }),
      );
  }

  getLandingBanner(): Observable<TServiceResult<IIPOLandingBanner>> {
    if (this.bannerData$?.result) {
      return of(
        new TServiceResult<IIPOLandingBanner>(
          this.bannerData$.result,
          '',
          null,
          true,
        ),
      );
    }

    return this.baseApiService.get(GET_IPO_LANDING_BANNER_API).pipe(
      map((banner) => {
        this.bannerData$ = banner;
        return banner;
      }),
      catchError(e => {
        return of(e)
      })
    );
  }
}
