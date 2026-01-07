import { Component, Input } from '@angular/core';
import { BaseFieldType } from '../../base-field-type/base-field-type';
import { FormFieldOption } from '../../models/form-field-option.interface';

@Component({
  selector: 'app-dg-select',
  templateUrl: './dg-select.component.html',
  styleUrls: ['./dg-select.component.scss']
})
export class DgSelectComponent extends BaseFieldType {

  @Input() multiSelect: boolean;
  @Input() options: FormFieldOption[];

}
