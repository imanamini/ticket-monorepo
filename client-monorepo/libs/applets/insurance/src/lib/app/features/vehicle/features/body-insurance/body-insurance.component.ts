import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { BodyInsuranceApiService } from './data-access/services/body-insurance-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InsuranceHeaderComponent } from '../../../../components/insurance-header/insurance-header.component';
import { BimehMessageModel } from './data-access/models/bimeh-message.model';
import { BimehMessageType } from './data-access/models/bimeh-message-type.enum';
import { IntrackService } from '../../../../data-access/services/intrack.service';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { ReferrerService } from '../../../../data-access/services/referrer.service';
import { BodyInsuranceStoreService } from './data-access/services/body-insurance-store.service';
import { GoogleTagManagerService } from '../../../../data-access/services/google-tag-manager/angular-google-tag-manager.service';
import { FaqCategoryTypeEnum } from '../../../../data-access/enums/faq-category-type.enum';
import { Router } from '@angular/router';
import { NgxIcon } from '@digipay/ngx-icon';
import { MetricService } from '../../../../data-access/services/metric.service';
import { InsuranceProductTypeEnum } from '../../../../data-access/enums/Insurance-product-type.enum';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../policy/data-access/enums/vehicle-body-policy-state.enum';
import { CloseService } from '../../data-access/services/shared/close.service';
import { PolicyListKeys } from '../../../policy/features/policy-list/data-access/enums/policy-list-keys.enum';
import { BaseComponent } from '../../../../components/base/base.component';
import { LoginService } from '../../../../data-access/services/user-services/login.service';
import { EmptyResultComponent } from '../../../../components/empty-result/empty-result.component';
import { InsDigikalaService } from '../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'body-insurance',
  standalone: true,
  imports: [NgxSpinnerModule, InsuranceHeaderComponent, NgxIcon, EmptyResultComponent],
  templateUrl: './body-insurance.component.html',
  styleUrl: './body-insurance.component.scss',
})
export class BodyInsuranceComponent extends BaseComponent implements OnInit, OnDestroy {
  protected readonly FaqCategoryTypeEnum = FaqCategoryTypeEnum;
  private bodyInsuranceApiService = inject(BodyInsuranceApiService);
  private closeService = inject(CloseService);
  private metricService = inject(MetricService);
  private intrackService = inject(IntrackService);
  private hybridService = inject(NgxHybridServiceService);
  private referrerService = inject(ReferrerService);
  private bodyInsuranceStoreService = inject(BodyInsuranceStoreService);
  private gtmService: GoogleTagManagerService = inject(GoogleTagManagerService);
  private router = inject(Router);
  isLoggedIn = signal(false);
  bodyUrl = signal<SafeResourceUrl>(null);
  isLoading = signal<boolean>(true);
  serviceIsUnavailable = signal<boolean>(false);
  sanitizer = inject(DomSanitizer);
  private loginService = inject(LoginService);
  readonly BODY_STATE_SESSION_STORAGE_KEY = 'current-state-url-body-insurance';
  private digikalaService = inject(InsDigikalaService);
  private bimehMessageHandler = (event: MessageEvent) => {
    if (event.origin === 'https://digipay.bimeh.com') {
      const eventData: BimehMessageModel = event?.data as BimehMessageModel;
      switch (eventData.type) {
        case BimehMessageType.SCRIPT_LOADED:
          this.isLoading.set(false);
          this.handleIdQueryParam();
          break;
        case BimehMessageType.URL_CHANGE:
          sessionStorage.setItem(this.BODY_STATE_SESSION_STORAGE_KEY, eventData.payload);
          break;
        case BimehMessageType.GO_TO_PAYMENT:
          const url = (eventData.payload as any).url;
          if (url) {
            this.goPayment(url);
          }
          break;
        case BimehMessageType.UNAUTHORIZED:
          window.location.reload();
          break;
        case BimehMessageType.GO_TO_MY_POLICIES:
          this.router
            .navigate(['./policy/list'], {
              queryParams: {
                [PolicyListKeys.PRODUCTS]: InsuranceProductTypeEnum.Body,
              },
            })
            .then();
          break;
        case BimehMessageType.API_LOG:
          const logApi: {
            latency: number;
            method: string;
            status: number;
            url: string;
          } = eventData.payload as any;
          this.metricService.sendMetric(
            'apiBody',
            'body',
            [
              {
                key: 'latency',
                value: logApi.latency.toString(),
              },
              {
                key: 'method',
                value: logApi.method,
              },
              {
                key: 'status',
                value: logApi.status.toString(),
              },
              {
                key: 'url',
                value: logApi.url,
              },
            ],
            InsuranceProductTypeEnum.Body,
          );
          break;
      }
    }
  };

  ngOnInit(): void {
    this.gtmService.pushOnDataLayer({
      event: 'load_script_bimeh.com',
    });
    this.checkLogin();
    window.addEventListener('message', this.bimehMessageHandler, false);
  }

  getBody(): void {
    this.bodyUrl.set(null);
    this.isLoading.set(true);
    const bodyPrevStateRaw: string = sessionStorage.getItem(this.BODY_STATE_SESSION_STORAGE_KEY);
    if (!!bodyPrevStateRaw) {
      try {
        const bodyPrevState = JSON.parse(bodyPrevStateRaw);
        if (bodyPrevState.ttl && Date.now() < bodyPrevState.ttl) {
          this.bodyUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(bodyPrevState.route));
          this.isLoading.set(false);
          return;
        } else {
          sessionStorage.removeItem(this.BODY_STATE_SESSION_STORAGE_KEY);
        }
      } catch (e) {
        sessionStorage.removeItem(this.BODY_STATE_SESSION_STORAGE_KEY);
      }
    }
    this.bodyInsuranceApiService.getBodyInsurance().subscribe({
      next: (response) => {
        if (response.success && !!response.result) {
          this.bodyUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(response.result));
        } else {
          this.serviceIsUnavailable.set(true);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.serviceIsUnavailable.set(false);
        this.bodyUrl.set(null);
        this.isLoading.set(false);
      },
    });
  }

  handleCloseClicked(): void {
    sessionStorage.removeItem(this.BODY_STATE_SESSION_STORAGE_KEY);
    this.closeService.close();
  }

  private goPayment(url: string): void {
    this.intrackService.sendIntrackEvent('body_checkout', {});

    this.metricService.sendMetric('clickOnConfirmPaymentBody', null, null);

    let popUp: WindowProxy | null;
    if (this.hybridService.isHybrid()) {
      popUp = window.open(url, '_blank');
    } else {
      this.bodyInsuranceStoreService.storeOrderData({
        isHybrid: this.hybridService.isHybrid(),
        referrer: this.referrerService?.referrer,
      });
      popUp = window.open(url, '_self');
    }

    try {
      popUp.focus();
    } catch (e) {
      window.location.assign(url);
    }
  }

  private handleIdQueryParam(): void {
    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    const state = this.activatedRoute.snapshot.queryParamMap.get('state');
    if (id) {
      const iframe = document.getElementById('frm-body') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        // https://digipay.bimeh.com/profile/bought
        // https://digipay.bimeh.com/ins/insurance-details?id=9220eac3-8478-422a-b534-ad5c606e900e
        // https://digipay.bimeh.com/ins/info?id=0993853f-e78f-4c54-8c4c-88ea908e416f
        // https://digipay.bimeh.com/ins/payment?id=0993853f-e78f-4c54-8c4c-88ea908e416f
        let insuranceDetailsUrl = '';
        switch (state) {
          case VEHICLE_BODY_POLICY_STATE_ENUM.DEBTOR:
            insuranceDetailsUrl = `https://digipay.bimeh.com/ins/payment?id=${id}`;
            break;
          case VEHICLE_BODY_POLICY_STATE_ENUM.VISITDOCUMENTDEFECT:
          case VEHICLE_BODY_POLICY_STATE_ENUM.DOCUMENTDEFECT:
            insuranceDetailsUrl = `https://digipay.bimeh.com/ins/insurance-details?id=${id}`;
            break;
          case VEHICLE_BODY_POLICY_STATE_ENUM.INQUIRY:
            insuranceDetailsUrl = `https://digipay.bimeh.com/ins/info?id=${id}`;
            break;
          default:
            insuranceDetailsUrl = `https://digipay.bimeh.com/profile/bought`;
        }
        iframe.contentWindow.postMessage(
          {
            type: BimehMessageType.NAVIGATE_TO_URL,
            url: insuranceDetailsUrl,
          },
          'https://digipay.bimeh.com',
        );
        this.router
          .navigate([], {
            queryParams: { id: null, state: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          })
          .then();
      }
    }
  }

  private checkLogin(): void {
    super.addSubscription(
      this.loginService.isLoggedIn$.subscribe((isLogin) => {
        this.isLoggedIn.set(isLogin);
        if (this.isLoggedIn()) {
          this.getBody();
        } else {
          this.isLoading.set(false);
        }
      }),
    );
  }

  public handleLoginClicked(): void {
    this.digikalaService.authDigikalaService
      .initialLoginDigiPayToDigikala()
      .then(() => {})
      .catch((error) => {
        if (this.digikalaService.checkHasErrorIdpPinCode(error)) {
          return;
        }
        this.loginService.routeToLoginPage();
      });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem(this.BODY_STATE_SESSION_STORAGE_KEY);
  }
}
