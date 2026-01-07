import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentConfig } from '../../../api/models/payment-config.response';

@Component({
  selector: 'ui-amount-suggestions',
  templateUrl: './ui-amount-suggestions.component.html',
  styleUrls: ['./ui-amount-suggestions.component.scss']
})
export class UiAmountSuggestionsComponent implements OnInit {

  amountsList = [];

  @Input()
  config: PaymentConfig;

  @Input()
  selected: number;

  @Output()
  itemSelect = new EventEmitter();

  @Output()
  clickEvent = new EventEmitter();

  ngOnInit() {
    if (this.config) {
      this.amountsList = this.config.defaultAmounts.slice(0, 3);
    }
  }

  detectEventCalled(val) {
    this.clickEvent.emit(val);
  }

  itemClicked(item) {
    this.itemSelect.emit(item);
  }
}
