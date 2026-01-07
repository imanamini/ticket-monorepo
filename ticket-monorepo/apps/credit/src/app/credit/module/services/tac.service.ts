import { Injectable } from '@angular/core';
import { CreditApiService } from '../../api/credit-api.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import {
  CreditOtpBottomSheetComponent,
  CreditOtpBottomSheetData
} from '../../shared/components/credit-otp-bottom-sheet/credit-otp-bottom-sheet.component';
import { BehaviorSubject, Observable, Subscriber, throwError } from 'rxjs';
import { MessageService } from '../../core/services/message.service';
import { DeviceInfoService } from '../../shared/services/device-info/device-info.service';
import { CreditPurchaseFeatures, FeatureIsProtected, InAppTacResponse } from '../../api/tac/in-app-tac-response';
import { CallForOtpPayload, CallForOtpResponse } from '../../api/tac/call-for-otp';
import { VerifyOtpPayload } from '../../api/tac/verify-otp';

type needOtpReturn = 'need' | 'notNeed' | 'error';

@Injectable({
  providedIn: 'root'
})
export class TacService {

  otpLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private selectedFeature: number;

  constructor(
    private creditApiService: CreditApiService,
    private bottomSheet: MatBottomSheet,
    private messageService: MessageService,
    private deviceInfoService: DeviceInfoService,
  ) {
  }

  checkOtp(ticket: string, phone: string) {
    return new Observable(observer => {
      this.otpLoading.next(true);
      this.creditApiService.inAppTac(ticket).subscribe({
        next: tacResponse => {
          const needOtpCheck = this.needOtp(tacResponse);
          switch (needOtpCheck) {
            case 'need':
              this.callForOtp().subscribe((callForOtpRes) => {
                if (callForOtpRes?.userId) {
                  this.bottomSheet.open<
                    CreditOtpBottomSheetComponent,
                    CreditOtpBottomSheetData,
                    boolean
                  >(CreditOtpBottomSheetComponent, {
                    data: {
                      userId: callForOtpRes.userId,
                      phone
                    },
                    panelClass: ['digipay-bottom-sheet'],
                    disableClose: true,
                  }).afterDismissed().subscribe(otpIsTrue => {
                    if (otpIsTrue) {
                      observer.next(true);
                    }
                  });
                }
              });
              break;
            case 'notNeed':
              this.otpLoading.next(false);
              observer.next(true);
              break;
            case 'error':
              this.otpLoading.next(false);
              observer.error('متاسفانه مشکلی در درخواست شما بوجود آمده است');
              break;
          }
        },
        error: e => {
          this.otpLoading.next(false);
          this.messageService.showErrorIfExists(e);
        }
      });
    });
  }

  needOtp(res: InAppTacResponse): needOtpReturn {
    if (res?.features) {
      const purchaseFeatureKey = Object.keys(res?.features)
        .find(item =>
          res.features[item].url &&
          ((item === CreditPurchaseFeatures.PAYMENT_BPG) ||
            (item === CreditPurchaseFeatures.PAYMENT_CPG) ||
            (item === CreditPurchaseFeatures.PAYMENT_CAPG5) ||
            (item === CreditPurchaseFeatures.PAYMENT_ISPG))
        );
      this.selectedFeature = +purchaseFeatureKey;
      switch (res.features[purchaseFeatureKey].isProtected) {
        case FeatureIsProtected.OTP:
        case FeatureIsProtected.IN_APP_OTP:
          return 'need';
        case FeatureIsProtected.NOT_NEEDED:
          return 'notNeed';
        default:
          return 'error';
      }
    } else {
      return 'notNeed';
    }

  }

  callForOtp() {
    return new Observable((observer: Subscriber<CallForOtpResponse>) => {
      this.deviceInfoService.getDeviceInfo().then(deviceInfo => {
        const payload: CallForOtpPayload = {
          device: deviceInfo
        };
        this.otpLoading.next(true);
        this.creditApiService.callForOtp(payload).subscribe({
          next: res => {
            this.otpLoading.next(false);
            observer.next(res);
          },
          error: e => {
            this.otpLoading.next(false);
            this.messageService.showErrorIfExists(e);
          }
        });
      });
    });
  }

  verifyOtp(otp: string, userId: string) {
    return new Observable(observer => {
      const payload: VerifyOtpPayload = {
        otp,
        userId,
        features: [this.selectedFeature]
      };
      this.otpLoading.next(true);
      this.creditApiService.verifyOtp(payload).subscribe({
        next: _ => {
          this.otpLoading.next(false);
          observer.next(true);
        },
        error: e => {
          this.otpLoading.next(false);
          observer.error(() => {
            throw throwError(() => {
              return e;
            });
          });
        }
      });
    });
  }
}
