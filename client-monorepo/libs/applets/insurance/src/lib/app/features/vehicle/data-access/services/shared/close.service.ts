import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InsuranceNoticeComponent } from '../../../../../components/insurance-notice/insurance-notice.component';
import { DpxService } from '../../../../../data-access/services/dpx.service';
import { QueryParamService } from '../../../../../data-access/services/query-param.service';
import { BaseComponent } from '../../../../../components/base/base.component';
import { VehicleSharedService } from '../vehicle-shared.service';
import { StoreService } from '../../../features/third-party/data-access/services/store.service';
import { ThirdPartyKeysEnum } from '../../../features/third-party/data-access/enums/third-party-keys.enum';
import { MetricService } from '../../../../../data-access/services/metric.service';
import { EnvironmentService } from '@client-monorepo/app-core';
import { InsDigikalaService } from '../../../../../data-access/services/ins-digikala.service';
import { INSURANCE_APP_PREFIX } from '../../../../../data-access/constants/insurance-app-prefix.constant';

@Injectable({
  providedIn: 'root',
})
export class CloseService extends BaseComponent {
  constructor() {
    super();
  }

  private sharedService = inject(VehicleSharedService);
  private dialog = inject(MatDialog);
  private dpxService = inject(DpxService);
  private queryParamService = inject(QueryParamService);
  private storeService = inject(StoreService);
  private metricService = inject(MetricService);
  private digikalaService = inject(InsDigikalaService);
  private router = inject(Router);

  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  closeWithCheck(): void {
    this.addSubscription(
      this.dialog
        .open(InsuranceNoticeComponent, {
          data: {
            title: 'خروج از فرآیند خرید',
            text: 'آیا از خارج شدن فرایند خرید خود مطمئن هستید؟ ',
            activeButtonText: 'بله',
            deActiveButtonText: 'خیر',
          },
        })
        .afterClosed()
        .subscribe({
          next: (res) => {
            if (!res) {
              return;
            }
            this.close();
          },
        }),
    );
  }

  closeWithCheckQueryParam(): void {
    this.addSubscription(
      this.queryParamService.getQueryParams([ThirdPartyKeysEnum.NoCheck], false).subscribe({
        next: (param) => {
          if (param[ThirdPartyKeysEnum.NoCheck]) {
            this.close();
          } else {
            this.closeWithCheck();
          }
        },
      }),
    );
  }

  close(): void {
    this.storeService.setStoreData(null);
    if (this.dpxService.IsEnteredFromDpx) {
      this.metricService.sendMetric('BackToDpx', null, null);
      this.dpxService.goToDpxHome();
    } else if (this.dpxService.IsEnteredFromWebsite) {
      this.metricService.sendMetric('BackToWebsite', null, null);
      window.location.href = this.environment.website_url;
    } else if (this.digikalaService.isDigikala) {
      this.metricService.sendMetric('LocationBackDigikala', null, null);
      this.router.navigate(['/' + INSURANCE_APP_PREFIX]);
    } else {
      this.metricService.sendMetric('CloseApp', null, null);
      this.router.navigate(['/' + INSURANCE_APP_PREFIX]);
    }
  }

  onGoToHome(): void {
    if (this.dpxService.IsEnteredFromDpx) {
      this.dpxService.goToDpxHome();
    } else if (this.dpxService.IsEnteredFromWebsite) {
      window.location.href = this.environment.website_url;
    } else if (this.digikalaService.isDigikala) {
      const currentParams = this.activatedRoute.snapshot.queryParams;
      const params: { [key: string]: string } = {};
      if (currentParams.referrer) {
        params.referrer = currentParams.referrer;
      } else if (currentParams.utm_source) {
        params.utm_source = currentParams.utm_source;
      }
      this.router.navigate(['/mini-app/insurance'], {queryParams: params});
    }
  }
}
