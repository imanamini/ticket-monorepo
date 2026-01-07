import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentOption } from '../models/payment-option.model';
import { CreditInfoResponse } from '../../api/purchase/credit-info-response.model';


@Component({
  selector: 'credit-ui-payment-options',
  templateUrl: './credit-payment-options.component.html',
  styleUrls: ['./credit-payment-options.component.scss']
})
export class CreditPaymentOptionsComponent {

  @Input()
  items: PaymentOption[] = [];

  @Input()
  creditInfo: CreditInfoResponse;

  @Input()
  selectedPaymentOptionId: string;

  @Output()
  selectOption = new EventEmitter<PaymentOption>();

  onClicked(item: PaymentOption) {
    if (item.id !== this.selectedPaymentOptionId) {
      this.selectOption.emit(item);
    }
  }

}
