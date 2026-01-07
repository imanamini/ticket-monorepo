import { Component, Input } from '@angular/core';
import { FormFieldInputType } from '../../models/types';
import { BaseFieldType } from '../../base-field-type/base-field-type';

@Component({
  selector: 'app-dg-input',
  templateUrl: './dg-input.component.html',
  styleUrls: ['./dg-input.component.scss']
})
export class DgInputComponent extends BaseFieldType {

  @Input() multiLine: boolean;
  @Input() inputType: FormFieldInputType;
  @Input() maxSize: number;
  id = 'dg-select-' + Math.floor(Math.random() * 10000);
  isFocused: boolean;

}
