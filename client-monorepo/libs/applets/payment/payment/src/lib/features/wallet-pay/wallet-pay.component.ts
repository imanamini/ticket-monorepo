import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FEATURE_NAMES, FEATURES, WalletPayService } from '@client-monorepo/payment/purchase';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { InAppTacResponse, PROTECTIONS, TacService, UserDataService, VerificationService } from '@client-monorepo/common/user';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { WalletApiService } from '@client-monorepo/payment/wallet';
import { EnterPasswordService } from '../../data-access/services/enter-password.service';
import { EnterPasswordComponent } from '../../data-access/components/enter-password/enter-password.component';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WalletCardComponent } from '@client-monorepo/applets/cash-out';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'payment-applet-wallet-pay',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    NgxSkeletonLoadingComponent,
    EnterPasswordComponent,
    NgxButtonComponent,
    WalletCardComponent,
  ],
  templateUrl: './wallet-pay.component.html',
  styleUrls: ['./wallet-pay.component.scss'],
})
export class WalletPayComponent implements OnInit, OnDestroy {
  gettingBalance = true;

  balance = 0;

  ticket = '';

  subscriptions: Subscription[] = [];

  getPassword = false;

  constructor(
    private walletApiService: WalletApiService,
    private messageService: MessageService,
    private walletPayService: WalletPayService,
    private tacService: TacService,
    private router: Router,
    private userDataService: UserDataService,
    private verificationService: VerificationService,
    private enterPasswordService: EnterPasswordService,
    private storageService: StorageService,
    private bottomNavigationService: NgxBottomNavigationService,
    private backHandlerService: BackHandlerService,
    @Inject('APP_ENV') private environment: { [key: string]: string },
  ) {}

  ngOnInit() {
    this.bottomNavigationService.hide();
    if (!this.walletPayService.ticket) {
      this.backHandlerService.goBack();
      return;
    }
    this.checkEnterPasswordStep();

    this.ticket = this.walletPayService.ticket;
    this.walletPayService.clear();

    this.walletApiService.getWalletBalance().subscribe(
      (response) => {
        this.gettingBalance = false;
        this.balance = response.amount;
      },
      (e) => {
        if (e && e.result.message) {
          this.messageService.showErrorOfErrorResponse(e);
        }
      },
    );
  }

  checkEnterPasswordStep() {
    const enterPassSub = this.enterPasswordService.enterPassword.subscribe((state) => {
      this.getPassword = state;
    });
    this.subscriptions.push(enterPassSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  pay() {
    // set gettingBalance state to hide pay button and display loading after click
    this.gettingBalance = true;
    const ticket = this.ticket;

    if (!ticket) {
      this.gettingBalance = false;
      return;
    }

    this.tacService.inAppTac(ticket).subscribe((response) => {
      // update features in it's service
      // todo handle setting userHasPassword value for intrack events if is needed
      const r = response as InAppTacResponse;
      if (Object.prototype.hasOwnProperty.call(r.features, FEATURES[FEATURE_NAMES.PAYMENT_WALLET])) {
        const walletPayFeature = response.features[FEATURES[FEATURE_NAMES.PAYMENT_WALLET]];
        const prefix = this.environment['base_url'];
        const relativePayUrl = walletPayFeature.url.substr(walletPayFeature.url.indexOf(prefix) + prefix.length);

        let payPromise = null;
        switch (walletPayFeature.isProtected) {
          case PROTECTIONS.PIN:
            payPromise = this.getPasswordThenFinalize();
            break;
          case PROTECTIONS.OTP:
          case PROTECTIONS.IN_APP_VERIFICATION:
            payPromise = this.verifyWithOtp();
            break;
          case PROTECTIONS.NONE:
            // no protection, jump to finalize step
            payPromise = new Promise<void>((resolve) => {
              resolve();
            });
            break;
        }

        if (payPromise) {
          payPromise.then(() => {
            this.finalizePayment(relativePayUrl);
          });
        }
      }
    });
  }

  /**
   *
   */
  private otpVerificationSubscription!: Subscription;

  /**
   * Verify user's identity with OTP then
   * call the finalize api
   */
  private verifyWithOtp() {
    return new Promise((resolve) => {
      this.getUserCellNumber().then((cellNumber) => {
        // start a new verification flow
        this.verificationService.startNewFlow({
          useCase: FEATURE_NAMES.PAYMENT_WALLET,
          description: 'به منظور احراز هویت شماره همراه شما، کد فعال‌سازی به شماره همراه بالا ارسال خواهد شد.',
          cellNumber,
          features: [FEATURES[FEATURE_NAMES.PAYMENT_WALLET]],
          backUrl: this.walletPayService.homeUrl,
          ticket: this.ticket,
        });

        // redirect to verification page
        this.router.navigateByUrl('/payment/verification/confirm').then();

        // subscribe to verification changes
        // to act upon verification end
        this.otpVerificationSubscription = this.verificationService.verificationResult.subscribe((result) => {
          if (
            result.verified &&
            this.verificationService.isFeatureVerified(FEATURE_NAMES.PAYMENT_WALLET as keyof typeof FEATURE_NAMES, cellNumber)
          ) {
            this.verificationService.clearFlowData();
            this.verificationService.clearVerificationData();
            if (this.otpVerificationSubscription) {
              this.otpVerificationSubscription.unsubscribe();
            }
            resolve(true);
          }
        });
      });
    });
  }

  /**
   * Get user cell number based on the data
   * (Get from the API or local data)
   */
  private getUserCellNumber(): Promise<string> {
    return new Promise((resolve) => {
      let cellNumber;
      this.userDataService.getUserDetail().then((userData) => {
        cellNumber = userData.cellNumber;
        resolve(cellNumber);
      });
    });
  }

  /**
   * Get user's password then call the finalize API
   */
  private getPasswordThenFinalize() {
    return new Promise<void>((resolve) => {
      const userId = this.storageService.getUserId();
      const subscription = this.enterPasswordService
        .getUserPassword(userId, [FEATURES[FEATURE_NAMES.PAYMENT_WALLET]])
        .onLogin()
        .subscribe((login) => {
          if (login && this.enterPasswordService.isVerified(FEATURES[FEATURE_NAMES.PAYMENT_WALLET])) {
            this.enterPasswordService.hideGetPasswordWindow().clearData();
            if (subscription) {
              subscription.unsubscribe();
            }
            resolve();
          }
        });
    });
  }

  /**
   * Finalize the payment using the dynamic pay url
   * that got from the in-app-tac response
   *
   * @param payUrl
   */
  private finalizePayment(payUrl: string) {
    this.walletApiService.payByWallet(payUrl, this.ticket).subscribe(
      (response) => {
        this.walletPayService.payResponse.next(response);
      },
      (response) => {
        this.walletPayService.payResponse.next(response);
        /*if (response.result && response.result.status === 8151) {
        this.messageService.showErrorMessage(response.result.message);
      }*/
      },
    );
  }
}
