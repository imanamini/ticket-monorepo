import { Component, Input, OnInit } from '@angular/core';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { NobitexRuleDialogComponent } from '../nobitex-rule-dialog/nobitex-rule-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyPipe } from '../../../../../ui/ui-pipes/currency.pipe';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { NgxSliderComponent } from '@digipay/ngx-slider';

export interface ruleSections {
  title: string;
  subtitle: string;
  period?: string;
}
@Component({
  selector: 'app-nobitex-calculator',
  templateUrl: './nobitex-calculator.component.html',
  styleUrls: ['./nobitex-calculator.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiButtonComponent, CurrencyPipe, UiIconDirective, NgxSliderComponent],
})
export class NobitexCalculatorComponent implements OnInit {
  @Input() calculator: any;
  @Input() image: any;

  @Input() amount;
  maxAmount = 50000000;

  ruleSections: ruleSections[] = [
    {
      title: 'مصرف اعتبار',
      subtitle: 'شما می توانید تمام یا بخشی از مبلغ سبد خرید را به صورت اعتباری پرداخت کنید',
      period: '۳۰ روز',
    },
    {
      title: 'مهلت استفاده از اعتبار',
      subtitle: 'از تاریخ دریافت اعتبار به مدت چهر ماه فرصت استفاده از اعتبار در فروشگاه‌های دیجی‌کالا و...را دارید.',
      period: '',
    },
    {
      title: 'شارژ دوباره اعتبار',
      subtitle: 'بلافاصله بعد از پرداخت بدهی، اعتبار شما مجددا برای استفاده شارژ می شود.',
    },
    {
      title: 'جریمه',
      subtitle: 'بعد از پنجم هر ماه، به ازای هر روز ۰.۲۵٪ مبلغ بدهی، جریمه می شوید.',
    },
  ];

  installmentActiveIndex = 0;
  finalAmount = 10000000;
  installments = [];

  constructor(
    private dialog: DialogBottomSheetService,
    private _dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.calculator.installment.length > 0) {
      for (let i = 0; i < this.calculator.installment.length; ++i) {
        this.installments.push(this.calculator.installment[i]);
      }
    }
  }

  changeCalculatorSlider(event: any) {
    if (event.default) {
      this.finalAmount = event.default;
    }
  }

  onChangeProvider(index: number) {
    this.installmentActiveIndex = index;
  }
  onChooseLoan() {
    this.openNobitexRuleDialog(
      this.ruleSections,
      this.finalAmount,
      this.installments[this.installmentActiveIndex].installmentCount,
      this.image,
      this.finalAmount * 1.32,
    );
  }

  openNobitexRuleDialog(ruleSections, finalAmount, installmentCount, image, lockAmount) {
    this._dialog.closeAll();
    this.dialog.open(NobitexRuleDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      fullHeightBottomSheet: true,
      ruleSections,
      finalAmount,
      installmentCount,
      image,
      lockAmount,
    });
  }
  intsllmentAmountCalc(totalAmount, installmentCount) {
    const amountWithInterest = totalAmount / installmentCount;
    return amountWithInterest + (amountWithInterest * 2) / 100;
  }

  getMax() {
    return Math.floor((this.amount / 1.32 > this.maxAmount ? this.maxAmount : this.amount / 1.32) / 1000000) * 1000000;
  }
}
