import { Injectable } from '@angular/core';
import { IReceipt, ReceiptType } from '../../../data-access/models/receipt.interface';
import { getReceiptInfo } from '../../../shared/containers/receipt/rules/title.rules';
import { buildFields } from '../../../shared/containers/receipt/fields/fields.builder';
import { ActivityInfo } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { getMessage } from '../../../shared/containers/receipt/rules/message.rules';

@Injectable({ providedIn: 'root' })
export class ReceiptHandlerService {
  generateWaitingMessage(receipt: IReceipt): string {
    return getMessage(receipt);
  }

  getReceiptInfo(receipt: IReceipt): { text: string; result: ReceiptType } {
    return getReceiptInfo(receipt);
  }

  setFields(receipt: IReceipt): ActivityInfo[] {
    const msg = this.generateWaitingMessage(receipt);
    return buildFields(receipt, msg);
  }
}
