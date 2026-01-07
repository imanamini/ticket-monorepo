import { inject, Injectable } from '@angular/core';
import { PayMethodPickerComponent } from '../../components/purchase-method-picker/pay-method-picker.component';
import { Subscription } from 'rxjs';
import { AppNameService, MessageService, StorageService } from '@client-monorepo/common/utilities';
import {
  DpgPayService,
  GATEWAY_TO_FEATURE_MAP,
  PAYMENT_GATEWAYS,
  PAYMENT_METHOD,
  PaymentResultInterface,
  PayMethodResult,
  WalletPayService,
} from '@client-monorepo/payment/purchase';
import { TacService } from '@client-monorepo/common/user';
import { Router } from '@angular/router';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { DigikalaService } from '@client-monorepo/pillar/digikala';

@Injectable({
  providedIn: 'root',
})
export class PayMethodPickerService {
  paySubscription!: Subscription;
  storageService = inject(StorageService);

  constructor(
    private bottomSheetService: NgxBottomSheetService,
    private tacService: TacService,
    private messageService: MessageService,
    private hybridService: NgxHybridService,
    private dpgPayService: DpgPayService,
    private walletPayService: WalletPayService,
    private router: Router,
    private appNameService: AppNameService,
    private digikalaService: DigikalaService,
  ) {}

  goToIpg(payMethod: PayMethodResult, ticket: string): void {
    if (payMethod.feature.url) {
      this.openIpg(payMethod.feature.url, ticket);
    }
  }

  openIpg(url: string, ticket: string) {
    if (url.slice(-1) !== '/') {
      url = url + '/';
    }
    if (this.appNameService.isPillar()) {
      return this.digikalaService.openExternalLink(url + ticket);
    }
    if (this.hybridService.isHybrid()) {
      this.storageService.setRedirectionTimestamp(Date.now());
      return this.hybridService.openUrlInHybrid(url + ticket, false);
    }
    window.open(url + ticket, '_self');
  }

  payTicketByWallet(ticket: string, homeUrl: string, resultPageUrl = '') {
    this.walletPayService.startPayFlow(ticket, homeUrl);
    this.paySubscription = this.walletPayService.afterPay().subscribe((payResult) => {
      if (payResult.result?.status === 0) {
        this.walletPayService.clear();
        if (this.paySubscription) {
          this.paySubscription.unsubscribe();
        }
        this.walletPayService.goToPaymentResultPage(payResult, resultPageUrl);
      } else {
        this.messageService.showErrorOfErrorResponse(payResult);
        if (homeUrl) {
          this.router.navigateByUrl(homeUrl);
        }
      }
    });
  }

  payByDpg(ticket: string, homeUrl: string, resultPageUrl = '', amount = 0) {
    this.dpgPayService.startPayFlow(ticket, homeUrl, amount);
    this.paySubscription = this.dpgPayService.afterPay().subscribe((payResult: PaymentResultInterface | any) => {
      if (payResult?.result?.status === 0) {
        this.dpgPayService.clear();
        if (this.paySubscription) {
          this.paySubscription.unsubscribe();
        }
        this.dpgPayService.goToPaymentResultPage(payResult, resultPageUrl);
      } else {
        this.messageService.showErrorOfErrorResponse(payResult);
      }
    });
  }

  ask(amount: number, payTicket: string): Promise<PayMethodResult> {
    return new Promise((resolve, reject) => {
      this.tacService.inAppTac(payTicket).subscribe((tacResponse) => {
        if (tacResponse.gateways.length === 0) {
          // No gateway is available
          this.messageService.showErrorMessage('در حال حاضر امکان پرداخت وجود ندارد');
          reject(null);
          return;
        }

        if (tacResponse.gateways.length === 1) {
          // there is only gateway available, no need to ask from user
          const DEFAULT_GATEWAY = PAYMENT_GATEWAYS[tacResponse.gateways[0] as keyof typeof PAYMENT_GATEWAYS];
          const featureCode = GATEWAY_TO_FEATURE_MAP[DEFAULT_GATEWAY as keyof typeof GATEWAY_TO_FEATURE_MAP];
          resolve({
            feature: tacResponse.features[featureCode],
            method: DEFAULT_GATEWAY as PAYMENT_METHOD,
          });
          return;
        }
        this.bottomSheetService.openBottomSheet(PayMethodPickerComponent, {
          amount,
          tacResponse,
        });
        const payMethodPickerSub = this.bottomSheetService.onClose.subscribe(() => {
          payMethodPickerSub.unsubscribe();
          const result = this.bottomSheetService.outputData();
          resolve(result);
        });
      });
    });
  }

  goToUpg(redirectUrl: string) {
    window.open(redirectUrl, '_self');
  }
}
