import { Injectable } from '@angular/core';
import { TgsSelectFeatureResponse } from '../../../data-access/models/tgs-select-feature-response';
import { currencyFormat } from '@digipay/strings';
import { formatPriceToString } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class UserCardHintTooltipService {
  public toggleTooltipInMobile(tooltip: any) {
    if (window.innerWidth <= 613) {
      tooltip.toggle();
    }
  }

  public stopPropagationInMobile(event: any) {
    if (window.innerWidth <= 613) {
      event.stopImmediatePropagation();
    }
  }

  public createText(info: TgsSelectFeatureResponse): string {
    let result = '';
    if (info.rawAmount! >= info.cashInXferMin!) {
      result =
        'برای این‌که افزایش موجودی کیف‌پول موفق باشد، باید از کارت بانکی که با شماره ملی و شماره موبایلی که در هنگام ثبت‌نام در دیجی‌پی وارد نموده‌اید استفاده کنید.';
    }
    if (info.cashInXferMin) {
      result = `امکان افزایش موجودی مبالغ کم‌تر از ${currencyFormat(info.cashInXferMin)} ریال وجود ندارد. موجودی کیف‌پول شما به‌جای ${currencyFormat(info.rawAmount)} ریال، ${currencyFormat(info.amount)}   ریال افزایش خواهد یافت.`;
    } else {
      result = `امکان افزایش موجودی مبالغ کم‌تر از ${formatPriceToString(info.cashInAmount || 0)} وجود ندارد. موجودی کیف‌پول شما به‌جای ${formatPriceToString(info.amount - info.walletBalance)} ، ${formatPriceToString(info.cashInAmount || 0)} افزایش خواهد یافت.`;
    }
    return result;
  }
}
