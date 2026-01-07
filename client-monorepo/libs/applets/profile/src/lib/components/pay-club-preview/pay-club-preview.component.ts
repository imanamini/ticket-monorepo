import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinComponent } from '../coin/coin.component';
import { PayClubBgComponent } from '../pay-club-bg/pay-club-bg.component';
import { CoinBalanceResponse, PayClubApiService } from '@client-monorepo/common/pay-club';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'profile-applet-pay-club-preview',
  standalone: true,
  imports: [CommonModule, CoinComponent, PayClubBgComponent, NgxSkeletonLoadingComponent],
  templateUrl: './pay-club-preview.component.html',
  styleUrl: '../subscription-preview/subscription-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayClubPreviewComponent implements OnInit {
  coins = signal<number | undefined>(undefined);
  payClubService = inject(PayClubApiService);

  ngOnInit(): void {
    this.payClubService.getUserCoinBalance().subscribe({
      next: (data: CoinBalanceResponse) => {
        if (data.generalBalance > 0) {
          this.coins.set(data.generalBalance);
        } else {
          this.coins.set(0);
        }
      },
      error: () => {
        this.coins.set(0);
      },
    });
  }
}
