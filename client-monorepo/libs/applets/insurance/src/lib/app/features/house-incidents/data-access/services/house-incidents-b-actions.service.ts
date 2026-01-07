import { inject, Injectable } from '@angular/core';
import { QueryParamHouseIncidentEnum } from '../enums/query-param-house-incident.enum';
import { HouseIncidentProductCardModel } from '../../features/plp/data-access/models/house-incident-product-card.model';
import { HouseIncidentsDynamicService } from './house-incidents-dynamic-action.service';
import { EnvironmentService } from '@client-monorepo/app-core';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import {
  GoogleTagManagerService
} from '../../../../data-access/services/google-tag-manager/angular-google-tag-manager.service';
import { UserAuthService } from '../../../../data-access/services/user-services/user-auth.service';
import { HOUSE_INCIDENTS_URLS } from '../constants/house-incidents-urls';
import { PaymentRequestTypeEnum } from '../../../vehicle/data-access/enums/payment-request-type.enum';
import {
  HouseIncidentCompleteInfoModel
} from '../../features/complete-journey/model/house-incident-user-info-form.model';
import { Observable } from 'rxjs';
import {
  HouseIncidentPaymentResultModel
} from '../../features/plp/data-access/models/house-incident-payment-result.model';
import { PolicyUserInfoModel } from '../../features/complete-journey/model/policy-user-info.model';
import {
  AddVoucherBottomSheetComponent
} from '../../components/add-voucher-bottom-sheet/add-voucher-bottom-sheet.component';

@Injectable({
  providedIn: 'root',
})
export class HouseIncidentsBActionsService extends HouseIncidentsDynamicService {
  private GTManagerService = inject(GoogleTagManagerService);
  private userAuthService = inject(UserAuthService);
  private env = EnvironmentService.env;

  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  orderProduct(productCard: HouseIncidentProductCardModel, applicationId: string): void {
    this.apiHouseIncidentsService.orderDraft(productCard.plan, applicationId).subscribe({
      next: (response) => {
        this.router.navigate([HOUSE_INCIDENTS_URLS.COMPLETE_INFO], {
          queryParams: {
            [QueryParamHouseIncidentEnum.ApplicationId]: applicationId,
          },
          queryParamsHandling: 'merge',
        });
      },
    });
  }

  sendToPayment(applicationFormId: string): void {
    this.apiHouseIncidentsService
      .goToPayment(applicationFormId, {
        isHybrid: this.hybridService.isHybrid(),
        referrer: this.referrerService?.referrer,
        origin: this.environment.domain_address,
        paymentRequestType: PaymentRequestTypeEnum.ORDER,
      })
      .subscribe((res) => {
        let popUp: WindowProxy | null;
        if (this.hybridService.isHybrid()) {
          popUp = window.open(
            `${this.environment.domain_address + this.environment.base_href}/${HOUSE_INCIDENTS_URLS.GO_TO_PAYMENT}?${QueryParamHouseIncidentEnum.UrlGoToPayment}=${encodeURI(res.result.paymentUrl)}&${QueryParamHouseIncidentEnum.ProviderId}=${res.result.providerId}&${QueryParamHouseIncidentEnum.ApplicationId}=${applicationFormId}${this.referrerService?.referrer ? '&' + QueryParamHouseIncidentEnum.Referrer + '=' + this.referrerService?.referrer : ''}&isHybrid=true`,
            '_blank',
          );
        } else {
          this.storeDataForPaymentService.storeOrderData({
            isHybrid: this.hybridService.isHybrid(),
            referrer: this.referrerService?.referrer,
            appId: applicationFormId,
            providerId: res.result.providerId,
          });
          popUp = window.open(res.result.paymentUrl, '_self');
        }
        try {
          popUp.focus();
        } catch (e) {
          window.location.assign(res.result.paymentUrl);
        }
      });
  }

  completeInfo(applicationId: string, data: HouseIncidentCompleteInfoModel): Observable<any> {
    return new Observable<boolean>((observer) => {
      this.apiHouseIncidentsService.completeUserInfo(applicationId, data).subscribe({
        next: () => {
          observer.next(false);
          this.metricService.sendMetric('HouseIncidentsCompleteInfo', this.router.url, []);
          this.router.navigate([HOUSE_INCIDENTS_URLS.CHECKOUT], {
            queryParamsHandling: 'preserve',
          });
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  handlePaymentResult(providerId: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.apiHouseIncidentsService.getPaymentResult(providerId).subscribe((response) => {
        const isSuccess = response?.result?.isSuccess;
        observer.next(isSuccess);
        const applicationFormId = response?.result?.applicationFormId;
        this.referrerService.setReferrerSource(response.result.referrer);
        this.sendPaymentResultGTMEvent(response.result);
        if (applicationFormId && isSuccess) {
          this.router.navigate([HOUSE_INCIDENTS_URLS.COMPLETE_JOURNEY], {
            queryParams: { [QueryParamHouseIncidentEnum.ApplicationId]: applicationFormId },
          });
        } else {
          this.router.navigate([], {
            queryParams: { [QueryParamHouseIncidentEnum.ApplicationId]: response?.result?.applicationFormId },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }
      });
    });
  }

  sendPaymentResultGTMEvent(paymentResult: HouseIncidentPaymentResultModel): void {
    this.GTManagerService.pushOnDataLayer({
      currency: 'IRR',
      value: paymentResult.paidAmount,
      transaction_id: paymentResult.providerId,
      transaction_type: paymentResult.transactionType,
      order_id: paymentResult.applicationFormId,
      user_id: this.userAuthService.getStorageAuthToken()?.auth?.userId,
      coupon: paymentResult.discountCode ?? 'not_set',
      couponvalue: paymentResult.discountAmount ?? 0,
      method: paymentResult.ticketType,
      biz_id: paymentResult.businessId,
      tax: paymentResult.taxAmount ?? 0,
    });
  }

  leaveCompleteInfo(): void {
    window.history.back();
  }

  async retryFailedPayment(applicationFormId: string): Promise<void> {
    await this.navigationService.openWithBackTarget(
      [HOUSE_INCIDENTS_URLS.CHECKOUT], // current: مقصد نهایی بعد از Retry
      [HOUSE_INCIDENTS_URLS.COMPLETE_INFO], // backTarget: جایی که Back باید برگردد
      {
        queryParams: {
          [QueryParamHouseIncidentEnum.ApplicationId]: applicationFormId,
          [QueryParamHouseIncidentEnum.BackFromPayment]: true,
        },
        state: { retried: true, from: HOUSE_INCIDENTS_URLS.PAYMENT_RESULT },
      },
    );
  }

  openVoucherBottomSheet(): Observable<PolicyUserInfoModel> {
    return this.bottomSheetService
      .open(BottomSheetBoxComponent, {
        component: AddVoucherBottomSheetComponent,
        name: 'AddVoucherBottomSheetComponent',
        title: 'افزودن کد تخفیف',
      })
      .afterDismissed();
  }
}
