import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormFieldOption } from '../../../models/form-field-option.interface';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormFieldComponent } from '../../../form-field/form-field.component';

@Component({
  selector: 'app-date-picker-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss'],
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, FormsModule],
})
export class NumberPickerComponent {
  @Input()
  list: FormFieldOption[];

  @Input()
  value = '';

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter();

  selectChange($event) {
    this.valueChange.emit($event);
  }
}
