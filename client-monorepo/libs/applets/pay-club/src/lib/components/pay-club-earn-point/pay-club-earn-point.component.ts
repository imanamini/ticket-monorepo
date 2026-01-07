import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { BpgDetailsDialogComponent } from './bpg-details-dialog/bpg-details-dialog.component';
import { OfflinePayDetailsDialogComponent } from './offline-pay-details-dialog/offline-pay-details-dialog.component';
import { CommonModule } from '@angular/common';
import { ScoringItem } from '../../data-access/models/scoring-setting';
import { ClubService } from '../../data-access/services/club.service';
import { UiContentCardComponent } from '../ui-components/ui-content-box/ui-content-card.component';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { UiPointCardComponent } from '../ui-components/ui-point-card/ui-point-card.component';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'pay-club-applet-pay-club-earn-point',
  standalone: true,
  imports: [CommonModule, UiContentCardComponent, UiPointCardComponent, HorizontalScrollComponent],
  templateUrl: './pay-club-earn-point.component.html',
  styleUrls: ['./pay-club-earn-point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayClubEarnPointComponent {
  private router = inject(Router);
  private clubService = inject(ClubService);
  private bottomSheetService = inject(NgxBottomSheetService);
  scoringItems = input<ScoringItem[]>([]);
  onPointCardClick(item: any): void {
    if (item.location && item.location === 'NO_ACTION') {
      return;
    }
    this.checkCardFeatureName(item);
  }
  onActionClicked(): void {
    this.router.navigateByUrl('pay-club/all-points').then();
  }

  checkCardFeatureName(item: ScoringItem): void {
    const action = item.featureName;
    switch (+action) {
      case APP_ACTIONS.MINIAPP_BNPL:
        this.openBpgDetailDialog();
        break;
      case APP_ACTIONS.MINIAPP_MARKETPLACE:
        this.openOfflinePaymentDialog();
        break;
      default:
        this.clubService.protectedItemClick(+action, item.url);
    }
  }

  openBpgDetailDialog() {
    return this.bottomSheetService.openBottomSheet(BpgDetailsDialogComponent, {}, { noPadding: true });
  }

  openOfflinePaymentDialog() {
    return this.bottomSheetService.openBottomSheet(OfflinePayDetailsDialogComponent, {}, { noPadding: true });
  }
}
