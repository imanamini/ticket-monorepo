import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageService } from '@client-monorepo/common/utilities';
import { WalletApiClient } from '../../../data-access/services/wallet-api-client.service';
import { InAppTacResponse, TacService } from '@client-monorepo/common/user';
import { WalletPayService } from '@client-monorepo/applets/cash-in';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgIf } from '@angular/common';
import { WalletCardComponent } from '../wallet-card/wallet-card.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FeaturesService } from '../../../data-access/services/features.service';
import { FEATURE_NAMES, FEATURES } from '@client-monorepo/payment/purchase';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PinComponent } from '@client-monorepo/common/pin';
import { PinStatus } from '@digipay/ngx-pin';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-out-applet-wallet-pay',
  templateUrl: './wallet-pay.component.html',
  styleUrls: ['./wallet-pay.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent, NgIf, WalletCardComponent, NgxButtonComponent],
})
export class WalletPayComponent implements OnInit, OnDestroy {
  gettingBalance = true;
  balance = 0;
  ticket = '';
  userSubscription!: Subscription;

  constructor(
    private walletApi: WalletApiClient,
    private messageService: MessageService,
    private walletPayService: WalletPayService,
    private tacService: TacService,
    private router: Router,
    private featuresService: FeaturesService,
    private bottomSheetService: NgxBottomSheetService,
    private walletGtm: WalletGtmService,
    @Inject('APP_ENV') private environment: { [key: string]: string },
  ) {}

  ngOnInit() {
    this.ticket = this.walletPayService.ticket;
    this.walletPayService.clear();

    this.walletApi.getWalletBalance().subscribe(
      (response) => {
        this.gettingBalance = false;
        this.balance = response.amount;
      },
      (e) => {
        if (e && e.error.result.message) {
          this.messageService.showErrorOfErrorResponse(e);
        }
      },
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  pay() {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHOUT_TRANSFER_PURCHASE);
    // set gettingBalance state to hide pay button and display loading after click
    const ticket = sessionStorage.getItem('TICKET');

    if (!ticket) {
      this.gettingBalance = false;
      return;
    }

    this.tacService.inAppTac(ticket).subscribe((response) => {
      // update features in it's service
      this.featuresService.setFeatures(response);
      const r = response as InAppTacResponse;

      if (Object.prototype.hasOwnProperty.call(r.features, FEATURES[FEATURE_NAMES.PAYMENT_WALLET])) {
        const walletPayFeature = this.featuresService.getFeature(FEATURE_NAMES.PAYMENT_WALLET);
        const prefix = this.environment['base_url'];
        const relativePayUrl = walletPayFeature.url.substr(walletPayFeature.url.indexOf(prefix) + prefix.length);

        let payPromise = null;

        switch (walletPayFeature.protectedBy) {
          case 'PIN':
            payPromise = this.getPasswordThenFinalize();
            break;
          case 'OTP':
          case 'IN_APP_VERIFICATION':
            this.router.navigateByUrl('/cash-out/verification').then();
            break;
          case 'NONE':
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
   * Finalize the payment using the dynamic pay url
   * that got from the in-app-tac response
   *
   * @param payUrl
   */
  private finalizePayment(payUrl: string) {
    this.walletApi.payByWallet(payUrl, this.ticket).subscribe(
      (response) => {
        this.walletPayService.payResponse.next(response);
      },
      (response) => {
        this.walletPayService.payResponse.next(response);
      },
    );
  }

  private getPasswordThenFinalize() {
    return new Promise((resolve, reject) => {
      this.bottomSheetService.openBottomSheet(PinComponent, {});
      this.bottomSheetService.onClose.subscribe(() => {
        if (this.bottomSheetService.outputData()?.res === PinStatus.SUCCESS) {
          resolve(true);
        }
      });
    });
  }
}
