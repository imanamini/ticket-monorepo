import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor],
})
export class NumberPickerComponent {
  @Input()
  list: Array<{
    label: string;
    value: string;
  }> = [];

  @Input()
  value = '';

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter();

  selectChange($event: any) {
    this.valueChange.emit($event.target.value);
  }
}
