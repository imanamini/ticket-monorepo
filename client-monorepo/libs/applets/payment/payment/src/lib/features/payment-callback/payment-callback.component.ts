import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Base64 } from 'js-base64';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActivityInfo,
  PaymentResultInterface,
  PaymentResultStatus,
  PaymentResultStatusMapper,
  PaymentUrlService,
} from '@client-monorepo/payment/purchase';
import { convertSearchParamsToJson, fixActivityInfoArray } from '@client-monorepo/common/utilities';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';
import { PaymentResult, RedirectDetailModel } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { Action, ActionHandlerService, ActionType, RedirectAction, RedirectPayload } from '@client-monorepo/common/action-handler';
import { TransactionTypeMapper } from '../../data-access/constants/transaction-type-mapper';
import { SpecifiedExitTransactionTypes } from '../../data-access/constants/specified-exit-transaction-types';
import { CacheService } from '@client-monorepo/common/network';
import { INTRACK_EVENT_FINE, INTRACK_EVENT_FINE_INQUIRY, INTRACK_EVENT_TOLL } from '../../data-access/constants/intrack-event-name';
import { PaymentResultType } from '../../data-access/model/payment-result-type.enum';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'payment-applet-payment-callback',
  standalone: true,
  imports: [NgxPaymentResult, NgxSkeletonLoadingComponent],
  templateUrl: './payment-callback.component.html',
  styleUrls: ['./payment-callback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCallbackComponent implements OnInit {
  // Injects
  private readonly actionHandlerService = inject(ActionHandlerService);
  private readonly cacheService = inject(CacheService);
  private readonly eventService = inject(NgxEventTrackerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentUrlService = inject(PaymentUrlService);
  private readonly bottomNavigationService = inject(NgxBottomNavigationService);

  isReady = signal(false);
  trackingCode = signal('');
  result = signal<PaymentResult>({} as PaymentResult);
  transactionType = '';
  transactionTypeCancelActionMap: Record<string, Action> = TransactionTypeMapper;

  ngOnInit() {
    this.cacheService.deleteFromCache('dpx/services/assets', false);
    this.transactionType = this.route.snapshot.params['transactionType'];
    this.bottomNavigationService.hide();
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('data')) {
      let data = urlParams.get('data');

      if (data) {
        data = decodeURIComponent(data);
        // javascript normal decode (atob function)
        // didn't work for this string and we should
        // use this third-party tool for doing this
        const decodedData = JSON.parse(Base64.decode(data));
        this.handleIntrackEvent(decodedData);
        if (!urlParams.has('result')) {
          this.route.params.subscribe((params) => {
            this.appendStatusToRoute(decodedData.paymentResult, params['transactionType'], urlParams);
          });
          return;
        }

        this.fixDataAndStore(decodedData);
      }
    } else {
      this.route.paramMap.pipe(map(() => window.history.state)).subscribe((data) => {
        if (data && data.paymentResult) {
          this.fixDataAndStore(data.paymentResult);
        } else {
          this.exit();
        }
      });
    }
  }

  handleIntrackEvent(decodedData: any) {
    if (!decodedData?.type) return;

    const commonEventData = {
      plateNumber: decodedData?.activityInfo?.[0]?.['پلاک خودرو'],
      status: decodedData?.status,
    };

    let event: { eventName: string; eventData: any } | null = null;

    switch (decodedData.type) {
      case PaymentResultType.FINE_INQUIRY:
        event = {
          eventName: INTRACK_EVENT_FINE_INQUIRY,
          eventData: commonEventData,
        };
        break;

      case PaymentResultType.FINE:
        event = {
          eventName: INTRACK_EVENT_FINE,
          eventData: { ...commonEventData, amount: decodedData?.amount },
        };
        break;

      case PaymentResultType.TOLL:
        event = {
          eventName: INTRACK_EVENT_TOLL,
          eventData: { ...commonEventData, amount: decodedData?.amount },
        };
        break;
    }

    if (event) {
      this.eventService.sendEvent(event);
    }
  }

  exit(): void {
    const transactionTypeAction = this.transactionType
      ? (this.transactionTypeCancelActionMap[this.transactionType] as RedirectAction)
      : undefined;
    if (transactionTypeAction && SpecifiedExitTransactionTypes.includes(this.transactionType)) {
      const actionToPass: RedirectAction = {
        type: transactionTypeAction.type,
        payload: {
          ...transactionTypeAction.payload,
          state: { ...transactionTypeAction.payload.state, customLinkForBack: 'hub' },
        },
      };
      this.actionHandlerService.handle(actionToPass);
      return;
    }
    const action: RedirectAction = {
      type: ActionType.REDIRECT,
      payload: {
        url: 'transactions/report/history',
        state: { customLinkForBack: 'hub' },
      },
    };
    this.actionHandlerService.handle(action);
  }

  /**
   * Append payment result to the current path to
   * have a metric for failed/succeeded payments
   *
   * (Based on PO's request for better tracking)
   *
   * @param paymentResult
   * @param transactionType
   * @param urlParams
   */
  appendStatusToRoute(paymentResult: any, transactionType: string, urlParams: URLSearchParams) {
    urlParams.set('result', paymentResult);
    const params: Record<string, any> = {};
    urlParams.forEach((value, key) => {
      params[key] = value;
    });

    this.router
      .navigate([this.paymentUrlService.paymentCallbackUrl(transactionType, false)], {
        queryParams: params,
      })
      .then(() => {
        this.readDataFromQueryParams();
      });
  }

  /**
   * Read data from query string, decodes and stores it
   */
  private readDataFromQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);

    let data = urlParams.get('data');

    if (data) {
      data = decodeURIComponent(data);
      const decodedData = JSON.parse(Base64.decode(data));
      this.fixDataAndStore(decodedData);
    }
  }

  /**
   * Fixes the activity info issue and sets result property
   * @param result
   */
  private fixDataAndStore(result: PaymentResultInterface) {
    this.trackingCode.set(result?.trackingCode);
    let redirectDetail = result?.redirectDetail;
    if (redirectDetail) {
      // convert data property to json
      redirectDetail['data'] = convertSearchParamsToJson(redirectDetail?.data || '');
    } else if (result?.paymentResult === PaymentResultStatus.FAILED) {
      redirectDetail = this.generateFailureRedirection();
    }
    const modifiedActivityInfo = Array.isArray(result.activityInfo)
      ? result.activityInfo
      : (fixActivityInfoArray(result?.activityInfo) as ActivityInfo[]);
    this.result.set({
      ...result,
      bannerImageId: 'receipt-banner-image',
      items: modifiedActivityInfo,
      paymentResult: PaymentResultStatusMapper[result?.paymentResult],
      redirectDetail,
    });
    this.isReady.set(true);
  }

  onBannerClicked(): void {
    this.actionHandlerService
      .handle({
        type: ActionType.REDIRECT,
        payload: {
          url: 'hub/main-services',
          params: {
            filter: 'mobile',
            referrer: 'pro-banner',
          },
        },
      })
      .then();
  }

  generateFailureRedirection(): RedirectDetailModel {
    const transactionTypeUrl = (this.transactionTypeCancelActionMap[this.transactionType]?.payload as RedirectPayload).url || '/hub';
    return {
      text: 'بازگشت',
      path: `${window.location.origin}/${transactionTypeUrl}`,
      method: 0,
      data: '',
    };
  }

  onBackButton() {
    this.exit();
  }
}
