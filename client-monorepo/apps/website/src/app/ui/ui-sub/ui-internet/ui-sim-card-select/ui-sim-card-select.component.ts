import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiOption } from '../../../models/ui-option';
import { UiSimCardComponent } from '../ui-sim-card/ui-sim-card.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-sim-card-select',
  templateUrl: './ui-sim-card-select.component.html',
  styleUrls: ['./ui-sim-card-select.component.scss'],
  standalone: true,
  imports: [NgFor, UiSimCardComponent],
})
export class UiSimCardSelectComponent {
  @Input()
  selected: any = null;

  @Input()
  simCards: UiOption[] = [];

  @Output()
  typeChange = new EventEmitter();

  simCardClick(option: UiOption): void {
    if (this.selected === option.value) {
      return;
    }
    this.selected = option;
    this.typeChange.emit(option.value);
  }
}
