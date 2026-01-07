import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'stores-applet-using-voucher-guide',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxIcon, NgxCalloutComponent],
  templateUrl: './using-voucher-guide.component.html',
  styleUrl: './using-voucher-guide.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsingVoucherGuideComponent implements OnInit, OnDestroy {
  // Injections
  backHandler = inject(BackHandlerService);

  bottomNavigationService = inject(NgxBottomNavigationService);
  // Variables
  calloutMessages = [
    'کالای مورد نظرت رو انتخاب کن.',
    'بعد از نهایی کردن سبد خرید، برای پرداخت درگاه دیجی‌پی رو انتخاب کن.',
    'گزینه پرداخت اعتباری رو بزن و بعد روی دکمه ادامه کلیک کن.',
    'در مرحله بعد، دکمه کد تخفیف رو انتخاب کن و کدت رو وارد کن.',
  ];
  ngOnInit(): void {
    this.bottomNavigationService.hide();
  }
  goBack(): void {
    this.backHandler.goBack();
  }
  ngOnDestroy() {
    this.bottomNavigationService.show();
  }
}
