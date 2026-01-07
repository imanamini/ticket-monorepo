import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ManipulatedClubRewardsInterface } from '../models/club-rewards-response';
import { ClubApiService } from './club-api.service';
import { StorageService } from '@client-monorepo/common/utilities';
import { RewardType } from '../models/reward-type';
import { PayClubApiService } from '@client-monorepo/common/pay-club';
import { Router } from '@angular/router';
import { ActionHandlerService, ActionType, APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { CacheService } from '@client-monorepo/common/network';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  clubRewards = new BehaviorSubject<ManipulatedClubRewardsInterface | null>(null);

  routingToApp = new BehaviorSubject<boolean | null>(null);

  generalBalance = new BehaviorSubject<number>(0);

  constructor(
    private clubApiService: ClubApiService,
    private storageService: StorageService,
    private hybridService: NgxHybridService,
    private payClubApiService: PayClubApiService,
    private router: Router,
    private actionHandlerService: ActionHandlerService,
    private cacheService: CacheService,
  ) {}

  getClubReward(isClearCache = false): void {
    if (isClearCache) {
      Promise.all([
        this.cacheService.deleteFromCache('scores/club', false),
        this.cacheService.deleteFromCache('scores/club/prizes', false),
      ]).then(() => {
        this.clubApiService.getClubRewardsZipApi().subscribe((response) => {
          this.clubRewards.next(response);
        });
      });
    } else {
      this.clubApiService.getClubRewardsZipApi().subscribe((response) => {
        this.clubRewards.next(response);
      });
    }
  }

  setGeneralBalance(): void {
    this.payClubApiService.getUserCoinBalance().subscribe((res) => {
      this.generalBalance.next(res.generalBalance);
    });
  }

  getReward(type: RewardType, groupId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.clubApiService.getRewardApi(type, groupId).subscribe(
        (response) => {
          this.setGeneralBalance();
          resolve(response);
        },
        (err) => {
          reject(err);
        },
      );
    });
  }

  protectedItemClick(action: APP_ACTIONS, url: string | null = null): void {
    this.routingToApp.next(true);
    setTimeout(() => {
      this.getBackToApp(action, url);
    }, 0);
  }
  getBackToApp(action: APP_ACTIONS, url: string | null = null): void {
    if (this.hybridService.isAndroidHybrid()) {
      // todo check that is this needed
      // this.hybridService.goBackToAndroidHybrid(action);
      return;
    }
    this.actionHandlerService.handle({
      type: ActionType.OLD_ACTION,
      payload: {
        action,
      },
    });
  }

  handleLogin() {
    this.storageService.storeBeforeLoginRoute({
      url: '/pay-club',
      queryParams: '',
    });
    this.router.navigate(['auth']).then();
  }
}
