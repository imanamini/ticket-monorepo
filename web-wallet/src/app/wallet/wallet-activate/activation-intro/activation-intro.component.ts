import { Component, Input, OnInit } from '@angular/core';
import { TacResponse } from '../../../api/models/tac.response';
import { OTP_USE_CASES } from '../../../core/constants';
import { FEATURE_NAMES, FEATURES } from '../../../api/constants';
import { VerificationService } from '../../auth/verification.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { WalletApiService } from '../../../api/wallet-api.service';
import { MatDialog } from '@angular/material/dialog';
import { PageDialogComponent } from '../../../user-interface/dialogs/page-dialog/page-dialog.component';
import { MessageService } from '../../../core/services/message.service';
import { RedirectService } from '../../../core/services/redirect.service';
import { MarketingAnalyticsService } from '../../../core/services/marketing-analytics.service';

@Component({
  selector: 'app-activation-intro',
  templateUrl: './activation-intro.component.html',
  styleUrls: ['./activation-intro.component.scss']
})
export class ActivationIntroComponent implements OnInit {

  @Input()
  tacInfo: TacResponse;

  @Input()
  ticket: string;

  otpVerificationSubscription: Subscription;

  gettingTac = false;

  constructor(
    private verification: VerificationService,
    private router: Router,
    private walletApi: WalletApiService,
    private matDialog: MatDialog,
    private messageService: MessageService,
    private redirect: RedirectService,
    private marketingAnalyticsService: MarketingAnalyticsService
  ) {
  }

  ngOnInit() {
  }

  confirm() {
    this.triggerClickEvent('CONTINUE');
    this.verification.startNewFlow({
      useCase: OTP_USE_CASES.ACTIVATE,
      ticket: this.ticket,
      cellNumber: this.tacInfo.userDetail.cellNumber,
      description: 'کد فعال سازی ارسال شده با پیامک را وارد کنید',
      features: [
        FEATURES[FEATURE_NAMES.PAYMENT_WALLET]
      ]
    });

    this.verifyWithOtp().then(() => {
      this.router.navigateByUrl('/wallet/activated', {
        state: {
          success: true,
        }
      });
    }).catch(e => {
    });

    this.router.navigateByUrl('/auth/otp');
  }

  private verifyWithOtp(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.otpVerificationSubscription = this.verification.onVerify().subscribe(result => {
        if (result.verified) {
          if (this.verification.isFeatureVerified(OTP_USE_CASES.ACTIVATE, this.tacInfo.userDetail.cellNumber)) {
            this.verification.clearVerificationData();
            this.verification.clearFlowData();
            if (this.otpVerificationSubscription) {
              this.otpVerificationSubscription.unsubscribe();
              resolve(true);
            }
          } else {
            reject();
          }
        }
      });
    });
  }

  triggerClickEvent(kind: string) {
    const category = 'wallet_pay';
    const actions = {
      TERMS: 'user click on terms & condition button',
      CANCEL: 'user click on cancel button',
      CONTINUE: 'user click on continue button',
    };
    const action = actions [kind];
    this.marketingAnalyticsService.triggerEvent(category, action);
  }

  tacButtonClick() {
    this.triggerClickEvent('TERMS');
    if (this.gettingTac) {
      return;
    }
    this.gettingTac = true;
    this.walletApi.getTextFile('in-app-tac').subscribe(response => {
      this.gettingTac = false;
      this.matDialog.open(PageDialogComponent, {
        maxWidth: '90%',
        maxHeight: '80vh',
        panelClass: [
          'page-dialog-component'
        ],
        data: {
          html: response,
          title: 'شرایط استفاده از کیف پول'
        }
      });
    }, e => {
      this.gettingTac = false;
      if (e.error && e.error.result) {
        this.messageService.showErrorIfExists(e);
      } else {
        this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
      }
    });
  }

  /**
   * Cancel activation
   */
  cancelActivation() {
    this.triggerClickEvent('CANCEL');
    this.backToSafePlace();
  }

  private backToSafePlace() {
    setTimeout(() => {
      this.redirect.setAndRedirect([], 'GET');
    }, 150);
  }

}
