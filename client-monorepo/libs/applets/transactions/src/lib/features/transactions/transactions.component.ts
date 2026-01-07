import { ChangeDetectionStrategy, Component, HostBinding, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent, TabConfig, TabGroupComponent } from '@client-monorepo/common/ui-components';
import { UpcomingTransactionsComponent } from '../../components/upcoming-transactions/upcoming-transactions.component';
import { TransactionsHistoryComponent } from '../../components/transactions-history/transactions-history.component';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { CacheService } from '@client-monorepo/common/network';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { AppNameService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'transactions-applet-transactions',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, TabGroupComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  backHandlerService = inject(BackHandlerService);
  mode = signal<'history' | 'upcoming'>('history');
  cacheService = inject(CacheService);
  bottomNavigationService = inject(NgxBottomNavigationService);
  tabs!: Array<TabConfig>;
  router = inject(Router);
  private appNameService = inject(AppNameService);

  isPillar = this.appNameService.isPillar();

  @HostBinding('class.pillar-app') get isPillarApp() {
    return this.isPillar;
  }

  ngOnInit() {
    if (!this.isPillar) {
      this.bottomNavigationService.hide();
    }

    this.cacheService.deleteFromCache('dpx/services/assets', false);
    const tempMode = this.activatedRoute.snapshot.params['mode'];
    this.mode.set(tempMode);
    this.initializeTabConfig();
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }

  initializeTabConfig(): void {
    this.tabs = [
      {
        label: signal('تراکنش‌های انجام شده'),
        isActive: this.mode() === 'history' ? signal(true) : signal(false),
        component: signal(TransactionsHistoryComponent),
        relatedChildLink: '/transactions/report/history',
      },
      {
        label: signal('تراکنش‌های پیش رو'),
        isActive: this.mode() === 'upcoming' ? signal(true) : signal(false),
        component: signal(UpcomingTransactionsComponent),
        relatedChildLink: '/transactions/report/upcoming',
      },
    ];
  }

  backToTransactionHomePage(): void {
    this.backHandlerService.goBack();
  }
}
