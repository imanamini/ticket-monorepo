import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ReceiveCoinComponent } from '../../components/receive-coin/receive-coin.component';
import { ManipulatedClubRewardsInterface } from '../../data-access/models/club-rewards-response';
import { PayClubDrawComponent } from '../../components/pay-club-draw/pay-club-draw.component';
import { Prize } from '../../data-access/models/user-rewards.response';
import { ScoringSettingResponse } from '../../data-access/models/scoring-setting';
import { DrawDetailComponent } from '../../components/draw-detail/draw-detail.component';
import { ClubService } from '../../data-access/services/club.service';
import { ClubApiService } from '../../data-access/services/club-api.service';
import { PayClubEarnPointComponent } from '../../components/pay-club-earn-point/pay-club-earn-point.component';
import { PayClubRewardsComponent } from '../../components/pay-club-rewards/pay-club-rewards.component';
import { PayClubDrawCountdownComponent } from '../../components/pay-club-draw-countdown/pay-club-draw-countdown.component';
import { PayClubWinnersComponent } from '../../components/pay-club-winners/pay-club-winners.component';
import { StorageService } from '@client-monorepo/common/utilities';
import { PayClubInviteFriendsComponent } from '../../components/pay-club-invite-friends/pay-club-invite-friends.component';
import { ClubRulesComponent } from '../../components/club-rules/club-rules.component';
import { MyPrizesComponent } from '../../components/my-prizes/my-prizes.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PayClubSkeletonLoadingComponent } from '../../components/pay-club-skeleton-loading/pay-club-skeleton-loading.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pay-club-applet-pay-club-main',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ReceiveCoinComponent,
    PayClubDrawComponent,
    PayClubEarnPointComponent,
    PayClubRewardsComponent,
    PayClubDrawCountdownComponent,
    PayClubWinnersComponent,
    PayClubInviteFriendsComponent,
    NgxSkeletonLoadingComponent,
    PayClubSkeletonLoadingComponent,
  ],
  templateUrl: './pay-club-main.component.html',
  styleUrl: './pay-club-main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PayClubMainComponent implements OnInit {
  private clubService = inject(ClubService);
  private clubApiService = inject(ClubApiService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private storageService = inject(StorageService);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  untilDestroy = inject(DestroyRef);

  generalBalance = signal<number>(0);

  clubRewards = signal<ManipulatedClubRewardsInterface>({} as ManipulatedClubRewardsInterface);

  gettingClubRewards = signal(false);

  isLoggedIn = signal(false);

  firstLottery = signal<Prize>({} as Prize);

  scoringSettingData = signal<ScoringSettingResponse>({} as ScoringSettingResponse);

  isLoading = signal(true);

  ngOnInit(): void {
    this.bottomNavigationService.hide();
    this.clubService.getClubReward();
    this.getUserBalance();
    this.getScoringSetting();
    this.setClubRewards();
    this.setLoggedInStatus();
  }

  getUserBalance(): void {
    this.clubService.generalBalance.pipe(takeUntilDestroyed(this.untilDestroy)).subscribe((balance) => {
      this.generalBalance.set(balance);
    });
  }

  setLoggedInStatus(): void {
    this.isLoggedIn.set(this.storageService.isLoggedIn());
    if (this.isLoggedIn()) {
      this.clubService.setGeneralBalance();
    }
  }

  setClubRewards(): void {
    this.clubService.clubRewards.pipe(takeUntilDestroyed(this.untilDestroy)).subscribe((rewards) => {
      if (rewards) {
        this.clubRewards.set(rewards);
        this.setFirstLottery(rewards.lotteries);
        this.gettingClubRewards.set(true);
        this.isLoading.set(false);
      }
    });
  }

  getScoringSetting(): void {
    this.clubApiService
      .getScoringSettingApi()
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe((res) => {
        this.scoringSettingData.set(res);
      });
  }

  setFirstLottery(lotteries: Prize[]): void {
    if (lotteries.length === 0) {
      return;
    }
    lotteries.sort((a, b) => a.info.executionDate - b.info.executionDate);
    this.firstLottery.set(lotteries[0]);
  }

  showFirstLotteryDetails(): void {
    if (this.isLoggedIn()) {
      this.bottomSheetService.openBottomSheet(DrawDetailComponent, { lottery: this.firstLottery() }, { noPadding: true });
      return;
    }
    this.clubService.handleLogin();
  }

  showRules(): void {
    this.bottomSheetService.openBottomSheet(ClubRulesComponent, {}, { noPadding: true });
  }

  showPrizes(): void {
    if (this.isLoggedIn()) {
      this.bottomSheetService.openBottomSheet(MyPrizesComponent, {}, { noPadding: true });
      return;
    }
    this.clubService.handleLogin();
  }

  getScore(): void {
    this.clubService.handleLogin();
  }
}
