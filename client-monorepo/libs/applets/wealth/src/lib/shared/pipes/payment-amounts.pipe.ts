import { Pipe, PipeTransform } from '@angular/core';
import { IAmountBreakdown } from '../../components/core/models/create-fund-payment.interface';

@Pipe({
  name: 'paymentAmounts',
  standalone: true,
})
export class PaymentAmountsPipe implements PipeTransform {
  transform(value: IAmountBreakdown, isCrowd: boolean = false, isIPO: boolean = false): IPaymentAmountsPipeResult[] {
    const result: IPaymentAmountsPipeResult[] = [];

    if (isIPO) {
      result.push({
        key: 'مبلغ سرمایه‌گذاری',
        value: `${value.totalPayableAmount}`,
      });

      return result;
    }

    if (value.baseAmount) {
      result.push({
        key: isCrowd ? 'مبلغ سرمایه‌گذاری' : 'مبلغ تخمینی سرمایه‌گذاری',
        value: `${value.baseAmount}`,
      });
    }
    if (value.totalPayableAmount && !isCrowd) {
      result.push({
        key: 'مبلغ باقی‌مانده',
        value: `${value.ipgPayableAmount}`,
      });
    }
    if (value.walletPayableAmount != null && !isCrowd) {
      result.push({
        key: 'برداشت از کیف پول ETF',
        value: value.walletPayableAmount ? `${value.walletPayableAmount}` : '0',
      });
    }
    if (value.commission) {
      result.push({
        key: 'کارمزد',
        value: `${value.commission}`,
      });
    } else {
      result.push({
        key: 'کارمزد',
        value: null,
      });
    }

    if (isCrowd) {
      return result;
    }

    return result.sort((a, b) => {
      if (a.key === 'مبلغ باقی‌مانده') return 1;
      if (b.key === 'مبلغ باقی‌مانده') return -1;
      return a.key.localeCompare(b.key);
    });
  }
}

export interface IPaymentAmountsPipeResult {
  key: string;
  value: string;
}
