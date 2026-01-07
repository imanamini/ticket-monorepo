import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, Renderer2, signal } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { DigikalaService } from '@client-monorepo/pillar/digikala';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { AppNameService } from '@client-monorepo/common/utilities';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

enum CreditUsageLinkEnum {
  WEBVIEW,
  OPEN_EXTERNAL,
  OPEN_LINK,
}

@Component({
  selector: 'pillar-applet-credit-usage-list',
  standalone: true,
  imports: [NgxDividerComponent, NgxSkeletonLoadingComponent, HorizontalScrollComponent],
  templateUrl: './credit-usage-list.component.html',
  styleUrl: './credit-usage-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditUsageListComponent implements AfterViewInit, OnDestroy {
  private digikalaService = inject(DigikalaService);
  private eventService = inject(NgxEventTrackerService);
  private appNameService = inject(AppNameService);

  // Whether any active wallet exists (true) or not (false). When undefined, it means not decided yet.
  isAnyActiveWallet = input<boolean | undefined>(undefined);
  // Loading flag to show skeleton until API resolves
  loading = input<boolean>(true);
  readonly visibleCards = signal<number>(3.25);
  readonly body = signal<HTMLElement | null>(null);
  renderer = inject(Renderer2);

  // carousel index for active wallet usages
  carouselIndex = signal(0);
  private autoSwipeTimeout1?: number;
  private autoSwipeTimeout2?: number;

  usages = signal([
    {
      id: 'DigikalaOnline',
      title: 'خرید آنلاین دیجی‌کالا',
      description: 'خرید آسان و اعتباری از فروشگاه آنلاین دیجی‌کالا',
      icon: 'buy-online-dk',
    },
    {
      id: 'DigikalaBranch',
      title: 'خرید از شعب حضوری دیجی‌کالا',
      description: 'خریدی مطمئن در فروشگاه حضوری دیجی‌کالا',
      icon: 'buy-dk-branch',
    },
    {
      id: 'Gold',
      title: 'خرید طلای دیجیتال',
      description: 'سرمایه‌گذاری امن، سریع و آنلاین در طلای آب‌شده',
      icon: 'buy-digital-gold',
    },
    {
      id: 'Supermarket',
      title: 'خرید از سوپرمارکت',
      description: 'خرید روزانه با تخفیف و ارسال سریع',
      icon: 'digikala-fresh',
    },
  ]);

  usagesActivate = computed(() => {
    const isIOS = this.digikalaService.getPlatform() === 'ios';
    const isWeb = this.digikalaService.getPlatform() === 'web';
    return [
      {
        id: 'DigikalaOnline',
        title: 'دیجی‌کالا',
        icon: 'buy-online-dk',
        link: 'https://www.digikala.com',
        type: CreditUsageLinkEnum.OPEN_LINK,
      },
      {
        id: 'DigikalaBranch',
        title: 'دیجی‌کالا حضوری',
        icon: 'buy-dk-branch',
        link: 'https://about.digikala.com/digikala-shop/',
        type: CreditUsageLinkEnum.WEBVIEW,
      },
      {
        id: 'Gold',
        title: 'خرید طلا',
        icon: 'buy-digital-gold',
        link: isIOS
          ? 'digikala://www.digikala.com/superapp/gold'
          : isWeb
            ? 'https://www.digikala.com/wealth/my-assets/?utm_source=digikala-superweb'
            : 'https://www.digikala.com/superapp/gold',
        type: CreditUsageLinkEnum.OPEN_LINK,
      },
      {
        id: 'Supermarket',
        title: 'سوپرمارکت',
        icon: 'digikala-fresh',
        link: isIOS
          ? 'digikala://www.digikala.com/superapp/supermarket'
          : isWeb
            ? 'https://www.digikala.com/fresh/?utm_source=digikala-superweb'
            : 'https://www.digikala.com/superapp/supermarket',
        type: CreditUsageLinkEnum.OPEN_LINK,
      },
      {
        id: 'Jet',
        title: '۴۵ دقیقه‌ای',
        icon: 'digikala-jet',
        link: isIOS
          ? 'digikala://www.digikala.com/superapp/jet'
          : isWeb
            ? 'https://api.digikala.com/super-app/v1/sso/jet/?redirect_url=%2F%3Futm_source%3Ddigikala-superweb'
            : 'https://www.digikala.com/superapp/jet',
        type: CreditUsageLinkEnum.OPEN_LINK,
      },
    ];
  });
  protected readonly BorderColorsEnum = BorderColorsEnum;

  ngAfterViewInit(): void {
    // Auto swipe once per session to hint there are more items by revealing the last item, then return back.
    const visibleCount = 2.5; // must be in sync with [visibleItemCount] in template
    const total = this.usagesActivate().length;

    // Only run when there are more items than visible at once
    if (total > visibleCount) {
      // Respect once-per-session behavior using sessionStorage
      let shouldRun = true;
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          shouldRun = window.sessionStorage.getItem('pillarCreditUsageAutoSwipeDone') === '1';
        }
      } catch {
        // If sessionStorage is not accessible, fall back to run once (no persistence)
        shouldRun = true;
      }

      if (!shouldRun) {
        return;
      }

      const targetIndex = Math.max(0, total - visibleCount);
      // Let the view render first
      this.autoSwipeTimeout1 = window.setTimeout(() => {
        // Mark as done for this session so it won't run again
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem('pillarCreditUsageAutoSwipeDone', '1');
          }
        } catch {
          /* empty */
        }

        this.carouselIndex.set(targetIndex);
        // Return to default after a short delay
        this.autoSwipeTimeout2 = window.setTimeout(() => {
          this.carouselIndex.set(0);
        }, 1000);
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.autoSwipeTimeout1) window.clearTimeout(this.autoSwipeTimeout1);
    if (this.autoSwipeTimeout2) window.clearTimeout(this.autoSwipeTimeout2);
  }

  openLink(link: string, type: CreditUsageLinkEnum, title: string, id?: string): void {
    // Track purchase card click event
    if (this.appNameService.isPillar() && id) {
      this.eventService.sendEvent({
        eventName: `Pillar_PurchaseCard${id}Click`,
        eventData: {},
      });
    }

    switch (type) {
      case CreditUsageLinkEnum.WEBVIEW:
        this.digikalaService.gotoWebViewAction(link, title);
        break;
      case CreditUsageLinkEnum.OPEN_EXTERNAL:
        this.digikalaService.openExternalLink(link);
        break;
      case CreditUsageLinkEnum.OPEN_LINK:
        this.digikalaService.openLink(link);
        break;
    }
  }
}
