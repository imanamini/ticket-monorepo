import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prize } from '../../data-access/models/user-rewards.response';
import { RewardType } from '../../data-access/models/reward-type';
import { ClubApiService } from '../../data-access/services/club-api.service';
import { UiDialogBtmSheetComponent } from '../ui-components/ui-dialog-btm-sheet/ui-dialog-btm-sheet.component';
import { UiPrizeCardComponent } from '../ui-components/ui-prize-card/ui-prize-card.component';
import { UiDrawDialogBtmSheetComponent } from '../ui-components/ui-draw-dialog-btm-sheet/ui-draw-dialog-btm-sheet.component';
import { UiVoucherDialogBtmSheetComponent } from '../ui-components/ui-voucher-dialog-btm-sheet/ui-voucher-dialog-btm-sheet.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'pay-club-applet-my-prizes',
  standalone: true,
  imports: [
    CommonModule,
    UiDialogBtmSheetComponent,
    UiPrizeCardComponent,
    UiDrawDialogBtmSheetComponent,
    UiVoucherDialogBtmSheetComponent,
    NgxSkeletonLoadingComponent,
  ],
  templateUrl: './my-prizes.component.html',
  styleUrls: ['./my-prizes.component.scss'],
})
export class MyPrizesComponent implements OnInit {
  prizes: Prize[] = [];

  selectedPrize!: Prize;

  rewardType = RewardType;

  isLoading = true;

  constructor(
    private clubApiService: ClubApiService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getPrizes();
  }

  getPrizes(): void {
    this.clubApiService.getUserRewardsApi().subscribe((response) => {
      this.prizes = response.prizes;
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  onSelect(prize: Prize): void {
    this.selectedPrize = prize;
  }
}
