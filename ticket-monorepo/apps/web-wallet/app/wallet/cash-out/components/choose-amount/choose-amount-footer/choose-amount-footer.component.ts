import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'choose-amount-footer',
  templateUrl: './choose-amount-footer.component.html',
  styleUrls: ['./choose-amount-footer.component.scss']
})
export class ChooseAmountFooterComponent {
  @Input() isInvalidAmount: boolean;
  @Output() next: EventEmitter<'TOTAL' | 'CUSTOM'> = new EventEmitter();
}
