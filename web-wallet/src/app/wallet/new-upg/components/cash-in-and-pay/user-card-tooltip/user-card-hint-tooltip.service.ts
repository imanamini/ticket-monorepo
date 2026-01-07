import {Injectable} from '@angular/core';
import {TgsSelectFeatureResponse} from "../../../../../api/models/tgs-select-feature-response";
import {TomanConvertor} from "../../../utils/toman-convertor";

@Injectable()
export class UserCardHintTooltipService {

  public toggleTooltipInMobile(tooltip) {
    if (window.innerWidth <= 613) {
      tooltip.toggle();
    }
  }

  public stopPropagationInMobile(event) {
    if (window.innerWidth <= 613) {
      event.stopImmediatePropagation()
    }
  }

  public createText(info: TgsSelectFeatureResponse, separator?: any): string {
    let result: string = '';
    if (info.rawAmount >= info.cashInXferMin) {
      result = 'برای این‌که افزایش موجودی کیف‌پول موفق باشد، باید از کارت بانکی که با شماره ملی و شماره موبایلی که در هنگام ثبت‌نام در دیجی‌پی وارد نموده‌اید استفاده کنید.';
    } if(info.cashInXferMin) {
      result = `امکان افزایش موجودی مبالغ کم‌تر از ${separator.transform(info.cashInXferMin)} ریال وجود ندارد. موجودی کیف‌پول شما به‌جای ${separator.transform(info.rawAmount)} ریال، ${separator.transform(info.amount)}   ریال افزایش خواهد یافت.`
    }else{
      result = `امکان افزایش موجودی مبالغ کم‌تر از ${TomanConvertor(info.cashInAmount)} وجود ندارد. موجودی کیف‌پول شما به‌جای ${TomanConvertor(info.amount - info.walletBalance)} ، ${TomanConvertor(info.cashInAmount)} افزایش خواهد یافت.`
    }
    return result;
  }

}
