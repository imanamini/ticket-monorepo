import { Component, inject, Input } from '@angular/core';
import { RewardDetailComponent } from '../reward-detail/reward-detail.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Prize } from '../../data-access/models/user-rewards.response';
import { UiContentCardComponent } from '../ui-components/ui-content-box/ui-content-card.component';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { UiTicketCardComponent } from '../ui-components/ui-ticket-card/ui-ticket-card.component';
import { ClubService } from '../../data-access/services/club.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'pay-club-applet-pay-club-rewards',
  standalone: true,
  imports: [CommonModule, UiContentCardComponent, UiTicketCardComponent, HorizontalScrollComponent],
  templateUrl: './pay-club-rewards.component.html',
  styleUrls: ['./pay-club-rewards.component.scss'],
})
export class PayClubRewardsComponent {
  @Input()
  vouchers: Prize[] = [];

  @Input()
  isLoggedIn = false;

  @Input()
  isLoading = true;

  subscriptions: Subscription[] = [];

  private bottomSheetService = inject(NgxBottomSheetService);
  private clubService = inject(ClubService);
  private router = inject(Router);

  selectTicket(voucher: Prize): void {
    if (this.isLoggedIn) {
      this.bottomSheetService.openBottomSheet(RewardDetailComponent, { voucher }, { noPadding: true });
      return;
    }
    this.clubService.handleLogin();
  }
  onActionClicked(): void {
    this.router.navigateByUrl('pay-club/all-reward').then();
  }
}
