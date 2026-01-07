import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GA_DIRECT_DEBIT_ID } from '../../../api/constants/ga-direct-debit-id';

@Component({
  selector: 'ui-single-choice',
  templateUrl: './ui-single-choice.component.html',
  styleUrls: ['./ui-single-choice.component.scss']
})
export class UiSingleChoiceComponent {
  @Input()
  type: string;

  @Input()
  items: Array<{ id: number; title: string; }>;

  @Input()
  selectedItemId = 0;

  @Input()
  fillWidthItems = false;

  @Output()
  itemSelect = new EventEmitter();

  GA_DIRECT_DEBIT_CONTRACT_ID = GA_DIRECT_DEBIT_ID.CONTRACT;

  itemClicked(item) {
    this.itemSelect.emit(item.id);
  }
}
