import { UpgStrategy } from '../models/upg-strategy.interface';
import { PageEnum } from '../models/page.enum';
import { inject, Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { Tac } from '../../components/tac/tac';
import { CashInAndPay } from '../../components/cash-in-and-pay/cash-in-and-pay';
import { WalletPay } from '../../components/wallet-pay/wallet-pay';
import { Otp } from '../../components/otp/otp';
import { Pin } from '../../components/pin/pin';
import { CashInRedirect } from '../../components/redirect-cash-in/cash-in-redirect';
import { CashOut } from '../../components/cash-out/cash-out';

@Injectable({
  providedIn: 'root',
})
export class PageManagementService implements UpgStrategy {
  private urlService = inject(UrlService);

  // @ts-expect-error strategies
  private strategies: Record<PageEnum, UpgStrategy> = {
    [PageEnum.TERMS_AND_CONDITIONS]: new Tac(),
    // [PageEnum.PAYMENT_METHOD]: new PaymentMethod(),
    [PageEnum.CASH_IN_AND_PAY]: new CashInAndPay(),
    // [PageEnum.ICP_INVALID_AMOUNT]: new CAndPInValidAmount(),
    // [PageEnum.ICP_VALID_AMOUNT]: new CAndPValidAmount(),
    // [PageEnum.CPOTP]: new CPOtp(),
    // [PageEnum.CPPIN]: new CPPin(),
    [PageEnum.WALLET_PAY]: new WalletPay(),
    [PageEnum.OTP]: new Otp(),
    [PageEnum.PIN]: new Pin(),
    [PageEnum.CASH_IN_REDIRECT]: new CashInRedirect(),
    [PageEnum.CASH_OUT]: new CashOut(),
  };

  implement(page: PageEnum): void {
    if (!this.strategies[page]) {
      console.error('صفحه مورد نظر وجود ندارد.');
      return;
    }
    this.urlService.addPageToQueryParam(page);
    this.strategies[page].implement(page);
  }
}
