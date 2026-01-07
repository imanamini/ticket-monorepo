import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-subscription-cancel-card',
  templateUrl: './ui-subscription-cancel-card.component.html',
  styleUrls: ['./ui-subscription-cancel-card.component.scss']
})
export class UiSubscriptionCancelCardComponent {
  @Input()
  id: string;

  @Input()
  cardTitle: string;

  @Input()
  cardLogo: string;

  @Input()
  cardAmount: string | number;

  @Input()
  setCanceled: boolean;

  @Output()
  cancel = new EventEmitter();

  @Output()
  reverse = new EventEmitter();

  cancelClicked() {
    this.cancel.emit();
  }

  reverseCancel() {
    this.reverse.emit();
  }
}
