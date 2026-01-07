import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormFieldOption } from '../../../models/form-field-option.interface';

@Component({
  selector: 'date-picker-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss']
})
export class NumberPickerComponent {

  @Input()
  list: FormFieldOption[];

  @Input()
  value: string = '';

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter();

  selectChange($event) {
    this.valueChange.emit($event);
  }
}
