import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { RouterLink } from '@angular/router';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { HomeDataService } from '../../data-access/home-data.service';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'pillar-applet-wallet-balance',
  standalone: true,
  imports: [NgxButtonComponent, NgxIcon, RouterLink, NgxSkeletonLoadingComponent, PipesModule],
  templateUrl: './wallet-balance.component.html',
  styleUrl: './wallet-balance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBalanceComponent implements OnInit {
  private homeDataService = inject(HomeDataService);
  private eventService = inject(NgxEventTrackerService);

  balance = signal<number | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.homeDataService.balance$.subscribe((balance) => {
      if (balance !== null) {
        this.balance.set(balance);
        this.isLoading.set(false);
      }
    });
  }

  onWalletClick(): void {
    this.eventService.sendEvent({
      eventName: 'Pillar_ClickOnWallet',
      eventData: {},
    });
  }
}
