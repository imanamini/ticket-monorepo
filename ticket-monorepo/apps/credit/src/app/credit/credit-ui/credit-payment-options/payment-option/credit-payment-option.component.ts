import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaymentOption } from '../../models/payment-option.model';
import { luminance } from '../../../../utils/colors';

@Component({
  selector: 'credit-ui-service',
  templateUrl: './credit-payment-option.component.html',
  styleUrls: ['./credit-payment-option.component.scss']
})
export class CreditPaymentOptionComponent implements OnInit, OnChanges {

  @Input()
  paymentOption: PaymentOption;

  @Input()
  isSelected: boolean;

  @Output()
  clicked = new EventEmitter<PaymentOption>();

  mode: 'dark' | 'light';

  constructor() {
  }

  ngOnInit(): void {
    this.setMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.paymentOption) {
      this.setMode();
    }
  }

  setMode() {
    this.mode = (luminance(this.paymentOption.color) > 0.25) ? 'light' : 'dark';
  }

  onClick() {
    this.clicked.emit(this.paymentOption);
  }

}
