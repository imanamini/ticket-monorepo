import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {WalletApiService} from '../../api/wallet-api.service';
import {MessageService} from '../../core/services/message.service';
import {VerificationService} from '../../wallet/auth/verification.service';
import {FEATURE_NAMES, FEATURES} from '../../api/constants';
import {ProtectionFeed} from './protection-feed.interface';
import {Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Location} from '@angular/common';
import {ErrorStatusEnum} from '../../api/emuns/error-status.enum';

@Component({
  selector: 'ui-code-protection-applet',
  templateUrl: './code-protection-applet.component.html',
  styleUrls: ['./code-protection-applet.component.scss']
})
export class CodeProtectionAppletComponent implements OnInit, OnDestroy {

  pin = '';

  otp = '';

  useCase: string;

  clearSignal = 0;

  verifying = false;

  sendingSms = false;

  otpVerified = false;

  pinVerified = false;

  verifyFeatures = [];

  callingLoginApi = false;

  resendRemainingTime = 120;

  enableResendButton = false;

  showSubscriptionMessages: boolean;

  subscriptionArray: Array<Subscription> = [new Subscription()];

  @Input()
  showForgotPinAction = false;

  @Input()
  showWalletBalance = true;

  @Input()
  protectionData: ProtectionFeed;

  @Input()
  automatic = true;

  @Input()
  userFullName = '';

  @Input()
  callbackUrl: string;

  @Input()
  hideAfterVerify = true;

  @Output()
  checked = new EventEmitter<{ confirmed: boolean, verified: boolean }>();

  @Output()
  onFillCode = new EventEmitter<{ OTP: string, verifyFeatures: Array<number> }>();

  constructor(
    private router: Router,
    private walletApi: WalletApiService,
    private messageService: MessageService,
    private verificationService: VerificationService,
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.initialSetup();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptionArray) {
      subscription.unsubscribe();
    }
  }

  confirm(): void {
    switch (this.protectionData.protection) {
      case 'OTP':
        this.checked.emit({
          confirmed: true,
          verified: this.otpVerified,
        });
        break;
      case 'PIN':
        this.callLoginApi();
        break;
    }
  }

  cancel(): void {
    this.checked.emit({
        confirmed: false,
        verified: false,
      }
    );
  }

  inputEntered(value): void {
    if (this.protectionData.protection === 'OTP') {
      this.otp = value;
      this.fillCodeOperation();
    } else if (this.protectionData.protection === 'PIN') {
      this.pin = value;
      this.callLoginApi();
    }
  }

  onFinishedResendRemaining(): void {
    this.enableResendButton = true;
  }

  requestNewCode(): void {
    if (this.enableResendButton) {
      this.sendSms(true);
      this.clearSignal++;
      this.enableResendButton = false;
    }
  }

  private callLoginApi(): void {
    this.callingLoginApi = true;
    const subscription = this.walletApi.loginUser(this.protectionData.userDetail.userId, this.pin, [
      FEATURES[FEATURE_NAMES.PAYMENT_WALLET]
    ], this.verificationService.ticket).subscribe(() => {
      this.callingLoginApi = false;
      this.pinVerified = true;
      this.checked.emit({
        confirmed: this.pinVerified,
        verified: true
      });
    }, e => {
      this.checked.emit({
        confirmed: false,
        verified: false
      });
      this.clearSignal++;
      this.callingLoginApi = false;
      this.pin = '';
      this.messageService.showErrorIfExists(e);
      this.closeSession(e);
    });

    this.subscriptionArray.push(subscription);
  }

  private verify(): void {
    this.verifying = true;
    this.verificationService.verifyOtp(this.otp, this.verifyFeatures).then(() => {
      this.verifying = false;
      this.otpVerified = true;
      this.verificationService.verificationResult.next({
        verified: true
      });
      this.confirm();
    }, e => {
      this.checked.emit({
        confirmed: false,
        verified: false
      });
      this.verifying = false;
      this.clearSignal++;
      this.messageService.showErrorIfExists(e);
      this.changeDetectorRef.detectChanges();
    });
  }

  private sendSms(resend = false): void {
    this.sendingSms = true;
    const subscription = this.verificationService.sendOtp().subscribe(() => {
      this.sendingSms = false;
      if (resend) {
        this.enableResendButton = false;
      }
    }, e => {
      this.sendingSms = false;
      this.messageService.showErrorIfExists(e);
      this.closeSession(e);
    });

    this.subscriptionArray.push(subscription);
  }

  private initialSetup(): void {
    this.useCase = this.verificationService.useCase;
    if (this.protectionData.protection === 'OTP') {
      this.sendSms();
    }
    this.verifyFeatures = this.protectionData.features || this.verificationService.features;
    this.showSubscriptionMessages = this.protectionData.showSubscriptionMessages || false;
  }

  private fillCodeOperation(): void {
    if (this.automatic) {
      this.verify();
      return;
    }
    this.onFillCode.emit({OTP: this.otp, verifyFeatures: this.verifyFeatures});
  }

  private closeSession(errorResponse: HttpErrorResponse): void {
    const invalidPin: boolean = Boolean(errorResponse.error.result.status === ErrorStatusEnum.INVALID_PIN);
    if (invalidPin) {
      const errorMessage: string = errorResponse.error.result.message;
      this.messageService.showErrorMessage(errorMessage);
      return;
    }

    if (errorResponse.status === ErrorStatusEnum.UNAUTHORIZED) {
      if (this.callbackUrl) {
        document.location.href = this.callbackUrl;
        return;
      }

      this.location.back();
    }
  }
}
