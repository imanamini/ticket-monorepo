import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScoringSettingResponse } from '../models/scoring-setting';
import { ClubRewardsResponse, ManipulatedClubRewardsInterface } from '../models/club-rewards-response';
import { RewardType } from '../models/reward-type';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { SearchPrizesRequest } from '../models/search-prizes-request';
import { SearchPrizesResponse } from '../models/search-prizes-response';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';
import { Prize, UserRewardsResponse } from '../models/user-rewards.response';
import { PayClubUserStatusResponse } from '../models/pay-club-user-status-response';

@Injectable({
  providedIn: 'root',
})
export class ClubApiService {
  constructor(
    public http: HttpClient,
    private apiService: ApiService,
    private datePipe: JalaliDatePipe,
  ) {}

  getRewardApi(type: RewardType, groupId: string): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `scores/club/prizes/${type}/${groupId}/acquire`);
    return this.apiService.call<any>(request);
  }

  searchPrizesApi(params: SearchPrizesRequest): Observable<SearchPrizesResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'scores/club/prizes/search', params);
    return this.apiService.call<SearchPrizesResponse>(request);
  }

  getUserRewardsApi(): Observable<UserRewardsResponse> {
    let request = new RequestBuilder(RequestTypeEnum.GET, 'scores/club/prizes');
    request = request.enableCache(3 * 60 * 1000); // 3 minutes
    return this.apiService.call<UserRewardsResponse>(request).pipe(
      map((res) => {
        res.prizes.forEach((prize) => {
          (prize.info['remainingTimePurchase'] = (prize.info.expirationDate - res?.currentTime) / 1000),
            (prize.info['remainingTimeExecution'] = (prize.info.executionDate - res?.currentTime) / 1000),
            (prize.info['formatExecutionDate'] = this.datePipe.transform(prize.info.executionDate));
        });
        return res;
      }),
    );
  }

  getClubRewardsApi(): Observable<ManipulatedClubRewardsInterface> {
    let request = new RequestBuilder(RequestTypeEnum.GET, 'scores/club');
    request = request.enableCache(3 * 60 * 1000); // 3 minutes
    return this.apiService.call<ClubRewardsResponse>(request).pipe(
      map((response: ClubRewardsResponse): ManipulatedClubRewardsInterface => {
        const manipulatedResponse = {
          ...response,
          vouchers: response.vouchers.map((item) => ({
            info: { ...item },
            acquisitionResult: {
              code: '',
              nextAllowedAcquireTime: 0,
              status: 0,
            },
          })),
          lotteries: response.lotteries.map((item) => ({
            info: {
              ...item,
              remainingTimePurchase: (item.expirationDate - response.currentTime) / 1000,
              remainingTimeExecution: (item.executionDate - response.currentTime) / 1000,
              formatExecutionDate: this.datePipe.transform(item.executionDate),
            },
            acquisitionResult: {
              code: '',
              nextAllowedAcquireTime: 0,
              status: 0,
              trackingCode: '',
            },
          })),
        };

        return manipulatedResponse;
      }),
    );
  }

  getClubRewardsZipApi(): Observable<ManipulatedClubRewardsInterface> {
    return zip(this.getClubRewardsApi(), this.getUserRewardsApi()).pipe(
      map(([response, res]) => {
        const prizeMapper = {} as Record<string, Prize>;
        res.prizes.forEach((prize) => {
          prizeMapper[prize.info.groupId] = prize;
        });
        response.vouchers.forEach((item, index) => {
          response.vouchers[index] = prizeMapper[item.info.groupId] || response.vouchers[index];
        });
        response.lotteries.forEach((item, index) => {
          response.lotteries[index] = prizeMapper[item.info.groupId] || response.lotteries[index];
        });
        return response;
      }),
    );
  }

  payClubUserStatusApi(cellNumber: string): Observable<PayClubUserStatusResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'scores/user/status', { cellNumber });
    return this.apiService.call<PayClubUserStatusResponse>(request);
  }

  getScoringSettingApi(): Observable<ScoringSettingResponse> {
    let request = new RequestBuilder(RequestTypeEnum.GET, 'settings/scoring');
    request = request.enableCache(3 * 60 * 1000); // 3 minutes
    return this.apiService.call<ScoringSettingResponse>(request);
  }
}
