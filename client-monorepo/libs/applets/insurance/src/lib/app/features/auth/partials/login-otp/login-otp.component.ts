import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AppWindow } from '../../../../data-access/web-interfaces/app-window';
import { MatDialog } from '@angular/material/dialog';
import { EnterPasswordService } from '../../../../data-access/services/enter-password.service';
import { AuthService } from '../../service/auth.service';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { convertNonEnglishDigits } from '@digipay/strings';
import { FEATURE_NAMES, FEATURES } from '../../../../data-access/shared/security.enum';
import { NgIf } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { UiPinInputComponent } from '../../../../components/ui-pin-input/pin-input/ui-pin-input.component';
import { UiButtonComponent } from '../../../../components/ui-button/ui-button/ui-button.component';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { LoginService } from '../../../../data-access/services/user-services/login.service';
import { SharedUserSourceService } from '../../../../data-access/services/user-services/shared-user-source.service';
import { PinService } from '../../../../data-access/services/user-services/pin.service';
import { UrlService } from '../../../../data-access/services/url.service';
import { UserAuthService } from '../../../../data-access/services/user-services/user-auth.service';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { IAuthUserLoginModel } from '../../../../data-access/models/auth-user-login.model';
import { NavigationService } from '../../../../data-access/services/navigation.service';
import { DeviceInfoService } from '@client-monorepo/common/utilities';

declare const window: AppWindow;

@Component({
  selector: 'login-otp',
  templateUrl: 'login-otp.component.html',
  styleUrls: ['login-otp.component.scss'],
  imports: [NgIf, MatError, MatButton, UiPinInputComponent, UiButtonComponent, NgxCountDownComponent],
  standalone: true,
})
export class LoginOtpComponent implements OnInit, OnDestroy {
  constructor() {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required]],
    });
  }

  private matDialog = inject(MatDialog);
  private fb = inject(UntypedFormBuilder);
  private enterPasswordService = inject(EnterPasswordService);
  private authService = inject(AuthService);
  private cache = inject(MemoryCacheService);
  private router = inject(Router);
  private hybridService = inject(NgxHybridServiceService);
  private sharedUserSourceService = inject(SharedUserSourceService);

  // Inputs
  @Input()
  timeOutSeconds = 180;

  @Input()
  showChangeNumber = true;

  @Input()
  showDescDialog = true;

  @Input()
  isRedirectEnabled: boolean;

  // Outputs
  @Output() componentStatus = new EventEmitter<string>();

  cellNumber = '';
  otpCode = '';
  isSubmitting = false;
  otpForm: UntypedFormGroup;
  timeOutId;
  timeOutErrorMessageId;
  otpError = false;
  isTimeOver = false;
  isReadonly = false;
  otpValid = false;
  hasResponse = false;
  autoFillOtpCode = '';
  isAutoFill = false;

  private loginService = inject(LoginService);
  private pinService = inject(PinService);
  private urlService = inject(UrlService);
  private userAuthService = inject(UserAuthService);
  private navigationService = inject(NavigationService);
  private deviceInfoService = inject(DeviceInfoService);

  ngOnInit(): void {
    this.cellNumber = this.sharedUserSourceService.globalCellNumber.getValue();
    this.afterLogin();
    this.timeOutId = setTimeout(() => {
      this.openDialog();
    }, 60000);
    this.checkIsAutofillMode();
  }

  /**
   * This method is used for check enable autofill or not.
   * 1. Get autofill value from response of send-sms service in login-form component.
   * 2. check if we are in android hybrid mode and value of backend autofill
   * 3. Enable autofill mode.
   */
  private checkIsAutofillMode(): void {
    const isBackendAutoFill = this.sharedUserSourceService.globalIsAutofill.getValue();
    if (this.hybridService.isAndroidHybrid() && isBackendAutoFill) {
      this.isAutoFill = true;
      this.autoFillPin().then();
    }
  }

  openDialog(): void {
    this.matDialog.open(LoginDialogComponent, {
      hasBackdrop: false,
      maxWidth: '90%',
      direction: 'rtl',
      position: { top: '3%' },
    });
  }

  editCellNumber(): void {
    this.componentStatus.emit('SEND_CODE');
    this.matDialog.closeAll();
  }

  async sendCodeAgain(): Promise<void> {
    if (this.isAutoFill) {
      this.isReadonly = true;
    }
    this.isTimeOver = false;
    const device = await this.deviceInfoService.getDeviceInfo();
    const data = {
      cellNumber: convertNonEnglishDigits(this.cellNumber),
      device,
    };
    this.authService.getOTP(data).subscribe();
    this.isSubmitting = false;
  }

  onPinChange(event: any): void {
    const otpData = {
      smsToken: event,
      userId: this.sharedUserSourceService.globalUserId.getValue(),
    };

    if (event.length === 6) {
      this.isSubmitting = true;
      this.authService.sendOTP(otpData).subscribe({
        next: (data) => {
          this.handleOtpCodeResponse(data);
        },
        error: (error) => {
          this.handleOtpCodeError(error);
        },
      });
    }
  }

  timerFinish(): void {
    this.isTimeOver = true;
  }

  private async autoFillPin(): Promise<void> {
    const device = await this.deviceInfoService.getDeviceInfo();
    if (/^HUAWEI$/i.test(device?.manufacture)) {
      return;
    }
    this.isReadonly = true;
    window.digipayHybridApp.setOtpCode = (otp: string) => {
      this.autoFillOtpCode = otp;
    };

    window.digipayHybridApp.getOtpCode();
  }

  private handleOtpCodeResponse(data: IAuthUserLoginModel): void {
    this.isReadonly = false;
    this.cleanUpCacheData();
    if (data.hasPassword) {
      this.handleLoginWithPassword(data);
    } else {
      this.handleLoginWithoutPassword(data);
    }
  }

  private handleLoginWithPassword(data: IAuthUserLoginModel): void {
    const LOGIN_FEATURE_CODE = FEATURES[FEATURE_NAMES.LOGIN_HOME];
    this.sharedUserSourceService.userHasPassword.next(true);
    const doc = document as any;
    doc.activeElement.blur();
    const subscription = this.enterPasswordService
      .getUserPassword(data.userId, [LOGIN_FEATURE_CODE])
      .onLogin()
      .subscribe((login) => {
        if (login && this.enterPasswordService.isVerified(LOGIN_FEATURE_CODE)) {
          this.pinService.setCheckPinResultSubject('ture');
          this.enterPasswordService.hideGetPasswordWindow().clearData();
          subscription.unsubscribe();
          const afterLogin = this.urlService.getRequestedUrl();
          this.loginService.isLoggedIn = true;
          if (this.isRedirectEnabled) {
            this.navigateToUrl(afterLogin.url, afterLogin.queryParams, afterLogin.fragment);
          }
        }
      });
  }

  private handleLoginWithoutPassword(data: IAuthUserLoginModel): void {
    const afterLogin = this.urlService.getRequestedUrl();
    this.loginService.clearAfterLoginData();
    this.userAuthService.storeAuthTokenToStorage(data);
    this.loginService.isLoggedIn = true;
    if (this.isRedirectEnabled) {
      this.navigateToUrl(afterLogin.url, afterLogin.queryParams, afterLogin.fragment);
    }
  }

  private handleOtpCodeError(error: { error: any }): void {
    if (!error || !error.error.result) {
      this.isSubmitting = false;
      this.hasResponse = true;
      this.otpError = true;
      this.isReadonly = false;
      return;
    }

    if (error.error.result.status === 1089) {
      this.isReadonly = true;
      this.hasResponse = false;
      this.otpValid = true;
      this.otpError = true;
      this.timeOutErrorMessageId = setTimeout(() => this.clearError(), 2000);
      this.isSubmitting = false;
    }
  }

  private clearError(): void {
    clearTimeout(this.timeOutErrorMessageId);
    this.otpError = false;
    this.isReadonly = false;
    this.otpValid = false;
  }

  private cleanUpCacheData(): void {
    // Perform cache cleanup operations here
    this.cache.clean();
  }

  private afterLogin(): void {
    this.loginService.isLoggedIn$.subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          this.matDialog.closeAll();
        }
      },
    });
  }

  private navigateToUrl(url: string, queryParams: any, fragment: string | null = null): void {
    this.navigationService
      .replace([url], {
        queryParams,
        fragment: fragment || null,
      })
      .then(() => this.loginService.clearAfterLoginData());
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeOutId);
    this.matDialog.closeAll();
  }
}
