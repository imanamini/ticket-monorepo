import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BottomNavigationItemInterface, NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { TransactionsApiService } from '@client-monorepo/payment/transactions';
import { AppNameService } from '@client-monorepo/common/utilities';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CampaignService } from '@client-monorepo/campaign';
import { filter } from 'rxjs/operators';
import { EventManagementService } from '@client-monorepo/common/event-management';

interface BottomNavigationItemWithId extends BottomNavigationItemInterface {
  id?: string;
}

@Component({
  selector: 'dpx-with-navigation',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './with-navigation.component.html',
  styleUrl: './with-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WithNavigationComponent implements OnInit {
  bottomNavigationService = inject(NgxBottomNavigationService);
  transactionApiService = inject(TransactionsApiService);
  appNameService = inject(AppNameService);
  eventTrackerService = inject(NgxEventTrackerService);
  eventManagementService = inject(EventManagementService);
  router = inject(Router);
  paymentBadge = signal<string | undefined>(undefined);
  untilDestroy = inject(DestroyRef);
  navigationItems = computed<Array<BottomNavigationItemWithId>>(() => {
    let storeBadge: Partial<BottomNavigationItemInterface> = {
      iconBadge: {
        icon: {
          name: 'discount',
          type: 'due',
          secondaryColor: '#F9441F',
          size: '16px',
        },
        badge: {
          size: 'sm',
          status: 'error',
          hasCircularIcon: true,
        },
      },
    };
    if (CampaignService.isAuctionMode()) {
      storeBadge = {
        motionSlide: [
          {
            type: 'badge',
            value: 'حراج',
          },
          {
            type: 'icon',
            value: 'discount',
          },
        ],
      };
    }
    let items: BottomNavigationItemWithId[] = [];
    if (this.appNameService.isDpx()) {
      items = items.concat([
        {
          title: 'خدمات',
          icon: 'more',
          route: '/hub',
        },
        {
          title: 'فروشگاه‌ها',
          icon: 'bag',
          route: '/stores',
          ...storeBadge,
        },
        {
          title: 'پرداخت',
          icon: 'card-to-card',
          route: '/transactions',
          badge: this.paymentBadge(),
        },
        {
          title: 'پروفایل',
          icon: 'person',
          route: '/profile',
        },
      ]);
    } else if (this.appNameService.isPillar()) {
      items = items.concat([
        {
          id: 'home',
          title: 'خانه',
          icon: 'home',
          route: '/home',
        },
        {
          id: 'installments',
          title: 'اقساط',
          icon: 'calendar-time',
          route: '/service/credit/installments-overview',
          badge: this.paymentBadge(),
        },
        {
          id: 'transactions',
          title: 'تراکنش',
          icon: 'transaction',
          route: '/transactions/report/history',
        },
        {
          id: 'profile',
          title: 'پروفایل',
          icon: 'person',
          route: '/profile',
        },
      ]);
    } else {
      items = items.concat([
        {
          title: 'خدمات',
          icon: 'more',
          route: '/hub',
        },
        {
          title: 'پرداخت',
          icon: 'card-to-card',
          route: '/transactions',
          badge: this.paymentBadge(),
        },
        {
          title: 'پروفایل',
          icon: 'person',
          route: '/profile',
        },
      ]);
    }
    return items;
  });

  ngOnInit() {
    this.updateNavigationService();
    this.getInstallments();
    this.trackBottomNavigationClicks();
  }

  private getInstallments(): void {
    this.transactionApiService
      .getUpcomingInstallmentTransactions()
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe({
        next: (result) => {
          this.paymentBadge.set(result.paymentList?.length ? result.paymentList.length.toString() : undefined);
          this.updateNavigationService(true);
        },
        error: () => {
          this.updateNavigationService(true);
        },
      });
  }

  updateNavigationService(optional = false): void {
    this.bottomNavigationService.setItems(this.navigationItems());
    this.bottomNavigationService.findActiveItem();
    if (optional) {
      // check if bottom navigation is currently visible or not, because of some inner pages that hide bottom navigation
      if (this.bottomNavigationService.isVisible()) {
        this.bottomNavigationService.show();
      }
    } else {
      this.bottomNavigationService.show();
    }
  }

  private trackBottomNavigationClicks(): void {
    if (!this.appNameService.isPillar()) {
      return;
    }

    // Map routes to event names
    const routeEventMap: Record<string, string> = {
      '/home': 'Pillar_ClickHomeTab',
      '/service/credit/installments-overview': 'Pillar_ClickInstallmentTab',
      '/transactions/report/history': 'Pillar_ClickTransactionTab',
      '/profile': 'Pillar_ClickProfileTab',
    };

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.untilDestroy),
      )
      .subscribe((event: NavigationEnd) => {
        // Check if the navigation matches any of our bottom nav routes
        const eventName = routeEventMap[event.urlAfterRedirects] || routeEventMap[event.url];

        if (eventName) {
          // Send event to eventTrackerService
          this.eventTrackerService.sendEvent({
            eventName,
            eventData: {},
          });

          // Send the same event to EventManagementService
          this.eventManagementService.triggerEvent({
            eventType: 'click',
            data: {
              target: eventName,
            },
          });
        }
      });
  }
}
