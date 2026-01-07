import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiOption } from '../../../models/ui-option';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-choice-list',
  templateUrl: './ui-choice-list.component.html',
  styleUrls: ['./ui-choice-list.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class UiChoiceListComponent {
  @Input()
  options: UiOption[] = [];

  @Input()
  description: string;

  @Output()
  choose = new EventEmitter<UiOption>();

  optionClick(option: UiOption): void {
    this.choose.emit(option);
  }
}
