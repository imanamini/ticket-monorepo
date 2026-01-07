import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { PageLayoutComponent, SearchComponent } from '@client-monorepo/common/ui-components';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { UiTicketCardComponent } from '../../components/ui-components/ui-ticket-card/ui-ticket-card.component';
import { UiContentCardComponent } from '../../components/ui-components/ui-content-box/ui-content-card.component';
import { Prize } from '../../data-access/models/user-rewards.response';
import { ClubApiService } from '../../data-access/services/club-api.service';
import { RewardDetailComponent } from '../../components/reward-detail/reward-detail.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pay-club-applet-all-reward',
  standalone: true,
  imports: [PageLayoutComponent, DpIconComponent, SearchComponent, UiTicketCardComponent, UiContentCardComponent],
  templateUrl: './all-reward.component.html',
  styleUrl: './all-reward.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllRewardComponent implements OnInit {
  private bottomSheetService = inject(NgxBottomSheetService);
  private clubApiService = inject(ClubApiService);
  untilDestroy = inject(DestroyRef);

  searchText = signal<string>('');
  vouchers = signal<Prize[]>([]);
  ngOnInit() {
    this.getVouchers();
  }
  private getVouchers(): void {
    this.clubApiService
      .getClubRewardsZipApi()
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe({
        next: (res) => {
          this.vouchers.set(res?.vouchers || []);
        },
      });
  }
  private searchItems(searchText = ''): void {
    const filterItem = this.vouchers().filter((item) => item.info.title.includes(searchText));
    this.vouchers.set(filterItem);
  }
  doSearch(searchText = ''): void {
    if (searchText && searchText.length >= 2) {
      this.searchItems(searchText);
    } else {
      this.getVouchers();
    }
  }
  searchEnd(searchText: string): void {
    if (searchText && searchText.length >= 2) {
      this.searchItems(searchText);
    } else {
      this.getVouchers();
    }
  }
  selectTicket(voucher: Prize): void {
    this.bottomSheetService.openBottomSheet(RewardDetailComponent, { voucher }, { noPadding: true });
  }
}
