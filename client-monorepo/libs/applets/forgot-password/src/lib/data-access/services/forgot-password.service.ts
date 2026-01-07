import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, from, map, Observable, of } from 'rxjs';
import { ForgotPasswordOutputModel } from '../models/forgot-password-output.model';
import { UserApiService } from '@client-monorepo/common/user';
import { DeviceInfo, DeviceInfoService, StorageService } from '@client-monorepo/common/utilities';
import { ForgotPasswordApiService } from './forgot-password-api.service';
import { ApiResultInterface } from '@client-monorepo/common/network';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  defaultPhoneNumber = signal('');
  device = signal<DeviceInfo | undefined>(undefined);

  private forgotPasswordSubject = new BehaviorSubject<ForgotPasswordOutputModel>({});
  forgotPassword = this.forgotPasswordSubject.asObservable();
  shouldNextStep = new BehaviorSubject(false);

  userApiService = inject(UserApiService);
  storageService = inject(StorageService);
  deviceInfoService = inject(DeviceInfoService);
  forgotPasswordApiService = inject(ForgotPasswordApiService);
  private eventService = inject(NgxEventTrackerService);
  private shouldGetProfileData = computed(() => this.storageService.isLoggedIn() && !this.storageService.isTokenExpired());

  private getUserProfile(): Observable<string | ''> {
    if (this.shouldGetProfileData()) {
      return this.userApiService.getProfile().pipe(
        map((result) => result.cellNumber),
        catchError((error) => {
          console.error({ error });
          return of(''); // Fallback to null
        }),
      );
    }
    const userPhoneNumber = this.storageService.getUserData()?.phoneNumber;
    return of(userPhoneNumber || '');
  }

  private getDeviceInfo(): Observable<any> {
    return from(this.deviceInfoService.getDeviceInfo());
  }

  preprocessingSteps(): Observable<{ userProfile: string | null; deviceInfo: any }> {
    return combineLatest([this.getUserProfile(), this.getDeviceInfo()]).pipe(
      map(([userProfile, deviceInfo]) => {
        this.defaultPhoneNumber.set(userProfile);
        this.device.set(deviceInfo);
        this.updateForgotPassword({ device: deviceInfo, phone: userProfile });

        return { userProfile, deviceInfo };
      }),
    );
  }

  updateForgotPassword(newData: Partial<ForgotPasswordOutputModel>): void {
    const currentData = this.forgotPasswordSubject.getValue();
    this.forgotPasswordSubject.next({ ...currentData, ...newData });
  }

  sendOtpRequest(phoneNumber: string): Observable<ApiResultInterface> {
    return this.forgotPasswordApiService.resetOtp(phoneNumber, this.device()!);
  }

  setIntrackEvent(eventName: string, data?: string) {
    this.eventService.sendEvent({
      eventName: eventName,
      eventData: { data },
    });
  }
}
