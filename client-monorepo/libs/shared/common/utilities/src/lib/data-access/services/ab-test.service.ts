import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable, of, shareReplay } from 'rxjs';
import { UserVersionsResponse } from '../models/user-versions.response';
import { STORAGE_KEY } from '../constants/storage-key.const';

declare const window: any;
@Injectable({
  providedIn: 'root',
})
export class AbTestService {
  apiService = inject(ApiService);
  private userChannels?: Observable<string[]>;
  private readonly DIGIPAY_FAMILY_CHANNEL = 'digipay_family';
  private getVersions(): Observable<UserVersionsResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'versions');
    return this.apiService.call<UserVersionsResponse>(request);
  }

  getUserChannels(): Observable<string[]> {
    if (!this.userChannels) {
      this.userChannels = this.getVersions().pipe(
        map((res) => res.channels),
        shareReplay(1),
      );
    }
    return this.userChannels;
  }

  static generatePartitionBasedOnUserId(partitionLength = 20): number {
    const dps = localStorage.getItem('__dp_storage');
    if (!dps) {
      return 0;
    }
    const dpsJson = JSON.parse(dps);
    if (!dpsJson?.auth?.userId) {
      return 0;
    }
    const userId = dpsJson.auth.userId;
    if (!userId) {
      return 0;
    }
    const userNumber: number = parseInt(userId.substr(0, 4).toString(), 16);
    return (userNumber % partitionLength) + 1;
  }

  // This method ensures that the partition will never change at runtime.
  static getPartitionBasedOnUserId(partitionLength = 20): number {
    if (window.partition !== undefined) {
      return window.partition;
    }
    const partition = this.generatePartitionBasedOnUserId(partitionLength);
    window.partition = partition;
    return partition;
  }

  static isUserInclude(includedPartitions: number[]): boolean {
    let partition = AbTestService.getPartitionBasedOnUserId(20);
    const forcePartition = localStorage.getItem('ab_test_partition');
    if (forcePartition) {
      partition = parseInt(forcePartition);
    }
    return includedPartitions.includes(partition);
  }

  static isShowHome(): boolean {
    return this.isUserInclude([21]);
  }

  static isShowMap(): boolean {
    return this.isUserInclude([7, 13, 21]);
  }

  static callApiWithAbsoluteUrl(): boolean {
    return this.isUserInclude([21]);
  }

  static showLocationSheet(): boolean {
    return this.isUserInclude([7, 11, 9, 15, 21]);
  }

  static loadIranAccessMap(): boolean {
    return this.isUserInclude([21]);
  }

  static showChatBot(): boolean {
    return this.isUserInclude([14, 15, 16, 17, 18, 19, 20, 21]);
  }

  static wealthCreditGuid() {
    return this.isUserInclude([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]);
  }

  static wealthPaymentInBrowser() {
    return this.isUserInclude([21]);
  }

  static drSideActive(): boolean {
    return this.isUserInclude([23]) || window?.origin?.startsWith('https://drapp.mydigipay');
  }
  static showErrorDetail(): boolean {
    let auth: { userId: string } = { userId: '' };
    const dps = localStorage.getItem(STORAGE_KEY.DB_STORAGE);
    if (dps) {
      const dpsJson = JSON.parse(dps);
      if (dpsJson?.auth) {
        auth = dpsJson.auth;
      }
    }

    return this.isUserInclude([21]) || (auth && auth.userId === '84cd20fd-42dc-49d3-bb80-4c1d86c772e9');
  }

  static showAppMessage(): boolean {
    return this.isUserInclude([21]);
  }
  static showNewBime(): boolean {
    return this.isUserInclude([21, 2, 18]);
  }

  static canChangeBannerTime(): boolean {
    return this.isUserInclude([30]);
  }
  isDigipayFamily(): Observable<boolean> {
    return this.getUserChannels().pipe(map((channels: string[]) => channels.includes(this.DIGIPAY_FAMILY_CHANNEL)));
  }
  showDPCard(): Observable<boolean> {
    if(AbTestService.isUserInclude([21])) {
      return of(true)
    }
    return this.isDigipayFamily().pipe(map((isFamily) => isFamily));
  }
  static showEruda(): boolean {
    return this.isUserInclude([22]);
  }

  static showDirectDebit(): boolean {
    return this.isUserInclude([21]);
  }

  static showNewBannersMode(): boolean {
    return this.isUserInclude([21]);
  }
}
