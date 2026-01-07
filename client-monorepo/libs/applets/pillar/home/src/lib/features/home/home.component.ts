import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletBalanceComponent } from '../../componensts/wallet-balance/wallet-balance.component';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CardViewComponent } from '../../componensts/card-view/card-view.component';
import { CreditUsageListComponent } from '../../componensts/credit-usage-list/credit-usage-list.component';
import { InstallmentWidgetComponent } from '@client-monorepo/common/installment';
import { HomeDataService } from '../../data-access/home-data.service';
import { CREDIT_WALLET_STATUS, CreditServiceTypeService } from '@client-monorepo/applets/credit';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { ErrorStateComponent } from '@client-monorepo/applets/pillar/error-state';
import { StorageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'pillar-home-applet',
  standalone: true,
  imports: [
    CommonModule,
    WalletBalanceComponent,
    NgxBadgeModule,
    InstallmentWidgetComponent,
    CardViewComponent,
    CreditUsageListComponent,
    NgxSkeletonLoadingComponent,
    ErrorStateComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMainAppletComponent implements OnInit {
  installmentWidget = viewChild<InstallmentWidgetComponent>('installmentWidget');

  handleRefresh(): void {
    this.installmentWidget()?.refresh();
  }

  isAnyActiveWallet = signal<boolean | undefined>(undefined);
  loading = signal(true);
  walletsError = signal(false);
  private homeDataService = inject(HomeDataService);
  serviceTypeService = inject(CreditServiceTypeService);
  private eventService = inject(NgxEventTrackerService);
  private storageService = inject(StorageService);

  ngOnInit() {
    this.serviceTypeService.setServiceType('credit');
    this.trackHomeView();
    this.loadData();
  }

  private trackHomeView(): void {
    const userId = this.storageService.getUserId();
    this.eventService.sendEvent({
      eventName: 'HomeView',
      eventData: { userId },
    });
  }

  private loadData() {
    // Track wallets error state
    this.homeDataService.walletsError$.subscribe((err) => {
      this.walletsError.set(!!err);
      if (err) {
        this.loading.set(false);
      }
    });

    // Initialize data on component load - MUST subscribe!
    this.homeDataService.initializeData().subscribe({
      next: () => {
        this.homeDataService.wallets$.subscribe((walletsData) => {
          if (walletsData) {
            const isAnyActiveWallet = [...(walletsData.wallets ?? []), ...(walletsData.volunteers ?? [])].some(
              (w) => w.status === CREDIT_WALLET_STATUS.COMPLETED,
            );
            this.isAnyActiveWallet.set(isAnyActiveWallet);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error initializing data:', err);
        this.loading.set(false);
      },
    });
  }

  refreshData() {
    // Call this to refresh all data - MUST subscribe!
    this.homeDataService.refreshData().subscribe({
      next: () => {
        this.handleRefresh();
      },
      error: (err) => {
        console.error('Error refreshing data:', err);
      },
    });
  }
}
