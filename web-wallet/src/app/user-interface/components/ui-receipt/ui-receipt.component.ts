import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PaymentResult } from '../../../api/models/payment-result.response';
import { PaymentResult as NewPaymentResult } from '@digipay/ngx-payment-result';
import { PaymentResultEnum } from '../../../api/emuns/payment-result.enum';

@Component({
  selector: 'ui-receipt',
  templateUrl: './ui-receipt.component.html',
  styleUrls: ['./ui-receipt.component.scss']
})
export class UiReceiptComponent implements OnChanges {
  @Output()
  finish: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  state: PaymentResult;

  @Input()
  backgroundColor: string;

  countdownSeconds = 5;
  transformedResult: NewPaymentResult | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['state'] && changes['state'].currentValue !== changes['state'].previousValue) {
      if (this.state) {
        this.transformedResult = this.transformResult(this.state);
      }
    }
  }

  transformResult(result: PaymentResult): NewPaymentResult {
    const output: NewPaymentResult = {
      paymentResult: result.paymentResult === PaymentResultEnum.SUCCESS ? 'success' : 'error',
      items: result.activityInfo.map(item => {
        return {
          key: item.key,
          value: item.value,
          copyable: !!item.copyable
        };
      }),
      amount: result.amount,
      autoRedirect: result.autoRedirect,
      message: result.message,
      imageId: result.imageId,
      trackingCode: result.payInfo?.trackingCode || '',

      color: result.color,
      type: result.type,
      status: result.status,
      title: result.title,
    };
    if (result.redirectDetail) {
      output.redirectDetail = {
        path: result.redirectDetail.path,
        text: result.redirectDetail.text || 'ادامه',
        method: result.redirectDetail.method,
        data: result?.redirectDetail?.data ? JSON.stringify(result?.redirectDetail?.data) : '',
      };
    }
    return output;
  }
}
