import { Component, OnInit } from '@angular/core';
import { VerificationService } from '../verification.service';
import { Router } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';
import { RedirectService } from '../../../core/services/redirect.service';
import { FAILURE_DATA, OTP_USE_CASES } from '../../../core/constants';
import { MarketingAnalyticsService } from '../../../core/services/marketing-analytics.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {

  sendingSms = false;

  verifying = false;

  otp = '';

  clearSignal = 0;

  enableResendButton = false;

  useCase: string;

  constructor(
    private verificationService: VerificationService,
    private router: Router,
    private ms: MessageService,
    private redirectService: RedirectService,
    private marketingAnalyticsService: MarketingAnalyticsService
  ) {
  }

  ngOnInit() {
    if (!this.verificationService.anyFlowInProgress()) {
      this.router.navigateByUrl('/');
      return;
    }

    this.useCase = this.verificationService.useCase;

    this.sendSms();
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

  confirm() {
    this.verify();
  }

  cancel() {
    this.triggerClickEvent('CANCEL_OTP');
    this.redirectService.setAndRedirect(FAILURE_DATA, 'GET');
  }

  countDownFinished() {
    this.cancel();
  }

  otpEntered(value) {
    this.otp = value;
    this.verify();
  }

  private verify() {
    this.verifying = true;
    this.verificationService.verifyOtp(this.otp, this.verificationService.features).then((response) => {
      this.verifying = false;
      this.verificationService.verificationResult.next({
        verified: true
      });
    }, e => {
      this.verifying = false;
      this.clearSignal++;
      this.ms.showErrorIfExists(e);
    });
  }

  resendCountdownFinished() {
    this.enableResendButton = true;
  }

  triggerClickEvent(kind: string) {
    const category = 'wallet_activation';
    const actions = {
      CANCEL_OTP: 'user click on cancel button, left otp page',
      RESEND: 'user click on resend code button'
    };
    const action = actions [kind];
    this.marketingAnalyticsService.triggerEvent(category, action);
  }

  requestNewCode() {
    this.triggerClickEvent('RESEND');
    this.sendSms(true);
    this.clearSignal++;
    this.enableResendButton = false;
  }

  get verificationData() {
    return {
      description: this.verificationService.description,
      useCase: this.verificationService.useCase,
      cellNumber: this.verificationService.cellNumber,
    };
  }

  get boxTitle() {
    switch (this.verificationData.useCase) {
      case OTP_USE_CASES.PURCHASE:
        return 'پرداخت از کیف پول';
      case OTP_USE_CASES.ACTIVATE:
        return 'فعال‌سازی کیف‌پول';
      default:
        return '';
    }
  }

  finishedConfirmRemaining() {
    this.enableResendButton = true;
  }
}
