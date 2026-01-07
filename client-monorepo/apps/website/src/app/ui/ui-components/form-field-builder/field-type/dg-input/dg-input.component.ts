import { Component, Input } from '@angular/core';
import { FormFieldInputType } from '../../models/types';
import { BaseFieldType } from '../../base-field-type/base-field-type';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'app-dg-input',
  templateUrl: './dg-input.component.html',
  styleUrls: ['./dg-input.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, FormDirectivesModule, NgxTooltipDirective],
})
export class DgInputComponent extends BaseFieldType {
  @Input() multiLine: boolean;
  @Input() inputType: FormFieldInputType;
  @Input() maxSize: number;
  @Input() id = 'dg-input-' + Math.floor(Math.random() * 10000);
  @Input() mandatory = false;
  @Input() tooltipText = '';
  isFocused: boolean;

  focusin() {
    this.isFocused = true;
  }

  focusout() {
    this.isFocused = false;
  }
}
