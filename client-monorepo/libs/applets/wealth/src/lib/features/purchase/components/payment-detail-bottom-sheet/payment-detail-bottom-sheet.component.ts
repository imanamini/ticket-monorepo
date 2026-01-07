import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

import { PaymentAmountsPipe } from '../../../../shared/pipes/payment-amounts.pipe';
import { ICreateFundPayment } from '../../../../components/core/models/create-fund-payment.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { DecimalPipe } from '@angular/common';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'app-payment-detail-bottom-sheet',
  standalone: true,
  imports: [PaymentAmountsPipe, NgxButtonComponent, DecimalPipe, NgxDividerComponent, NgxCalloutComponent],
  templateUrl: './payment-detail-bottom-sheet.component.html',
  styleUrl: './payment-detail-bottom-sheet.component.scss',
})
export class PaymentDetailBottomSheetComponent implements OnInit {
  loading = signal<boolean>(false);
  data = signal<ICreateFundPayment | undefined>(undefined);
  oneUnitHintText = signal<string | undefined>(undefined);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  private bottomSheet = inject(NgxBottomSheetService);

  ngOnInit() {
    this.data.set(this.bottomSheet.data().data);
    this.oneUnitHintText.set(this.hintText());
  }

  private hintText(): string {
    return this.data().isIPO
      ? 'مبلغ پرداختی شما حدودی است. در صورت کمتر بودن مبلغ نهایی سرمایه‌گذاری، باقی‌مانده آن به کیف پول ETF شما واریز خواهد شد.'
      : this.data().investmentType === 'CrowdFund'
        ? 'برای متناسب سازی، مبلغ پرداختی شما با ضریب ۱۰۰۰ رند شده است.'
        : 'به دلیل نوسانات قیمت، ۲٪ از قیمت یک واحد به مبلغ نهایی اضافه شده است.';
  }

  payment(agreement = true) {
    this.loading.set(true);
    this.bottomSheet.outputData.set({
      aggreement: agreement,
      paymentData: this.data(),
    });
    this.bottomSheet.closeBottomSheet();
  }
}
