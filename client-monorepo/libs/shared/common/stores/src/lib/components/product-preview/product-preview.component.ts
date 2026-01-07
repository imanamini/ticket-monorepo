import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInterface } from '../../data-access/models/product.interface';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ProductApiService } from '../../data-access/services/product-api.service';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { StorePaymentMethod } from '../../data-access/models/store.type';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { NgxIcon } from '@digipay/ngx-icon';
import { LogoWithRateComponent } from '../logo-with-rate/logo-with-rate.component';
import { PaymentMethodBadgesComponent } from '../payment-method-badges/payment-method-badges.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { CheckPointNamesEnum, LayoutService, PerformanceTierService, SafePressDirective } from '@client-monorepo/common/utilities';
import { ProductPreviewSizeVariantsModel } from '../../data-access/models/product-preview-size-variants.model';
import { RecentlyViewedService } from '../../data-access/services/recently-viewed.service';

@Component({
  selector: 'common-stores-product-preview',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    PipesModule,
    NgxSkeletonLoadingComponent,
    NgxBadgeModule,
    NgxIcon,
    LogoWithRateComponent,
    PaymentMethodBadgesComponent,
    NgxDividerComponent,
    SafePressDirective,
  ],
  templateUrl: './product-preview.component.html',
  styleUrl: './product-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPreviewComponent implements OnInit, OnDestroy {
  performanceTierService = inject(PerformanceTierService);
  productApiService = inject(ProductApiService);
  layoutService = inject(LayoutService);
  recentlyViewedService = inject(RecentlyViewedService);

  classes = input<string>('');
  product = input<ProductInterface>({} as ProductInterface);
  mode = input<'full' | 'img-desc' | 'img-desc-with-store'>('full');
  isLoading = input<boolean>(false);
  backgroundMode = input<'elevated' | 'back'>('elevated');
  priceUnit = input<string>('تومان');
  clicked = output<ProductInterface>();
  queryId = input<string | undefined>();
  position = input<string | number | undefined>();
  size = input<'large' | 'medium' | 'compact'>('large');
  hasDivider = input<boolean>(false);
  hasInstallment = input<boolean>(false);
  showScore = input(true);
  shouldCautiousAboutPerformance = input(false);
  isInViewport = signal(true);

  productImageSrc = signal<string>('');
  installmentPrice = computed<number>(() => Number(this.product().price) / 4);
  showInstallment = computed<boolean>(() => (this.size() === 'large' || this.size() === 'compact') && this.hasInstallment());
  showStoreName = computed(() => this.size() !== 'compact');
  previousPrice = computed(() => {
    if (this.product().previousPrice) {
      return Number(this.product().previousPrice);
    }
    return this.product().discount && this.product().price ? Number(this.product().price) + (this.product().discount ?? 0) : 0;
  });
  offPercent = computed(() => {
    let percent = 0;
    if (this.product().discountPercent) {
      percent = Number(this.product().discountPercent);
    } else {
      percent = this.previousPrice() > 0 ? Math.round((100 * (this.product().discount ?? 0)) / this.previousPrice()) : 0;
    }
    return percent > 0 ? `${percent} %` : '';
  });
  titleLimit = computed(() => {
    return this.hasPaymentMethods() ? 30 : 40;
  });
  sizeVariants = computed<ProductPreviewSizeVariantsModel>(() => this.generateSizeVariants());
  bgClasses = computed<{ regular: string; reverse: string }>(() => this.generateBgClasses());
  loadingEffect = computed(() => this.performanceTierService.tier() === 'high' && this.isInViewport());
  productContentSub: Subscription = new Subscription();
  checkPoint: CheckPointNamesEnum = this.layoutService.whatIsTheCheckPoint(this.layoutService.initialWindowWidth);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  observer!: IntersectionObserver;
  element = inject(ElementRef<HTMLElement>);

  constructor() {
    this.productContentSub.add(
      toObservable(this.product).subscribe({
        next: (product: ProductInterface) => {
          if (product.resizedImage) {
            this.productImageSrc.set(product.resizedImage as string);
          } else if (product.image) {
            this.productImageSrc.set(this.product().image);
          } else {
            this.handleImageError();
          }
        },
      }),
    );
  }

  ngOnInit() {
    this.listenToCheckPoints();
    if (this.shouldCautiousAboutPerformance()) {
      this.initiateIntersectionObserver();
    }
  }

  initiateIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          this.isInViewport.set(true);
        } else {
          this.isInViewport.set(false);
        }
      },
      {
        root: this.layoutService.scrollContainer,
        rootMargin: '100px',
      },
    );
    this.observer.observe(this.element.nativeElement);
  }

  listenToCheckPoints(): void {
    this.productContentSub.add(
      this.layoutService.onCheckPointChange().subscribe((checkPoints) => {
        this.checkPoint = checkPoints;
      }),
    );
  }

  handleImageError(): void {
    this.productImageSrc.set(
      this.backgroundMode() === 'elevated'
        ? 'assets/fallback/product-on-elevated-fallback.png'
        : 'assets/fallback/product-on-back-fallback.png',
    );
  }

  hasPaymentMethods = computed(() => {
    return (
      this.product().storePaymentMethods &&
      (this.product().storePaymentMethods?.indexOf(StorePaymentMethod.BNPL) !== -1 ||
        this.product().storePaymentMethods?.indexOf(StorePaymentMethod.C_CREDIT) !== -1)
    );
  });

  paymentMethods = computed(() => {
    const methods: { name: string; icon: string }[] = [];
    if (this.hasPaymentMethods()) {
      if (this.product().storePaymentMethods && this.product().storePaymentMethods?.indexOf(StorePaymentMethod.C_CREDIT) !== -1) {
        methods.push({
          name: 'وام',
          icon: 'credit',
        });
      }
      if (this.product().storePaymentMethods && this.product().storePaymentMethods?.indexOf(StorePaymentMethod.BNPL) !== -1) {
        methods.push({
          name: 'اعتبار',
          icon: 'bnpl',
        });
      }
    }
    return methods;
  });

  generateSizeVariants(): ProductPreviewSizeVariantsModel {
    if (this.size() === 'large') {
      return {
        wrapperClasses: 'large-product',
        storeNameClasses: 'l-2 mt-small mb-tiny',
        imageWrapperClasses: '',
        productTitleClasses: 'c-2 mb-minus',
        productPriceClasses: 'st-6',
        installmentPrice: 'st-8',
        installmentUnit: 'l-4',
        installmentBadgeSize: '28px',
        installmentBadgeTitleFont: '12px',
        installmentBadgeTitleHeight: '6px',
        installmentBadgeSubtitleFont: '8px',
        installmentBadgeSubtitleHeight: '6px',
        badgeSize: 'btnBadge',
        badgeFontSize: '12px',
        titleHeight: '40px',
      };
    } else if (this.size() === 'medium') {
      return {
        wrapperClasses: 'small-product',
        storeNameClasses: 'l-4 mt-low mb-atom',
        imageWrapperClasses: '',
        productTitleClasses: 'l-2 mb-micro',
        productPriceClasses: 'c-1',
        installmentPrice: 'st-8',
        installmentUnit: 'l-4',
        installmentBadgeSize: '28px',
        installmentBadgeTitleFont: '12px',
        installmentBadgeTitleHeight: '6px',
        installmentBadgeSubtitleFont: '8px',
        installmentBadgeSubtitleHeight: '6px',
        badgeSize: 'tiny',
        badgeFontSize: '10px',
        titleHeight: '35px',
      };
    } else {
      return {
        wrapperClasses: 'compact-product gap-low',
        storeNameClasses: '',
        imageWrapperClasses: 'w-100',
        productTitleClasses: 'my-tiny text-ellipsis ' + this.checkPointDecider(['c-2', 'b-2', 'b-1']),
        productPriceClasses: this.checkPointDecider(['st-6', 'st-4', 'st-2']),
        badgeSize: 'sm',
        installmentPrice: this.checkPointDecider(['st-8', 'st-2', 'st-2']),
        installmentUnit: this.checkPointDecider(['l-4', 'c-2', 'c-2']),
        installmentBadgeSize: this.checkPointDecider(['28px', '48px', '48px']),
        installmentBadgeTitleFont: this.checkPointDecider(['12px', '16px', '16px']),
        installmentBadgeSubtitleFont: this.checkPointDecider(['8px', '12px', '12px']),
        installmentBadgeTitleHeight: this.checkPointDecider(['6px', '10px', '10px']),
        installmentBadgeSubtitleHeight: this.checkPointDecider(['6px', '10px', '10px']),
        badgeFontSize: '12px',
        titleHeight: '',
      };
    }
  }

  checkPointDecider(values: string[]): string {
    // ORDER OF THE VALUES SHOULD BE 'SMALL - MEDIUM - LARGE'
    if (values.length < 3) return '';
    return this.checkPoint === CheckPointNamesEnum.SM ? values[0] : this.checkPoint === CheckPointNamesEnum.MD ? values[1] : values[2];
  }

  generateBgClasses(): any {
    const isElevated = this.backgroundMode() === 'elevated';
    if (this.size() !== 'compact') {
      return {
        regular: isElevated ? 'surface-elevated' : 'surface-back',
        reverse: isElevated ? 'surface-back' : 'surface-elevated',
      };
    } else {
      return {
        regular: isElevated ? '' : '',
        reverse: isElevated ? 'surface-back' : 'surface-elevated',
      };
    }
  }

  handleClick(): void {
    if (this.queryId() !== undefined && this.position() !== undefined && this.product().documentId && !this.isLoading()) {
      this.productApiService.clickOnProduct(this.product().documentId, this.queryId() ?? '', this.position() ?? '').subscribe();
    }
    this.recentlyViewedService.addRecentlyViewedProduct(this.product());
    this.clicked.emit(this.product());
  }

  ngOnDestroy(): void {
    if (this.productContentSub) {
      this.productContentSub.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
