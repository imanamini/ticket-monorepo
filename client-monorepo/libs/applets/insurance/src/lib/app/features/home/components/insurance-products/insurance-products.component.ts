import { Component, inject, OnInit, signal } from '@angular/core';
import { InsuranceProducts, InsuranceProductsEnum } from '../../data-access/constants/home.const';
import { NgOptimizedImage } from '@angular/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { InsuranceProductModel } from '../../data-access/models/insurance-product.model';
import { Router } from '@angular/router';
import { NgxIcon } from '@digipay/ngx-icon';
import { FeatureToggleService } from '../../../../data-access/services/feature-toggle.service';
import { EnvironmentService } from '@client-monorepo/app-core';
import { INSURANCE_APP_PREFIX } from '../../../../data-access/constants/insurance-app-prefix.constant';
import { InsDigikalaService } from '../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'insurance-products',
  standalone: true,
  imports: [NgOptimizedImage, NgxBadgeModule, NgxSkeletonLoadingComponent, NgxIcon],
  templateUrl: './insurance-products.component.html',
  styleUrl: './insurance-products.component.scss',
})
export class InsuranceProductsComponent implements OnInit {
  constructor() {}

  insuranceProducts = signal<InsuranceProductModel[]>([]);

  private router = inject(Router);
  private digikalaService = inject(InsDigikalaService);
  private featureToggleService = inject(FeatureToggleService);
  canRouteToFeature = false;

  ngOnInit(): void {
    this.insuranceProducts.set(
      EnvironmentService.env.insurance.name === 'production'
        ? InsuranceProducts.filter((z) => z.type !== InsuranceProductsEnum.Floki)
        : InsuranceProducts,
    );

    // Set initial value based on digikala condition
    if (this.digikalaService.isDigikala) {
      this.insuranceProducts.set(
        InsuranceProducts.filter((product) => ![InsuranceProductsEnum.USED, InsuranceProductsEnum.Floki].includes(product.type)),
      );
    }

    this.featureToggleService.featureToggle$.subscribe((feature) => {
      if (feature) {
        this.insuranceProducts.set(InsuranceProducts);
        this.canRouteToFeature = false;
      }
    });
  }

  navigate(product: InsuranceProductModel): void {
    if (this.canRouteToFeature) {
      return;
    }
    this.router.navigate([INSURANCE_APP_PREFIX + '/' + product.url]).then();
  }
}
