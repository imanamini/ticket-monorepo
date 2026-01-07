import { inject } from '@angular/core';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';

export class Amount {
  private separateThousandsPipe = inject(SeparateThousandsPipe);

  public amountErrorMessage(selectedAmount: string, maxAmount: number, minAmount: number, remainingCap: number): Promise<string> {
    const numberSelectedAmount: number = selectedAmount ? this.convertStringAmountToNumber(selectedAmount) : 0;
    return new Promise((resolve, reject) => {
      let message: string = '';
      if (remainingCap === 0) {
        message = 'موجودی کافی نیست.';
      } else if (!selectedAmount) {
        message = 'لطفا مبلغ مورد نظر را وارد کنید.';
      } else if (numberSelectedAmount > remainingCap) {
        message = 'مبلغ وارد شده بیشتر از موجودی قابل برداشت می‌باشد';
      } else if ((numberSelectedAmount < minAmount) || (numberSelectedAmount > maxAmount) || !selectedAmount) {
        message = ` مبلغ باید بین ${this.separateThousandsPipe.transform(minAmount)} ریال تا ${this.separateThousandsPipe.transform(maxAmount)} ریال باشد `;
      } else {
        reject();
      }
      resolve(message);
    });
  }

  public convertStringAmountToNumber(value: string | number): number {
    if(typeof value === 'string') {
      return parseInt(value.replace(/٬/g, ''));
    }
    return value;
  }
}
