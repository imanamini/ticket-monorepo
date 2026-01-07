import {UpgStrategy} from '../models/upg-strategy.interface';
import {PageEnum} from '../enums/page.enum';
import {Tac} from '../components/tac/tac';
import {PaymentMethod} from '../components/payment-method/payment-method';
import {CashInAndPay} from '../components/cash-in-and-pay/cash-in-and-pay';
import {WalletPay} from '../components/wallet-pay/wallet-pay';
import {CashInRedirect} from '../components/redirect-cash-in/cash-in-redirect';
import {inject, Injectable} from '@angular/core';
import {UrlService} from './url.service';
import {Otp} from "../components/otp/otp";
import {Pin} from "../components/pin/pin";
import {CPOtp} from "../components/new-cash-in-and-pay/c-p-otp/c-p-otp";
import {CPPin} from "../components/new-cash-in-and-pay/c-p-pin/c-p-pin";
import {CAndPInValidAmount} from "../components/new-cash-in-and-pay/c-and-p-invalid-amount/c-and-p-invalid-amount";
import {CAndPValidAmount} from "../components/new-cash-in-and-pay/c-and-p-valid-amount/c-and-p-valid-amount";
import {CashOut} from "../components/cash-out/cash-out";

@Injectable()
export class PageManagementService implements UpgStrategy {
  private urlService = inject(UrlService);

  private strategies: Record<PageEnum, UpgStrategy> = {
    [PageEnum.TERMS_AND_CONDITIONS]: new Tac(),
    [PageEnum.PAYMENT_METHOD]: new PaymentMethod(),
    [PageEnum.CASH_IN_AND_PAY]: new CashInAndPay(),
    [PageEnum.ICP_INVALID_AMOUNT]: new CAndPInValidAmount(),
    [PageEnum.ICP_VALID_AMOUNT]: new CAndPValidAmount(),
    [PageEnum.CPOTP]: new CPOtp(),
    [PageEnum.CPPIN]: new CPPin(),
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
