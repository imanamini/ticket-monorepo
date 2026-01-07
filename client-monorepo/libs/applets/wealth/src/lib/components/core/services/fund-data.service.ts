import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { IUserFundAssets } from '../models/user-fund-assets.interface';
import { EVerifyCustomerState } from '../models/verify-customer-state.enum';
import { IVerifyCustomer } from '../models/verify-customer.interface';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { IFundProfileModel } from '../../../features/funds/models/fund-profile.model';
import {
  AGREEMENT_CUSTOMER,
  AGREEMENT_FILE,
  CASHIN_API,
  CUSTOMER_PORTFOLIO_API,
  FUND_GET_CHART_API,
  FUND_GET_PROFILE_API,
  FUND_SEJAMI_PROFILE_API,
  GET_ARMAN_FUNDS_OFFLINE_API,
  GET_ARMAN_FUNDS_ONLINE_API,
  STOCK_CHART_API,
  STOCK_LIST_API,
  STOCK_PROFILE_API,
  UPDATE_SEJAM_API,
  VERIFY_CUSTOMER_STATE,
  VERIFY_CUSTOMER_UPDATE_SEJAM_API,
  WALLET_BALANCE,
  WALLET_CASHOUT,
} from '../../../data-access/constants/api';
import { IFundChartResult, IStockFundChartResult } from '../../../features/funds/models/fund-chart.model';
import { IFundsejami } from '../../../features/user-profile/models/fund-sejami.interface';
import { ICustomerPortfolio } from '../models/customer-portfolio.interface';

@Injectable({
  providedIn: 'root',
})
export class FundDataService {
  private userPortfolioSubject: BehaviorSubject<TServiceResult<IUserFundAssets>> = new BehaviorSubject<TServiceResult<IUserFundAssets>>(
    null,
  );
  public userPortfolio$ = this.userPortfolioSubject.asObservable();

  private static userAssets: IUserFundAssets;

  private allFundsSubject: BehaviorSubject<TServiceResult<IFundProfileModel[]>> = new BehaviorSubject<TServiceResult<IFundProfileModel[]>>(
    null,
  );
  public allFunds$ = this.allFundsSubject.asObservable();

  private previousFundsSubject: BehaviorSubject<TServiceResult<IFundProfileModel>> = new BehaviorSubject<TServiceResult<IFundProfileModel>>(
    null,
  );
  public _previousFunds$ = this.previousFundsSubject.asObservable();
  private baseApiService = inject(BaseApiService);

  getUserAssets(callApi = false): Observable<IUserFundAssets> {
    if (callApi) {
      // ! get new data
      return this.getUserAssetData();
    }

    if (FundDataService.userAssets) {
      return of(FundDataService.userAssets);
    } else {
      return this.getUserAssetData();
    }
  }

  private getUserAssetData(): Observable<IUserFundAssets> {
    const params = new HttpParams();
    return this.baseApiService.get(GET_ARMAN_FUNDS_OFFLINE_API, params).pipe(
      switchMap((offlineData: TServiceResult<IUserFundAssets>) => {
        FundDataService.userAssets = offlineData.result;
        return this.baseApiService.get(GET_ARMAN_FUNDS_ONLINE_API, params);
      }),
      switchMap((onlineData: TServiceResult<IUserFundAssets>) => {
        FundDataService.userAssets = onlineData.result;
        return of(FundDataService.userAssets);
      }),
      catchError((error) => {
        return of(FundDataService.userAssets);
      }),
    );
  }

  getCustomerPortfolio(force = false): Observable<TServiceResult<ICustomerPortfolio>> {
    let query = '';
    if (force) {
      query = `?action=force`;
    }
    return this.baseApiService.get(`${CUSTOMER_PORTFOLIO_API}${query}`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  getChart(symbol: string): Observable<TServiceResult<IFundChartResult>> {
    return this.baseApiService.get(FUND_GET_CHART_API + `?symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(new TServiceResult<IFundChartResult>(null, err?.error?.title, err?.error, false));
      }),
    );
  }

  getStockChart(symbol: string): Observable<TServiceResult<IStockFundChartResult>> {
    return this.baseApiService.get(STOCK_CHART_API + `?symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(new TServiceResult<IStockFundChartResult>(null, err?.error?.title, err?.error, false));
      }),
    );
  }

  getStockFunds(): Observable<TServiceResult<IFundProfileModel[]>> {
    return this.baseApiService.get(STOCK_LIST_API);
  }

  getFundBySymbol(symbol: string): Observable<TServiceResult<IFundProfileModel>> {
    if (this.previousFundsSubject?.value?.result?.symbol === symbol) {
      return of(new TServiceResult<IFundProfileModel>(this.previousFundsSubject.value.result, '', null, true));
    } else if (this.allFundsSubject?.value?.result?.length > 0) {
      const fund = this.allFundsSubject.value.result.find((x) => x.symbol === symbol);
      if (fund?.symbol) {
        return of(new TServiceResult<IFundProfileModel>(fund, '', null, true));
      }
    }

    return this.baseApiService.get(FUND_GET_PROFILE_API + `?symbol=${symbol}`).pipe(
      take(1),
      map((res: TServiceResult<IFundProfileModel>) => {
        this.previousFundsSubject.next(res);
        this.manageAllFundsMembers(res.result);
        return res;
      }),
      catchError((err) => {
        return of(null);
      }),
    );
  }

  getStockFundBySymbol(symbol: string): Observable<TServiceResult<IFundProfileModel>> {
    return this.baseApiService.get(STOCK_PROFILE_API + `/${symbol}`);
  }

  private manageAllFundsMembers(fund: IFundProfileModel) {
    if (this.allFundsSubject?.value?.result) {
      const ExistFundIndex = this.allFundsSubject?.value?.result.findIndex((x) => x.symbol === fund.symbol);
      if (ExistFundIndex == -1) {
        this.allFundsSubject.value.result.push(fund);
      }
    }
  }

  verifyCustomer(symbol: string): Observable<TServiceResult<IVerifyCustomer>> {
    return this.baseApiService.post(`${VERIFY_CUSTOMER_STATE}?symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  agreementCustomer(symbol: string, payload): Observable<TServiceResult<{ state: EVerifyCustomerState }>> {
    return this.baseApiService.post(AGREEMENT_CUSTOMER + `?symbol=${symbol}`, payload);
  }

  agreementFile(symbol: string, contractType: string): Observable<any> {
    return this.baseApiService.getFile(`${AGREEMENT_FILE}?symbol=${symbol}&contractType=${contractType}`);
  }

  getWalletBalance(): Observable<TServiceResult<{ amount: number; canWithdraw: boolean }>> {
    return this.baseApiService.get(WALLET_BALANCE);
  }

  walletCashout(payload): Observable<TServiceResult<number>> {
    return this.baseApiService.post(WALLET_CASHOUT, payload);
  }

  walletCashin(payload): Observable<TServiceResult<{ url: string; params: string }>> {
    return this.baseApiService.post(CASHIN_API, payload);
  }

  verifyCustomerUpdateSejam(symbol: string): Observable<TServiceResult<IVerifyCustomer>> {
    return this.baseApiService.post(`${VERIFY_CUSTOMER_UPDATE_SEJAM_API}?symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  updateSejam(otp: string, symbol: string): Observable<TServiceResult<IVerifyCustomer>> {
    return this.baseApiService.put(`${UPDATE_SEJAM_API}?otp=${otp}&symbol=${symbol}`).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  getFundSejamiProfile(): Observable<TServiceResult<IFundsejami>> {
    return this.baseApiService.get(FUND_SEJAMI_PROFILE_API).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }
}
