import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { EMPTY, map, switchMap, take } from 'rxjs';
import { OtpSheetResult } from '../models/otp-component.interface';
import { DigiCardSharedService } from './digi-card-shared.service';
import { VerificationService } from './verification.service';
import {
  DigiCardChangePasswordApiInput,
  DigiCardForgotPasswordApiInput,
  DigiCardSetPasswordApiInput,
} from '../models/digi-card-password.interface';
import { PasswordApiService } from './password-api.service';

@Injectable()
export class PasswordFlowService {
  verificationService = inject(VerificationService);
  digiCardSharedService = inject(DigiCardSharedService);
  private apiService = inject(ApiService);
  passwordApiService = inject(PasswordApiService);

  changePassword(payload: Partial<DigiCardChangePasswordApiInput>, cardId: string) {
    return this.digiCardSharedService.getPublicKey('digicard').pipe(
      map((key) => this.digiCardSharedService.encryptStringObject(payload, key)),
      switchMap((encrypted) =>
        this.passwordApiService.changePassword({ ...encrypted, uniqueId: cardId } as DigiCardChangePasswordApiInput),
      ),
    );
  }
  forgotPassword$(payload: Partial<DigiCardSetPasswordApiInput>, cardId: string, features: number[]) {
    return this.verificationService.sendOtpForVerification().pipe(
      switchMap(() =>
        this.verificationService
          .openOtpBottomSheet$({
            title: 'احراز هویت',
            phoneNumber: '09123456789',
          })
          .pipe(
            switchMap((event: any) => {
              if (event.type === 'resend') {
                return this.verificationService.sendOtpForVerification().pipe(switchMap(() => EMPTY));
              }

              if (event.type === 'cancel') {
                return EMPTY;
              }

              return this.verificationService
                .verifyOtpForFeature(event.code, features)
                .pipe(map((res) => ({ code: event.code, verify: res })));
            }),
            take(1),
          ),
      ),
      switchMap(({ code, verify }) => {
        if (verify?.result.status != 0) return EMPTY;

        return this.digiCardSharedService.getPublicKey('digicard').pipe(
          map((key) => this.digiCardSharedService.encryptStringObject(payload, key)),
          switchMap((encrypted) => {
            return this.passwordApiService.forgotPassword({ ...encrypted, uniqueId: cardId } as DigiCardForgotPasswordApiInput);
          }),
        );
      }),
    );
  }
}
