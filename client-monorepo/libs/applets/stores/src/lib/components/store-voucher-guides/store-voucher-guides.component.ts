import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';

@Component({
  standalone: true,
  selector:'store-voucher-guides',
  template: `
    @if (isOpen()) {
      <ngx-callout
        [showTitleBlink]="false"
        [messages]="[
        'کالای مورد نظرت رو انتخاب کن.',
        'بعد از نهایی کردن سبد خرید، برای پرداخت درگاه دیجی‌پی رو انتخاب کن.',
        'گزینه پرداخت اعتباری رو بزن و بعد روی دکمه ادامه کلیک کن.',
        'در درگاه دیجی‌پی دکمه کد تخفیف رو انتخاب و کد مورد نظر رو وارد کن.']"
        title=""
        mode="multiple"
        backgroundMode="elevated"></ngx-callout>
    }`,
  imports: [
    NgxCalloutComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StoreVoucherGuidesComponent implements AccordionWithIsOpen {
  accordionStateService = inject(AccordionStateService);
  isOpen = input<boolean>(false);
  componentId = input<string>('');
}
