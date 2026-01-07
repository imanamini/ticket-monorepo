import { inject, Inject, Injectable } from '@angular/core';
import { defer, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { DeviceInfoService } from '@client-monorepo/common/utilities';
import { InAppTacResponse, TacDeviceModel, TacResponse } from '../models/tac.interface';
import { ProfileInterface } from '../models/profile.interface';
import { UserProfileInterface } from '../models/user-profile.interface';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
@Injectable({
  providedIn: 'root',
})
export class TacService {
  device!: TacDeviceModel;
  private apiService = inject(ApiService);
  private hybridService = inject(NgxHybridService);
  private deviceInfoService = inject(DeviceInfoService);

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {
    this.deviceInfoService.getDeviceInfo().then();
  }

  /**
   * This method is used for check mode and  set device data for each agent like hybrid mode or web. These two are slightly different.
   * Attention: We must get pushNotifToken from android and set to device object.
   */
  setDevice(): Promise<void> {
    return new Promise((resolve) => {
      if (this.device) {
        resolve();
        return;
      }
      this.deviceInfoService.getDeviceInfo().then((deviceInfo) => {
        const isAndroidHybrid = this.hybridService.isAndroidHybrid();
        // Extra device data for web.
        const webDeviceInfo = {
          imei: 'WEB_BROWSER',
          osVersion: '1.0',
          appVersion: this.environment['appVersion'] || '1.0',
          displaySize: 'WEB_BROWSER',
          manufacture: navigator.vendor || '',
          brand: navigator.product || '',
        };
        this.device = {
          device: isAndroidHybrid ? deviceInfo : Object.assign(webDeviceInfo, deviceInfo),
          appVersion: isAndroidHybrid ? (deviceInfo?.appVersion as string) : '1.0',
        };
        if (isAndroidHybrid) {
          this.device.pushNotifToken = deviceInfo?.fireBaseToken;
        }
        resolve();
      });
    });
  }

  getTac(): Observable<TacResponse> {
    return defer(() => this.setDevice()).pipe(
      switchMap(() => {
        const request = new RequestBuilder(RequestTypeEnum.POST, `users/tac`, this.device);
        return this.apiService.call<TacResponse>(request);
      }),
    );
  }

  acceptTac(): Observable<TacResponse> {
    return new Observable<TacResponse>((subscriber) => {
      this.setDevice().then(() => {
        const request = new RequestBuilder(RequestTypeEnum.POST, `users/tac/accept`, this.device);
        return this.apiService.call<TacResponse>(request).pipe(
          map((data) => {
            return data;
          }),
        );
      });
    });
  }

  getProfile(): Observable<ProfileInterface> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `users/profile`);
    return this.apiService.call<UserProfileInterface>(request).pipe(
      map((result: UserProfileInterface) => {
        return result.userDetail;
      }),
    );
  }

  inAppTac(ticket: string): Observable<InAppTacResponse | any> {
    const header = { ticket };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'users/in-app/tac', {});
    request = request.setHeader(header);
    return this.apiService.call<InAppTacResponse | any>(request);
  }
}
