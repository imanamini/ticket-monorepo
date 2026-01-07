import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { ApiImageComponent } from '@digipay/ng-ui-api-image';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import {
  getHostname,
  PerformanceTierService,
  TopMerchantCarousel, TopMerchantSlide
} from '@client-monorepo/common/utilities';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';
import { TopMerchantBadges } from '../../data-access/constants/top-merchant-badges.constant';
import { NgOptimizedImage } from '@angular/common';
import { ProductInterface, Store } from '@client-monorepo/stores';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { Router } from '@angular/router';
import { RateCountComponent } from '@client-monorepo/common/rate';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'common-app-banners-top-merchant-carousel',
  standalone: true,
  templateUrl: './top-merchant-carousel.component.html',
  imports: [
    ApiImageComponent,
    HorizontalScrollComponent,
    TitleSummaryComponent,
    NgxBadgeModule,
    NgxIcon,
    NgOptimizedImage,
    RateCountComponent,
    PipesModule
  ],
  styleUrl: 'top-merchant-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMerchantCarouselComponent implements OnInit {
  private performanceTierService = inject(PerformanceTierService);
  private router = inject(Router);
  private readonly eventManagement = inject(EventManagementService);
  private readonly actionHandler = inject(ActionHandlerService);

  banner = input.required<TopMerchantCarousel>();
  nothingToShow = output<boolean>();

  slides = signal<TopMerchantSlide[]>([]);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');
  protected readonly TopMerchantBadges = TopMerchantBadges;

  ngOnInit(): void {
    this.checkSlides();
  }

  handleProductClicked(product: ProductInterface, event: Event): void {
    event.stopPropagation();
    this.eventManagement.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: getHostname(product.url),
          to: product.url,
        },
        meta: '',
        breadCrumbs: ['recently-viewed', 'product'],
      },
      true,
    );
    this.actionHandler.handle({
      type: ActionType.REDIRECT,
      payload: {
        type: RedirectionTypeEnum.blank,
        url: product.url,
        params: {
          'dp-source': 'DP',
          'dp-medium': 'merchant',
          'dp-type': 'product',
        },
      },
    });
  }

  handleStoreClicked(store: Store): void {
    this.router.navigate(['/stores', store.trackingCode]);
  }

  checkSlides(): void {
    const output: TopMerchantSlide[] = [];
    this.banner().slides.forEach((slide: TopMerchantSlide) => {
      const data = slide.extractedData;
      if (data.products.length < 4) {
        return;
      }
      output.push(slide);
    });
    this.slides.set([...output].sort((a, b) => a.order - b.order));
    if (this.slides().length < 2) {
      this.nothingToShow.emit(true);
    }
  }
}
