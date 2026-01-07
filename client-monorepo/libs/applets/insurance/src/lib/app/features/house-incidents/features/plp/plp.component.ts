import { Component, inject, NgZone, OnInit, signal } from '@angular/core';
import { MainHeaderComponent } from '../../../../components/main-header/main-header.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { HouseIncidentProductCardModel } from './data-access/models/house-incident-product-card.model';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import {
  ProductCardCoverageDetailBottomSheetModel
} from './data-access/models/product-card-coverage-detail-bottom-sheet.model';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import {
  ProductCardCoverageDetailBottomSheetComponent
} from './components/product-card-coverage-detail-bottom-sheet/product-card-coverage-detail-bottom-sheet.component';
import { BaseComponent } from '../../../../components/base/base.component';
import { HouseIncidentsApiService } from '../../data-access/services/house-incidents-api.service';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { HouseIncidentsDataStorageService } from '../../data-access/services/house-incidents-data-storage.service';
import { Router } from '@angular/router';
import { MetricService } from '../../../../data-access/services/metric.service';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { DpxService } from '../../../../data-access/services/dpx.service';
import {
  HouseIncidentsStepperComponent
} from '../../components/house-incidents-stepper/house-incidents-stepper.component';
import {
  InsurancePromotionComponent
} from '../../../../components/insurance-promotion/insurance-promotion.component';
import { InsurancePromotionModel } from '../../../home/data-access/models/insurance-promotion.model';
import { HouseIncidentsActionService } from '../../data-access/services/house-incidents-action.service';
import { PolicyUserInfoModel } from '../complete-journey/model/policy-user-info.model';
import { FaqCategoryTypeEnum } from '../../../../data-access/enums/faq-category-type.enum';
import { CloseService } from '../../../vehicle/data-access/services/shared/close.service';
import { AuthService } from '@client-monorepo/common/user';
import { LoginService } from '../../../../data-access/services/user-services/login.service';

@Component({
  selector: 'plp',
  standalone: true,
  imports: [
    MainHeaderComponent,
    ProductCardComponent,
    NgxSkeletonLoadingComponent,
    HouseIncidentsStepperComponent,
    InsurancePromotionComponent,
  ],
  templateUrl: './plp.component.html',
  styleUrl: './plp.component.scss',
  providers: [SeparateThousandsPipe, HouseIncidentsDataStorageService],
})
export class PlpComponent extends BaseComponent implements OnInit {
  public dpxService = inject(DpxService);
  private closeService = inject(CloseService);
  productCards = signal<HouseIncidentProductCardModel[]>([]);
  promotions = signal<InsurancePromotionModel[]>([
    {
      icon: 'insurance-assets/images/home/house-incident.png',
      title: 'پوشش بحران‌های واقعی',
      description: 'خسارت‌های ناشی از آتش‌سوزی، زلزله، سیل، انفجار، بمباران و حتی جنگ رو بدون نگرانی جبران کن.',
    },
    {
      icon: 'insurance-assets/images/home/bnpl.png',
      title: 'پرداخت اعتباری در ۴ قسط',
      description: 'بیمه‌نامه‌ات رو همین حالا بگیر و بدون چک و سفته، هزینه‌ش رو به‌صورت اعتباری در ۴ قسط پرداخت کن.',
    },
    {
      icon: 'insurance-assets/images/home/fast.png',
      title: 'صدور آنی و بدون بازدید',
      description: 'بدون نیاز به بازدید، فقط با چند کلیک بیمه‌نامه‌ات صادر شده و قابل استفاده خواهد بود.',
    },
  ]);

  protected readonly FaqCategoryTypeEnum = FaqCategoryTypeEnum;

  private bottomSheetService = inject(BottomSheetService);
  private apiHouseIncidentsService = inject(HouseIncidentsApiService);
  public thousandsPipe = inject(SeparateThousandsPipe);
  public hybridService = inject(NgxHybridService);
  public router = inject(Router);
  private houseIncidentsActionService = inject(HouseIncidentsActionService);
  private houseIncidentsDataStorageService = inject(HouseIncidentsDataStorageService);
  private applicationFormId: string | null = null;
  ngZone = inject(NgZone);
  metricService = inject(MetricService);
  private authService = inject(AuthService)
  private loginService = inject(LoginService)

  ngOnInit(): void {
    this.sendOnLoadMetric();
    this.setApplicationFormId();
    this.loadProducts();
  }

  sendOnLoadMetric(): void {
    this.ngZone.runOutsideAngular(() => {
      this.metricService.sendRouteChangeMetrics();
    });
  }

  setApplicationFormId(): void {
    this.applicationFormId = this.houseIncidentsDataStorageService.getApplicationFormId();
  }

  private loadProducts(): void {
    this.apiHouseIncidentsService.getProducts(this.applicationFormId).subscribe({
      next: (products) => {
        this.productCards.set(products.result?.data);
        this.handlePrePaymentFragment();
      },
      error: () => {
        this.houseIncidentsDataStorageService.removeApplicationFormId();
        this.router.navigate(['/'], {relativeTo: this.activatedRoute});
      },
    });
  }

  handlePrePaymentFragment(): void {
    if (this.activatedRoute.snapshot.fragment === this.apiHouseIncidentsService.FRAGMENT_PREPAYMENT) {
      if (this.applicationFormId) {
        this.apiHouseIncidentsService.getPolicyUserInfo(this.applicationFormId).subscribe({
          next: (response) => {
            const productCardDetail = response.result.data;
            const orderDetail = response.result;
            this.orderProduct(productCardDetail, orderDetail);
          },
        });
      } else {
        this.removeFragment();
      }
    }
  }

  productCardCoverageDetailClicked(productCard: HouseIncidentProductCardModel): void {
    const coverageDetail: ProductCardCoverageDetailBottomSheetModel = {
      title: productCard.title,
      sections: [
        {
          title: 'سقف پوشش',
          details: productCard.accidentCoverageDetails.map((detail) => ({
            title: detail.title,
            value: this.thousandsPipe.transform(detail.amount) + ' ریال ',
          })),
        },
        {
          title: 'خطرات تحت پوشش',
          details: [
            {
              title: productCard.description,
            },
          ],
        },
      ],
    };

    this.bottomSheetService.open(
      BottomSheetBoxComponent,
      {
        component: ProductCardCoverageDetailBottomSheetComponent,
        name: 'ProductCardCoverageDetailBottomSheetComponent',
        data: {
          coverageDetail,
        },
      },
      {
        showHolderIcon: true,
      },
    );
  }

  orderProduct(productCard: HouseIncidentProductCardModel, orderDetail?: PolicyUserInfoModel): void {
    if (!this.authService.isLoggedIn()) {
      this.addFragmentToOpenModal({
        plan: productCard.plan,
      }).then(() => {
        this.loginService.routeToLoginPage();
      });
      return;
    }
    this.houseIncidentsActionService.orderProduct(productCard, this.applicationFormId, orderDetail);
  }

  private addFragmentToOpenModal(queryParam: { plan: string }): Promise<boolean> {
    return this.router.navigate([], {
      queryParams: queryParam,
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

  public backButtonClicked(): void {
    this.closeService.close();
  }
}
