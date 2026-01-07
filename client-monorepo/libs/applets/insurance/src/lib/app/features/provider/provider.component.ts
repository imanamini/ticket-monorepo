import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { InsuranceHeaderComponent } from '../../components/insurance-header/insurance-header.component';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InsuranceTabEnum } from '../policy/data-access/enums/policy-list.enum';
import { IntrackService } from '../../data-access/services/intrack.service';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { ReferrerService } from '../../data-access/services/referrer.service';
import { MetricService } from '../../data-access/services/metric.service';
import {
  BodyInsuranceApiService
} from '../vehicle/features/body-insurance/data-access/services/body-insurance-api.service';
import { CloseService } from '../vehicle/data-access/services/shared/close.service';
import {
  BodyInsuranceStoreService
} from '../vehicle/features/body-insurance/data-access/services/body-insurance-store.service';
import { BimehMessageType } from '../vehicle/features/body-insurance/data-access/models/bimeh-message-type.enum';
import { BimehMessageModel } from '../vehicle/features/body-insurance/data-access/models/bimeh-message.model';

@Component({
  selector: 'provider',
  standalone: true,
  imports: [
    InsuranceHeaderComponent,
    NgxSpinnerModule
  ],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss'
})
export class ProviderComponent implements OnInit {
//  /b/payment-result?returnUrl=https://digipay.bimeh.com/ins/paymentfailed?id=ec8a5212-a1ad-4e05-bbef-d3ec00b24e52
  public iframeUrl = signal<SafeResourceUrl>(null);
  public isLoading = signal<boolean>(true);
  public showHeader = computed<boolean>(() => {
    return window.location.href.includes('paymentfailed');
  });
  private bodyInsuranceApiService = inject(BodyInsuranceApiService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly sanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly closeService = inject(CloseService);
  private readonly intrackService = inject(IntrackService);
  private readonly hybridService = inject(NgxHybridServiceService);
  private readonly referrerService = inject(ReferrerService);
  private metricService = inject(MetricService);
  private bodyInsuranceStoreService = inject(BodyInsuranceStoreService);

  ngOnInit(): void {
    window.addEventListener('message', this.bimehMessageHandler, false);
    const url = this.sanitizer.bypassSecurityTrustResourceUrl(this.route.snapshot.queryParamMap.get('returnUrl') ?? null);
    this.iframeUrl.set(url);
    this.isLoading.set(false);
  }

  public handleCloseClicked(): void {
    this.closeService.close();
  }

  private bimehMessageHandler = (event: MessageEvent) => {
    if (event.origin === 'https://digipay.bimeh.com') {
      const eventData: BimehMessageModel = event?.data as BimehMessageModel;
      switch (eventData.type) {
        case BimehMessageType.GO_TO_MY_POLICIES:
          this.router.navigate(['./policy/list'], {
            queryParams: {
              type: InsuranceTabEnum.CAR_BODY
            }
          }).then();
          break;
        case BimehMessageType.GO_TO_PAYMENT:
          const url = (eventData.payload as any).url;
          if (url) {
            this.goPayment(url);
          }
          break;
        case BimehMessageType.UNAUTHORIZED:
          this.bodyInsuranceApiService.getBodyInsurance().subscribe({
            next: response => {
              if (response.success && !!response.result) {
                const url = response.result;
                const iframe = document.getElementById('frm-body') as HTMLIFrameElement;
                iframe.contentWindow.postMessage({
                  type: BimehMessageType.NAVIGATE_TO_URL,
                  url
                }, 'https://digipay.bimeh.com');
                setTimeout(() => {
                  const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                  iframe.contentWindow.postMessage({
                    type: BimehMessageType.NAVIGATE_TO_URL,
                    url: returnUrl
                  }, 'https://digipay.bimeh.com');
                }, 4000);
                return;
              }
              this.isLoading.set(false);
            },
            error: error => {
              window.location.reload();
            }
          });
          break;
      }
    }
  };

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
}
