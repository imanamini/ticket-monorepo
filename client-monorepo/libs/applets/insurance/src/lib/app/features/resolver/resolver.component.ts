import { Component, inject, OnInit } from '@angular/core';
import { LoginService } from '../../data-access/services/user-services/login.service';
import { MetricService } from '../../data-access/services/metric.service';
import { ResolverService } from './data-access/services/resolver.service';
import { IResolverModel } from './data-access/models/resolver.model';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { Router } from '@angular/router';
import { ReferrerService } from '../../data-access/services/referrer.service';
import { ReferrerEnum } from '../../data-access/enums/referrer.enum';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { LandingProviderEnum } from '../../data-access/enums/landing-provider.enum';
import { PRODUCT_TYPE_BASE_URL } from '../../data-access/constants/product-type-base-url.constant';
import { InsuranceProductTypeEnum } from '../../data-access/enums/Insurance-product-type.enum';
import { InsDigikalaService } from '../../data-access/services/ins-digikala.service';

@Component({
  selector: 'resolver',
  standalone: true,
  imports: [NgxSpinnerModule],
  templateUrl: './resolver.component.html',
  styleUrl: './resolver.component.scss',
})
export class ResolverComponent implements OnInit {
  private readonly loginService = inject(LoginService);
  private readonly resolverService = inject(ResolverService);
  private readonly metricService = inject(MetricService);
  private readonly digikalaService = inject(InsDigikalaService);
  private readonly referrerService = inject(ReferrerService);
  private readonly ngxHybridServiceService = inject(NgxHybridServiceService);
  private readonly router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.metricService.resolverServiceMetric('resolverInit', null);
    if (this.digikalaService.isDigikala || this.referrerService.referrer === ReferrerEnum.ONSITE) {
      this.router.navigate([PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty]]);
      return;
    }
    if (!this.loginService.isLoggedIn) {
      this.loginService.routeToLoginPage();
    } else {
      this.resolverService.getStateResolver().subscribe({
        next: (res: IResolverModel) => {
          switch (res.provider) {
            case LandingProviderEnum.Digipay:
              this.router.navigate([PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty]]);
              break;
            case LandingProviderEnum.Bimeh:
            case LandingProviderEnum.BimehBazar:
            default:
              if (this.ngxHybridServiceService.isHybrid()) {
                this.ngxHybridServiceService.openUrlInHybrid(res.url, true);
              } else {
                window.location.assign(res.url);
              }
              break;
          }
        },
      });
    }
  }
}
