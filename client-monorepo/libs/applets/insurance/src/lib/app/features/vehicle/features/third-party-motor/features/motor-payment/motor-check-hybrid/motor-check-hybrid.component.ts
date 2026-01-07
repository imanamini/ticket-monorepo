import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { WaitingPagesComponent } from '../../../../../../../components/waiting-pages/waiting-pages.component';
import { QueryParamService } from '../../../../../../../data-access/services/query-param.service';
import { BaseComponent } from '../../../../../../../components/base/base.component';
import { MotorStorePaymentDataService } from '../../../data-access/services/motor-store-payment-data.service';
import { ThirdPartyKeysEnum } from '../../../../third-party/data-access/enums/third-party-keys.enum';
import { EnvironmentService } from '@client-monorepo/app-core';
import { MotorApplicationFormApiService } from '../../../../../data-access/services/third-party-motor/motor-application-form-api.service';

@Component({
  selector: 'motor-check-hybrid',
  standalone: true,
  imports: [NgxSpinnerModule, WaitingPagesComponent],
  templateUrl: './motor-check-hybrid.component.html',
  styleUrl: './motor-check-hybrid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MotorCheckHybridComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  private paymentResultService = inject(MotorStorePaymentDataService);
  private queryParamService = inject(QueryParamService);
  private apiService = inject(MotorApplicationFormApiService);

  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  ngOnInit(): void {
    super.addSubscription(
      this.queryParamService.getQueryParams([ThirdPartyKeysEnum.ProviderId]).subscribe(
        (providerId) => {
          this.init(providerId[ThirdPartyKeysEnum.ProviderId]);
        },
        (error) => {
          console.error(error);
        },
      ),
    );
  }

  private init(providerId: string): void {
    this.apiService.checkHybrid(providerId).subscribe(
      (response) => {
        // delay for load gtag script and show go to digipay message
        setTimeout(() => {
          if (response?.result) {
            const orderData = this.paymentResultService.getOrderData();
            window.history.pushState(null, '', null);
            window.location.assign(response.result + (orderData?.referrer ? `&${ThirdPartyKeysEnum.Referrer}=${orderData.referrer}` : ''));
            this.paymentResultService.removeOrderData();
          } else {
            this.callbackRoute();
          }
        }, 1000);
      },
      () => this.callbackRoute(),
    );
  }

  private callbackRoute(): void {
    // delay for load gtag script and show go to digipay message
    setTimeout(() => {
      const orderData = this.paymentResultService.getOrderData();
      if (orderData) {
        window.location.assign(
          (orderData.isHybrid ? this.environment.schema_address : this.environment.domain_address) +
            this.environment.base_href +
            '/vehicle/third-party-motor/payment/result' +
            `?${[ThirdPartyKeysEnum.FormId]}=${orderData.applicationFormId}${orderData.referrer ? `&${[ThirdPartyKeysEnum.Referrer]}=${orderData.referrer}` : ''}`,
        );
      } else {
        window.location.assign(this.environment.domain_address + this.environment.base_href);
      }
      this.paymentResultService.removeOrderData();
    }, 1000);
  }
}
