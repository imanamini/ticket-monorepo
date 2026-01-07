import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { WaitingPagesComponent } from '../../../../../../../../components/waiting-pages/waiting-pages.component';
import { ThirdPartyApiService } from '../../../../../../data-access/services/third-party/third-party-api.service';
import { QueryParamService } from '../../../../../../../../data-access/services/query-param.service';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { PaymentResultService } from '../../../../data-access/services/payment-result.service';
import { EnvironmentService } from '@client-monorepo/app-core';
import { PRODUCT_TYPE_BASE_URL } from '../../../../../../../../data-access/constants/product-type-base-url.constant';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ThirdPartyKeysEnum } from '../../../../data-access/enums/third-party-keys.enum';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';

@Component({
  selector: 'check-hybrid',
  standalone: true,
  imports: [NgxSpinnerModule, WaitingPagesComponent],
  templateUrl: './check-hybrid.component.html',
  styleUrl: './check-hybrid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckHybridComponent extends BaseComponent implements OnInit {
  private paymentResultService = inject(PaymentResultService);
  private queryParamService = inject(QueryParamService);
  private apiService = inject(ThirdPartyApiService);
  private sharedService = inject(VehicleSharedService);  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  constructor(

    ) {
    super();
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
            PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] +
            ThirdPartyUrlsEnum.PaymentResult +
            `?${[ThirdPartyKeysEnum.FormId]}=${orderData.applicationFormId}&${[ThirdPartyKeysEnum.Referrer]}=${orderData.referrer}`,
        );
      } else {
        window.location.assign(this.environment.domain_address + this.environment.base_href);
      }
      this.paymentResultService.removeOrderData();
    }, 1000);
  }
}
