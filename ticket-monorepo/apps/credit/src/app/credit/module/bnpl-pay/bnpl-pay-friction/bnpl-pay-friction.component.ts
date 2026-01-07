import { Component, computed, input, output } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import moment from 'jalali-moment';
import { getMonthTitle } from '../../../../utils/date';
import { numberToLetter } from '../../../../utils/strings';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-bnpl-pay-friction',
  standalone: true,
  imports: [
    PipesModule,
    NgxCalloutComponent,
    NgxButtonComponent,
  ],
  templateUrl: './bnpl-pay-friction.component.html',
  styleUrl: './bnpl-pay-friction.component.scss'
})
export class BnplPayFrictionComponent {
  amount = input<number>(null);
  date = input<number>(null);
  installmentCount = input<number>(null);

  formattedDate = computed(() => getMonthTitle(this.date(), true));
  formattedInstallmentCount = computed(() => numberToLetter(this.installmentCount(), 10) + ' قسط');
  nearPay = computed<string>(() => this.computeNearPay(10));
  countDownTimer = computed<number>(() => this.nearPay() ? 15 : 10);

  onCancel = output();
  onConfirm = output();

  cancel() {
    this.onCancel.emit();
  }

  confirm() {
    this.onConfirm.emit();
  }

  private computeNearPay(threshold: number) {
    const currentStartOfDay = moment().startOf('day');
    const diff = moment(this.date()).diff(currentStartOfDay, 'days');

    return diff <= threshold ? `(${diff} روز دیگر)` : '';
  }
}
