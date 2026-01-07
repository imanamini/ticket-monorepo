import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, defer, expand, map, Observable, of, shareReplay, switchMap, timer } from 'rxjs';
import { IWallet, IWallets } from '../models/wallet.interface';
import {
  WALLET_AFFILIATE_CODE_API,
  WALLET_BASE_API,
  WALLET_CACH_IN_API,
  WALLET_BNPL_CLOSE_API,
  WALLET_CACH_IN_INQUIRY_API,
  WALLET_CACH_OUT_INQUIRY_API,
  WALLET_DETAIL_API as WALLET_DETAILS_API,
  API,
} from '../../../data-access/constants/api';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { BaseApiService, SKIP_BASIC_TOKEN } from '../../../components/core/services/base-api.service';
import { IWalletProcessData } from '../models/wallet-process.interface';
import { IIpg } from '../models/ipg-model.interface';
import { IReceipt } from '../../../data-access/models/receipt.interface';
import { ICancelBnpl } from '../models/cancel-bnpl.interface';
import { IAnnualProfit } from '../models/annual-profit.interface';
import { IGoldPricePublisher } from '../models/gold-price-publisher.interface';
import { ProcessActionType } from '../models/process-action.type';
import { IWalletActivationProcess } from '../models/wallet-activation-process.interface';
import { HttpContext } from '@angular/common/http';
import { IWalletProcess } from '../models/wallet-cashin-model.interface';
import { RedirectionHandler } from '../data-access/services/redirection-handler';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private readonly walletIndexPollIntervalMs = 60_000;
  private goldPricingPublisher: BehaviorSubject<IGoldPricePublisher> = new BehaviorSubject<IGoldPricePublisher>(null);
  public goldPricingPublisher$ = this.goldPricingPublisher.asObservable();
  private baseService = inject(BaseApiService);

  private walletIndexValueStreams = new Map<string, Observable<TServiceResult<IGoldPricePublisher>>>();
  private walletIndexValueRequestCache = new Map<
    string,
    { expiresAt: number; observable: Observable<TServiceResult<IGoldPricePublisher>> }
  >();

  private readonly goldPricingPublisherTimerInitial = 60;
  private goldPricingPublisherTimer = this.goldPricingPublisherTimerInitial;
  private goldPricingIntervalId: ReturnType<typeof setInterval> | null = null;
  private goldPricingPublisherData: IGoldPricePublisher | null = null;

  private redirectionHandler = new RedirectionHandler();

  getWalletInfo(walletId: string): Observable<TServiceResult<IWallet>> {
    return this.baseService.get(`${WALLET_DETAILS_API}/${walletId.toLocaleLowerCase()}/details`).pipe(
      catchError((error) => {
        return of(error);
      }),
    );
  }

  walletCashin(processData: IWalletProcessData): Observable<TServiceResult<IIpg>> {
    return this.baseService.post(WALLET_CACH_IN_API, processData).pipe(
      catchError((error) => {
        return of(error);
      }),
    );
  }

  walletCashinInquiry(trackingCode: string): Observable<TServiceResult<IReceipt>> {
    return this.baseService.get(`${WALLET_CACH_IN_INQUIRY_API}?trackingCode=${trackingCode}`).pipe(
      catchError((error) => {
        return of(error);
      }),
    );
  }

  walletCashoutInquiry(trackingCode: string): Observable<TServiceResult<IReceipt>> {
    return this.baseService.get(`${WALLET_CACH_OUT_INQUIRY_API}?trackingCode=${trackingCode}`).pipe(
      catchError((error) => {
        return of(error);
      }),
    );
  }

  walletProcess(apiUrl: string, processData: IWalletProcessData): Observable<TServiceResult<IWalletProcessData>> {
    const query = this.buildActionQueryString(processData.action);
    if (this.isString(processData?.data.amount)) {
      processData.data.amount = processData?.data?.amount?.replaceAll('٬', '');
    }
    return this.baseService.post(`${apiUrl}${query}`, processData.data).pipe(
      map((res: TServiceResult<IWalletProcessData>) => {
        const page = this._isActionPage(res.result.action.toLowerCase()) ? res.result.data.pageName : res.result.data.topOnPage;
        this.redirectionHandler.HandleWalletPageRedirection(page, { ...processData.data, ...res.result.data }, processData.data.walletId);
        return res;
      }),
      catchError((error) => {
        return of(error);
      }),
    );
  }

  private _isActionPage(action: string): boolean {
    return action === 'page';
  }

  walletBnplClose(): Observable<TServiceResult<ICancelBnpl>> {
    return this.baseService.post(`${WALLET_BASE_API}${WALLET_BNPL_CLOSE_API}`, null).pipe(
      catchError((err) => {
        return of(err);
      }),
    );
  }

  private isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  private buildActionQueryString(action: ProcessActionType): string {
    return action ? `?action=${action}` : '';
  }

  affiliateCode(walletName: string, code: string): Observable<TServiceResult<string>> {
    return this.baseService.post(`${WALLET_BASE_API}${walletName}${WALLET_AFFILIATE_CODE_API}?code=${code}`, null);
  }

  viewPnl(walletName: string): Observable<TServiceResult<IAnnualProfit>> {
    return this.baseService.get(`${API.wallet.base}/${walletName}/view-pnl`);
  }

  viewProfile(): Observable<TServiceResult<IWallets>> {
    return this.baseService.get(`${API.wallet.base}/profile`);
  }

  getWalletIndexValue(walletName: string): Observable<TServiceResult<IGoldPricePublisher>> {
    return this.fetchWalletIndexValue(walletName);
  }

  getWalletIndexValueStream(walletName: string): Observable<TServiceResult<IGoldPricePublisher>> {
    if (!this.walletIndexValueStreams.has(walletName)) {
      const stream$ = defer(() => this.fetchWalletIndexValue(walletName)).pipe(
        expand((response) => timer(this.resolveWalletIndexDelay(response)).pipe(switchMap(() => this.fetchWalletIndexValue(walletName)))),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
      this.walletIndexValueStreams.set(walletName, stream$);
    }

    return this.walletIndexValueStreams.get(walletName)!;
  }

  walletActivationProcess(processData: IWalletProcess): Observable<TServiceResult<IWalletActivationProcess>> {
    return this.baseService
      .post(API.wallet.coordinator.walletActivation, processData, undefined, new HttpContext().set(SKIP_BASIC_TOKEN, true))
      .pipe(
        map((res: TServiceResult<IWalletProcessData>) => {
          if (res.result.action.toLowerCase() === 'page') {
            this.redirectionHandler.HandleWalletPageRedirection(
              res.result.data.pageName,
              { ...res.result.data, ...processData },
              processData.walletId,
            );
          } else if (res.result.action.toLowerCase() === 'bottomsheet') {
            this.redirectionHandler.HandleWalletPageRedirection(
              res.result.data.topOnPage,
              { ...res.result.data, ...processData },
              processData.walletId,
            );
          } else if (res.result.action.toLowerCase() === 'exceptionpage') {
            this.redirectionHandler.HandleWalletPageRedirection(
              res.result.data.topOnPage,
              { ...res.result.data, ...processData },
              processData.walletId,
            );
          }
          return res;
        }),
        catchError((error) => {
          return of(error);
        }),
      );
  }

  private fetchWalletIndexValue(walletName: string): Observable<TServiceResult<IGoldPricePublisher>> {
    const cached = this.walletIndexValueRequestCache.get(walletName);
    const now = Date.now();

    if (cached && now < cached.expiresAt) {
      return cached.observable;
    }

    const expiresAt = now + this.walletIndexPollIntervalMs;

    // @ignoreFormatting
    const request$ = this.baseService.get(`${API.wallet.base}/${walletName}/index-value`).pipe(
      map((res: TServiceResult<IGoldPricePublisher>) => {
        if (res?.result?.value !== undefined && res?.result?.value !== null) {
          this.updateGoldPricingPublisher(res.result);
        }
        return res;
      }),
      catchError((error) => {
        return of(new TServiceResult<IGoldPricePublisher>(null, '', error, false));
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.walletIndexValueRequestCache.set(walletName, { expiresAt, observable: request$ });

    return request$;
  }

  private updateGoldPricingPublisher(nextValue: IGoldPricePublisher): void {
    const hasValueChanged = this.goldPricingPublisherData?.value !== nextValue.value;
    this.goldPricingPublisherTimer = this.goldPricingPublisherTimerInitial;
    const nextData: IGoldPricePublisher = {
      ...nextValue,
      valueChanged: hasValueChanged,
    };

    this.publishGoldPricing(nextData);
    this.ensureGoldPricingTimer();
  }

  private publishGoldPricing(data: IGoldPricePublisher): void {
    this.goldPricingPublisherData = data;
    this.goldPricingPublisher.next(data);
  }

  private ensureGoldPricingTimer(): void {
    if (this.goldPricingIntervalId) {
      return;
    }

    this.goldPricingIntervalId = setInterval(() => {
      if (!this.goldPricingPublisherData) {
        return;
      }

      if (this.goldPricingPublisherTimer <= 1) {
        this.goldPricingPublisherTimer = this.goldPricingPublisherTimerInitial;
        this.fetchWalletIndexValue('WALLET_GOLD');
      } else {
        this.goldPricingPublisherTimer -= 1;
      }

      this.publishGoldPricing({
        ...this.goldPricingPublisherData,
        sec: this.goldPricingPublisherTimer,
        valueChanged: false,
      });
    }, 1000);
  }

  public stopGoldPricingTimer(): void {
    if (!this.goldPricingIntervalId) {
      return;
    }

    this.goldPricingPublisher.next(null);
    const expiresAt = new Date().getTime();
    this.walletIndexValueRequestCache.set('WALLET_GOLD', { expiresAt, observable: null });
    clearInterval(this.goldPricingIntervalId);
    this.goldPricingIntervalId = null;
  }

  private resolveWalletIndexDelay(response: unknown): number {
    const result = this.safeExtractWalletIndex(response);
    if (!result?.dateTime) {
      return this.walletIndexPollIntervalMs;
    }

    const serverTimestamp = new Date(result.dateTime).getTime();
    if (Number.isNaN(serverTimestamp)) {
      return this.walletIndexPollIntervalMs;
    }

    const elapsed = Date.now() - serverTimestamp;
    return Math.max(0, this.walletIndexPollIntervalMs - elapsed);
  }

  private safeExtractWalletIndex(response: unknown): IGoldPricePublisher | null {
    if (response && typeof response === 'object' && 'result' in response && response.result && typeof response.result === 'object') {
      return (response as TServiceResult<IGoldPricePublisher>).result;
    }
    return null;
  }
}
