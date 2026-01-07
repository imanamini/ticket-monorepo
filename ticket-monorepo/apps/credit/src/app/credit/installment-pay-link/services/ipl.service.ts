import { Injectable, signal } from '@angular/core';
import { IplUserInfo } from '../models/user-info.model';
import { CreditApiService } from '../../api/credit-api.service';
import { InstallmentPayLinkResponse } from '../../api/installment-pay-link/installment-pay-link.response';
import { CreditPayService } from '../../shared/services/credit-pay.service';
import { DeviceInfoService } from '../../shared/services/device-info/device-info.service';
import { SendSmsBody } from '../../api/login/send-sms';
import { LoginApiService } from '../../api/login/login-api.service';
import { MessageService } from '../../core/services/message.service';
import { Observable } from 'rxjs';
import { SendOtpBody, SendOtpResponse } from '../../api/login/send-otp';
import { convertNonEnglishDigits } from '@digipay/strings';
import { LoginResponse } from '../../api/login/login.response';
import { IplErrorService } from '../ipl-errors/services/ipl-error.service';
import { IplErrorEnum } from '../ipl-errors/data-access/ipl-error';
import { Router } from '@angular/router';

@Injectable()
export class IplService {

  #userInfo = signal<IplUserInfo | null>(null);
  #loading = signal<boolean>(false);
  #pageInnerLoading = signal<boolean>(false);
  #referer = signal<string>('');

  constructor(
    private http: CreditApiService,
    private payService: CreditPayService,
    private deviceInfoService: DeviceInfoService,
    private loginApiService: LoginApiService,
    private messageService: MessageService,
    private iplErrorService: IplErrorService,
    private router: Router,
  ) {
  }

  get userInfo() {
    return this.#userInfo.asReadonly();
  }

  get isLoading() {
    return this.#loading.asReadonly();
  }

  get pageInnerLoading() {
    return this.#pageInnerLoading.asReadonly();
  }

  get referer() {
    return this.#referer.asReadonly();
  }

  setLoading(loading: boolean) {
    this.#loading.set(loading);
  }

  setPageInnerLoading(loading: boolean) {
    this.#pageInnerLoading.set(loading);
  }

  setReferer(referer: string) {
    this.#referer.set(referer);
  }

  setUserUuid(uuid: string) {
    this.#userInfo.update((user) => ({...user, uuid}));
  }

  setUserCellNumber(cellNumber: string) {
    this.#userInfo.update((user) => ({...user, cellNumber}));
  }

  setUserId(userId: string) {
    this.#userInfo.update(user => ({...user, userId}));
  }

  initUserInfo(userInfo: InstallmentPayLinkResponse): void {
    this.#userInfo.update(user => ({...user, ...userInfo}));
  }

  getInformation() {
    this.setLoading(true);
    this.http.getUserInfoForPayByLink(this.userInfo().uuid, this.referer()).subscribe({
      next: (res) => {
        this.setLoading(false);

        if (res.isCutOffTime) {
          return this.handleCutOff();
        }

        this.initUserInfo(res);
        this.router.navigate(['ipl', this.#userInfo().uuid]);
      },
      error: e => {
        this.setLoading(false);
        this.payService.goToErrorPageByErrorResponse(e);
      }
    });
  }

  sendSms() {
    return new Observable(observer => {
      this.deviceInfoService.getDeviceInfo().then(deviceInfo => {
        const payload: SendSmsBody = {
          cellNumber: this.userInfo().cellNumber,
          device: deviceInfo,
        };

        this.setPageInnerLoading(true);
        this.loginApiService.sendSms(payload).subscribe({
          next: res => {
            this.setPageInnerLoading(false);
            this.setUserId(res.userId);
            observer.next(res);
          },
          error: e => {
            this.setPageInnerLoading(false);
            this.messageService.showErrorIfExists(e);
          }
        });
      });
    });
  }

  sendOtp(otp: string) {
    return new Observable<SendOtpResponse>(observer => {
      const payload: SendOtpBody = {
        smsToken: otp,
        userId: this.userInfo().userId,
      };

      this.loginApiService.sendOtpCode(payload).subscribe({
        next: res => {
          observer.next(res);
        },
        error: e => {
          observer.error(e);
        }
      });
    });
  }

  login(pin: string) {
    return new Observable<LoginResponse>(observer => {
      this.deviceInfoService.getDeviceInfo().then(deviceInfo => {
        const payload = {
          device: deviceInfo,
          features: [100],
          username: this.userInfo().userId,
          password: convertNonEnglishDigits(pin),
        };

        this.loginApiService.login(payload).subscribe({
          next: res => {
            observer.next(res);
          },
          error: e => {
            observer.error(e);
          }
        });
      });
    });
  }

  private handleCutOff() {
    this.iplErrorService.setErrorEnum(IplErrorEnum.CutOff);
    this.router.navigate(['ipl', this.#userInfo().uuid, 'error']);
  }
}
