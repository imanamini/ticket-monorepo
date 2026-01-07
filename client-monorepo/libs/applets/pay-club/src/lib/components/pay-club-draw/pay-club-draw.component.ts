import { Component, Input } from '@angular/core';
import { DrawDetailComponent } from '../draw-detail/draw-detail.component';
import { CommonModule } from '@angular/common';
import { Prize } from '../../data-access/models/user-rewards.response';
import { UiContentCardComponent } from '../ui-components/ui-content-box/ui-content-card.component';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { UiDrawCardComponent } from '../ui-components/ui-draw-card/ui-draw-card.component';
import { ClubService } from '../../data-access/services/club.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'pay-club-applet-pay-club-draw',
  standalone: true,
  imports: [CommonModule, UiContentCardComponent, UiDrawCardComponent, HorizontalScrollComponent],
  templateUrl: './pay-club-draw.component.html',
  styleUrls: ['./pay-club-draw.component.scss'],
})
export class PayClubDrawComponent {
  @Input()
  lotteries: Prize[] = [];

  @Input()
  isLoggedIn = false;

  @Input()
  isLoading = true;

  constructor(
    private bottomSheetService: NgxBottomSheetService,
    private clubService: ClubService,
  ) {}

  selectDraw(lottery: any): void {
    if (this.isLoggedIn) {
      this.bottomSheetService.openBottomSheet(DrawDetailComponent, { lottery }, { noPadding: true });
      return;
    }
    this.clubService.handleLogin();
  }
}
