import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThirdPartyCarouselFields } from '../../data-access/models/third-party-carousel.model';
import { AutoLoopHorizontalScrollComponent, DeferPlaceHolderComponent } from '@client-monorepo/common/ui-components';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ThirdPartyCarouselService } from '../../data-access/services/third-part-carousel.service';
import { THIRD_PARTY_CAROUSEL_Config } from '../../data-access/constants/third-party-carousel.constant';
import { ThirdPartyCarouselProductComponent } from '../third-party-carousel-product/third-party-carousel-product.component';
import { finalize } from 'rxjs';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { BannerService, generateUUID, getHostname, PerformanceTierService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'common-stores-third-party-carousel',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    NgxButtonComponent,
    ThirdPartyCarouselProductComponent,
    AutoLoopHorizontalScrollComponent,
    NgxSkeletonLoadingComponent,
    DeferPlaceHolderComponent,
  ],
  templateUrl: './third-party-carousel.component.html',
  styleUrl: './third-party-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ThirdPartyCarouselService],
})
export class ThirdPartyCarouselComponent implements OnInit {
  // Injections
  actionHandler = inject(ActionHandlerService);
  thirdPartyCarouselService = inject(ThirdPartyCarouselService);
  eventManager = inject(EventManagementService);
  host = inject(ElementRef<HTMLElement>);
  bannerService = inject(BannerService);

  // Inputs
  storeName = input.required<keyof typeof THIRD_PARTY_CAROUSEL_Config>();
  title = input<string>();
  subtitle = input<string>();
  url = input<string | undefined>(undefined);
  shouldCautiousAboutPerformance = input(false);

  // Variables
  fields = signal<ThirdPartyCarouselFields | undefined>(undefined);
  timer = signal({
    hours: '',
    minutes: '',
    seconds: '',
  });
  isLoading = signal(true);
  isPaused = signal(false);
  color = computed(() => (this.storeName() ? THIRD_PARTY_CAROUSEL_Config[this.storeName()].color : ''));
  private pauseTimer: any;
  performanceTierService = inject(PerformanceTierService);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');
  isInViewport = computed(() => {
    if (this.bannerService.isInViewport()) {
      return this.bannerService.isInViewport()[this.uniqId] ?? false;
    }
    return false;
  });

  removeFromDom = output<void>();

  uniqId = generateUUID();

  constructor() {
    effect(
      () => {
        if (this.fields() && this.fields()!.endtime) {
          this.computeTimer();
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.initializeCarousel();
    if (this.shouldCautiousAboutPerformance()) {
      this.observeIntersection();
    }
  }

  initializeCarousel() {
    this.thirdPartyCarouselService
      .transformer(this.storeName())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (config) => {
          this.fields.set(config);
        },
        error: () => {
          this.fields.set(undefined);
          this.removeFromDom.emit();
        },
      });
  }

  observeIntersection(): void {
    this.host.nativeElement.setAttribute('id', this.uniqId);
    this.bannerService.initialIntersectionObserver(this.host.nativeElement);
  }

  computeTimer(): void {
    let remainingTime = this.fields()!.endtime! - Date.now();
    const interval = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(interval);
        return;
      }

      remainingTime -= 1000;
      const timer = this.convertMsToTimeParts(remainingTime);
      this.timer.set(timer);
    }, 1000);
    this.timer.set({
      hours: '',
      minutes: '',
      seconds: '',
    });
  }

  convertMsToTimeParts(ms: number) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    if (days > 1) {
      return {
        hours: '',
        minutes: '',
        seconds: '',
      };
    }
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      days: days.toString().padStart(2, '0'),
    };
  }

  redirectToThirdPartyWebsite() {
    const redirectUrl = this.url() ? this.url() : this.fields()?.redirectUrl;
    if (redirectUrl) {
      this.sendRedirectEvent(redirectUrl);
      this.actionHandler.handle({
        type: ActionType.REDIRECT,
        payload: {
          type: RedirectionTypeEnum.blank,
          url: redirectUrl,
          params: {
            external: true,
            'dp-source': 'DP',
            'dp-medium': 'third-party-carousel',
            'dp-type': 'merchant',
          },
        },
      });
    }
  }

  sendRedirectEvent(redirectUrl: string): void {
    this.eventManager.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: getHostname(redirectUrl),
          to: redirectUrl,
        },
        meta: `storeName:${this.storeName()}`,
        breadCrumbs: ['stores', 'third-party-carousel'],
      },
      true,
    );
  }

  onItemHold() {
    clearTimeout(this.pauseTimer);
    this.isPaused.set(true);
    this.pauseTimer = setTimeout(() => {
      this.isPaused.set(false);
    }, 3000);
  }

  onItemRelease(): void {
    clearTimeout(this.pauseTimer);
    this.isPaused.set(false);
  }
}
