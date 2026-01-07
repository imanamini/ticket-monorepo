import { inject, Injectable } from '@angular/core';
import { QueryParamHouseIncidentEnum } from '../enums/query-param-house-incident.enum';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import {
  OrderDetailBottomSheetComponent
} from '../../features/plp/components/order-detail-bottom-sheet/order-detail-bottom-sheet.component';
import { HouseIncidentProductCardModel } from '../../features/plp/data-access/models/house-incident-product-card.model';
import { HouseIncidentsDynamicService } from './house-incidents-dynamic-action.service';
import { EnvironmentService } from '@client-monorepo/app-core';
import { HOUSE_INCIDENTS_URLS } from '../constants/house-incidents-urls';
import { NgxNoticeService, noticeResult } from '@digipay/ngx-notice';
import { HouseIncidentsDataStorageService } from './house-incidents-data-storage.service';
import {
  GoogleTagManagerService
} from '../../../../data-access/services/google-tag-manager/angular-google-tag-manager.service';
import { UserAuthService } from '../../../../data-access/services/user-services/user-auth.service';
import { PolicyUserInfoModel } from '../../features/complete-journey/model/policy-user-info.model';
import {
  AddVoucherBottomSheetComponent
} from '../../components/add-voucher-bottom-sheet/add-voucher-bottom-sheet.component';
import { PaymentRequestTypeEnum } from '../../../vehicle/data-access/enums/payment-request-type.enum';
import {
  HouseIncidentCompleteInfoModel
} from '../../features/complete-journey/model/house-incident-user-info-form.model';
import { Observable } from 'rxjs';
import {
  HouseIncidentPaymentResultModel
} from '../../features/plp/data-access/models/house-incident-payment-result.model';
import {
  LeaveJourneyConfirmationModalComponent
} from '../../features/complete-info/components/leave-journey-confirmation-modal/leave-journey-confirmation-modal.component';
import { InsuranceUrlsEnum } from '../../../../data-access/enums/insurance-urls.enum';
import { InsuranceTabEnum } from '../../../policy/data-access/enums/policy-list.enum';

@Injectable({
  providedIn: 'root',
})
export class HouseIncidentsAActionsService extends HouseIncidentsDynamicService {
  private noticeService = inject(NgxNoticeService);
  private houseIncidentsDataStorageService = inject(HouseIncidentsDataStorageService);
  private GTManagerService = inject(GoogleTagManagerService);
  private userAuthService = inject(UserAuthService);
  private env = EnvironmentService.env;

  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  orderProduct(productCard: HouseIncidentProductCardModel, applicationId: string, orderDetail: PolicyUserInfoModel): void {
    new Promise((resolve) => {
      if (orderDetail?.state === 'Draft') {
        resolve(orderDetail);
      } else {
        this.apiHouseIncidentsService.orderDraft(productCard.plan, applicationId).subscribe({
          next: () => {
            resolve({id: applicationId, data: productCard});
          },
        });
      }
    }).then((newOrderDetail) => {
      this.addApplicationIdQueryParams(applicationId);
      this.addFragmentToOpenModal({plan: productCard.plan});
      this.openOrderDetailBottomSheet(newOrderDetail);
    });
  }

  addApplicationIdQueryParams(applicationId: string): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        [QueryParamHouseIncidentEnum.ApplicationId]: applicationId,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  openVoucherBottomSheet(orderDetail: PolicyUserInfoModel): void {
    this.bottomSheetService.closeCurrentBottomSheet({goToPayment: false});
    this.bottomSheetService
      .open(BottomSheetBoxComponent, {
        component: AddVoucherBottomSheetComponent,
        name: 'AddVoucherBottomSheetComponent',
        title: 'افزودن کد تخفیف',
      })
      .afterDismissed()
      .subscribe({
        next: (res) => {
          const newOrderDetail = res ?? orderDetail;
          this.openOrderDetailBottomSheet(newOrderDetail);
        },
      });
  }

  private openOrderDetailBottomSheet(orderDetail: Partial<PolicyUserInfoModel>): void {
    this.bottomSheetService
      .open(
        BottomSheetBoxComponent,
        {
          component: OrderDetailBottomSheetComponent,
          name: 'HouseIncidentsOrderDetailBottomSheetComponent',
          data: {
            orderDetail: {...orderDetail},
          },
        },
        {
          showHolderIcon: true,
        },
      )
      .afterDismissed()
      .subscribe({
        next: (result: { goToPayment: boolean }) => {
          if (!result) {
            this.removeFragment();
            return;
          }
          if (result.goToPayment) {
            this.metricService.sendMetric('HouseIncidentsConfirmAndPay', this.router.url, []);
            this.sendToPayment(orderDetail.id);
          }
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
      this.noticeService.openModal({
        title: 'هشدار!',
        description:
          ' توجه داشته باشید که آدرس و کدپستی ثبت شده توسط شما مبنای بررسی درخواست جبران خسارت خواهند بود و در ادامه قابل تغییر نیستند.',
        state: 'warning',
        position: 'bottom-center',
        primaryButtonLabel: 'تایید',
        secondaryButtonLabel: 'بازگشت',
        isHorizontalAction: true,
      });

      super.addSubscription(
        this.noticeService.afterClosed().subscribe({
          next: (result: noticeResult) => {
            if (result === 'primary') {
              this.apiHouseIncidentsService.completeUserInfo(applicationId, data).subscribe({
                next: () => {
                  observer.next(false);
                  this.metricService.sendMetric('HouseIncidentsCompleteInfo', this.router.url, []);
                  this.proceedToIssuePolicy();
                },
                error: (err) => {
                  observer.error(err);
                },
              });
            } else {
              observer.next(false);
            }
          },
        })
      );
    });
  }

  proceedToIssuePolicy(): void {
    this.router.navigate([HOUSE_INCIDENTS_URLS.COMPLETE_JOURNEY], {
      queryParamsHandling: 'preserve',
    });
  }

  handlePaymentResult(providerId: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.apiHouseIncidentsService.getPaymentResult(providerId).subscribe((response) => {
        const applicationFormId = response?.result?.applicationFormId;
        this.houseIncidentsDataStorageService.storeApplicationFormId(response?.result?.applicationFormId);
        this.referrerService.setReferrerSource(response.result.referrer);
        this.sendPaymentResultGTMEvent(response.result);
        if (applicationFormId) {
          this.router.navigate([], {
            queryParams: {[QueryParamHouseIncidentEnum.ApplicationId]: response?.result?.applicationFormId},
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }
        observer.next(response?.result?.isSuccess);
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

  private addFragmentToOpenModal(queryParam: { plan: string }): Promise<boolean> {
    return this.router.navigate([], {
      queryParams: queryParam,
      relativeTo: this.activatedRoute,
      fragment: this.apiHouseIncidentsService.FRAGMENT_PREPAYMENT,
      queryParamsHandling: 'merge',
    });
  }

  private removeFragment(): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      fragment: null,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  leaveCompleteInfo(): void {
    this.bottomSheetService
      .open(
        LeaveJourneyConfirmationModalComponent,
        {
          name: 'LeaveJourneyConfirmationModalComponent',
        },
        {
          fullPage: true,
        },
      )
      .afterDismissed()
      .subscribe({
        next: (result: boolean) => {
          if (result === null || result === undefined) {
            return;
          }
          if (!result) {
            this.router
              .navigate([InsuranceUrlsEnum.PolicyList], {
                queryParams: {
                  type: InsuranceTabEnum.HOUSE_INCIDENT,
                },
              })
              .then();
          }
        },
      });
  }

  retryFailedPayment(applicationFormId: string): void {
    this.router.navigate([HOUSE_INCIDENTS_URLS.PLP], {
      queryParams: {
        [QueryParamHouseIncidentEnum.ApplicationId]: applicationFormId,
        [QueryParamHouseIncidentEnum.BackFromPayment]: true,
      },
      fragment: this.apiHouseIncidentsService.FRAGMENT_PREPAYMENT,
      replaceUrl: true,
    });
  }
}
