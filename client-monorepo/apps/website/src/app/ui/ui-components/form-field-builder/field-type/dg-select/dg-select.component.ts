import { Component, Input } from '@angular/core';
import { BaseFieldType } from '../../base-field-type/base-field-type';
import { FormFieldOption } from '../../models/form-field-option.interface';
import { NgFor, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dg-select',
  templateUrl: './dg-select.component.html',
  styleUrls: ['./dg-select.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, NgFor, NgIf],
})
export class DgSelectComponent extends BaseFieldType {
  @Input() multiSelect: boolean;
  @Input() options: FormFieldOption[];
}
