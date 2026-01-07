import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { UserDetail } from '../../../api/models/tac.response';
import { FEATURE_NAMES, FEATURES } from '../../../api/constants';
import { MessageService } from '../../../core/services/message.service';
import { VerificationService } from '../../../wallet/auth/verification.service';
import { Router } from '@angular/router';
import { GA_SUBSCRIPTION_ID } from '../../../api/constants/ga-subscription-id';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-pin-dialog.component.html',
  styleUrls: ['./otp-pin-dialog.component.scss']
})
export class OtpPinDialogComponent implements OnInit, AfterViewInit {

  step = 0;

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

  GA_SUBSCRIPTION_CONTRACT_ID = GA_SUBSCRIPTION_ID.CONTRACT;

  constructor(
    private router: Router,
    private matDialogRef: MatDialogRef<OtpPinDialogComponent>,
    private walletApi: WalletApiService,
    private messageService: MessageService,
    private ms: MessageService,
    private verificationService: VerificationService,
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      amount: number | null,
      walletBalance: number | null,
      protection: 'OTP' | 'PIN',
      userDetail: UserDetail,
      features: any,
      showSubscriptionMessages: boolean | null,
      googleAnalyticId?: {
        wrapperId: string
      };
    }
  ) {
    this.step = this.dialogData.protection === 'OTP' ? 0 : 1;
  }

  ngOnInit() {
    // if (!this.verificationService.anyFlowInProgress()) {
    // this.router.navigateByUrl('/');
    // return;
    // }

    this.useCase = this.verificationService.useCase;

    if (this.step === 0) {
      this.sendSms();
    }

    this.verifyFeatures = this.dialogData.features || this.verificationService.features;
    this.showSubscriptionMessages = this.dialogData.showSubscriptionMessages || false;
  }

  ngAfterViewInit(): void {

  }

  enteredPin(value) {
    this.pin = value;
    if (this.pin.length === 4) {
      this.callLoginApi();
    }
  }

  confirm() {
    switch (this.dialogData.protection) {
      case 'OTP':
        this.matDialogRef.close({
          confirmed: true,
          verified: this.otpVerified,
        });
        break;
      case 'PIN':
        this.callLoginApi();
        break;
    }
  }

  cancel() {
    this.matDialogRef.close({
      confirmed: false,
      verified: false,
    });
  }

  /**
   * Call login API
   */
  private callLoginApi() {
    this.callingLoginApi = true;
    this.walletApi.loginUser(this.dialogData.userDetail.userId, this.pin, [
      FEATURES[FEATURE_NAMES.PAYMENT_WALLET]
    ]).subscribe(response => {
      this.callingLoginApi = false;
      this.pinVerified = true;
      this.matDialogRef.close({
        confirmed: this.pinVerified,
        verified: true
      });
    }, e => {
      this.clearSignal++;
      this.callingLoginApi = false;
      this.pin = '';
      this.messageService.showErrorIfExists(e);
    });
  }

  inputEntered(value) {
    if (this.step === 0) {
      this.otp = value;
      this.verify();
    } else if (this.step === 1) {
      this.pin = value;
      this.callLoginApi();
    }
  }

  private verify() {
    this.verifying = true;
    this.verificationService.verifyOtp(this.otp, this.verifyFeatures).then((response) => {
      this.verifying = false;
      this.otpVerified = true;
      this.verificationService.verificationResult.next({
        verified: true
      });
      this.confirm();
    }, e => {
      this.verifying = false;
      this.clearSignal++;
      this.ms.showErrorIfExists(e);
    });
  }

  private sendSms(resend = false) {
    this.sendingSms = true;
    this.verificationService.sendOtp().subscribe(response => {
      this.sendingSms = false;
      if (resend) {
        this.enableResendButton = false;
      }
    }, e => {
      this.sendingSms = false;
      this.ms.showErrorIfExists(e);
    });
  }

  onFinishedResendRemaining() {
    this.enableResendButton = true;
  }

  requestNewCode() {
    if (this.enableResendButton) {
      this.sendSms(true);
      this.clearSignal++;
      this.enableResendButton = false;
    }
  }
}
