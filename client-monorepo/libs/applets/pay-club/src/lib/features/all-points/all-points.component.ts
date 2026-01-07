import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ClubApiService } from '../../data-access/services/club-api.service';
import { ScoringItem } from '../../data-access/models/scoring-setting';
import { PayClubEarnPointComponent } from '../../components/pay-club-earn-point/pay-club-earn-point.component';
import { SlicePipe } from '@angular/common';
import { UiPointCardComponent } from '../../components/ui-components/ui-point-card/ui-point-card.component';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { BpgDetailsDialogComponent } from '../../components/pay-club-earn-point/bpg-details-dialog/bpg-details-dialog.component';
import { OfflinePayDetailsDialogComponent } from '../../components/pay-club-earn-point/offline-pay-details-dialog/offline-pay-details-dialog.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ClubService } from '../../data-access/services/club.service';

@Component({
  selector: 'pay-club-applet-all-points',
  standalone: true,
  imports: [PageLayoutComponent, PayClubEarnPointComponent, SlicePipe, UiPointCardComponent],
  templateUrl: './all-points.component.html',
  styleUrl: './all-points.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllPointsComponent implements OnInit {
  private clubApiService = inject(ClubApiService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private clubService = inject(ClubService);

  points = signal<ScoringItem[]>([]);

  ngOnInit() {
    this.getAllPoints();
  }

  private getAllPoints() {
    this.clubApiService.getScoringSettingApi().subscribe({
      next: (res) => {
        this.points.set(res?.items);
      },
    });
  }
  onPointCardClick(item: any): void {
    if (item.location && item.location === 'NO_ACTION') {
      return;
    }
    this.checkCardFeatureName(item);
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
