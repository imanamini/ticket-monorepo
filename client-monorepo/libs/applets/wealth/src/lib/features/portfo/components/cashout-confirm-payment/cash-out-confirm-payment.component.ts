import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { PipesModule } from '@digipay/ng-lib-pipes';

import { ICashoutConfirm } from '../../models/cash-out-confirm.interface';
import { ICashOutInfo } from '../../models/cash-out-info.interface';
import { ConvertBankName } from '../../../../data-access/constants/banks-code-name';

@Component({
  selector: 'app-cash-out-confirm-payment',
  standalone: true,
  imports: [PipesModule, NgxButtonComponent, NgxCalloutComponent, DecimalPipe, NgxDividerComponent],
  templateUrl: './cash-out-confirm-payment.component.html',
  styleUrl: './cash-out-confirm-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashOutConfirmPaymentComponent implements OnInit {
  private bottomSheet = inject(NgxBottomSheetService);
  readonly BorderColorsEnum = BorderColorsEnum;

  data = signal<ICashoutConfirm | undefined>(undefined);
  bankName = signal<string>('');
  note = signal(
    `اگر تا ساعت ۱۴ روز کاری درخواست خود را ثبت کنید، مبلغ ثبت شده ۱ روز کاری بعد و درخواست پس از ساعت ۱۴ و یا در روز‌های تعطیل ۲ روز کاری بعد به حساب بانکی شما نزد کارگزاری واریز خواهد شد.`,
  );
  cashOutInfo = signal<ICashOutInfo[]>([]);

  ngOnInit(): void {
    this.data.set(this.bottomSheet.data()?.data);
    this.updateData();
  }

  private updateData(): void {
    this.bankName.set(ConvertBankName(this.data()?.shebaNumber));
    this.cashOutInfo.set([
      {
        key: 'برداشت از',
        value: 'کیف پول ETF',
      },
      {
        key: 'انتقال به',
        value: this.data()?.shebaNumber,
        imageUrl: `wealth-assets/bank-icons/${this.bankName()}.svg`,
      },
    ]);
  }

  close(): void {
    this.bottomSheet.closeBottomSheet();
  }

  confirm(): void {
    this.bottomSheet.outputData.set(true);
    this.close();
  }
}
