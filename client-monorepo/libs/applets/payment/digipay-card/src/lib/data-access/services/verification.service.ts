import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable, take, tap } from 'rxjs';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { OtpVerificationComponent } from '../../components/otp-verification/otp-verification.component';
import { OtpSheetResult } from '../models/otp-component.interface';
import { DeviceInfo } from '@client-monorepo/common/utilities';
import { OtpVerifyResponseInterface } from 'libs/shared/common/user/src/lib/data-access/models/otp-verify-response.interface';

@Injectable()
export class VerificationService {
  private bottomSheet = inject(NgxBottomSheetService);
  private apiService = inject(ApiService);

  verifyOtpForFeature(smsToken: string, features: number[]): Observable<OtpVerifyResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `users/otp/verify`, { smsToken, features });

    return this.apiService.call<OtpVerifyResponseInterface>(request);
  }
  sendOtpForVerification(deviceInfo?: DeviceInfo): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `users/otp`, { device: deviceInfo });
    return this.apiService.call<ApiResultInterface>(request).pipe(
      tap(() => {
        sessionStorage.setItem('otp_timestamp', Date.now().toString());
      }),
    );
  }

  openOtpBottomSheet$(data: { title: string; phoneNumber?: string }) {
    this.bottomSheet.openBottomSheet(OtpVerificationComponent, data, { disableClose: true });

    return this.bottomSheet.onClose.pipe(
      take(1),
      map(() => this.bottomSheet.outputData() as OtpSheetResult | null),
    );
  }
}
