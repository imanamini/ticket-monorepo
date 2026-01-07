import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCheckboxComponent } from './ui-checkbox/ui-checkbox.component';
import { UiPinInputComponent } from './pin-input/ui-pin-input.component';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { UiFormMessageComponent } from './ui-form-message/ui-form-message.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UiCheckboxComponent,
    UiPinInputComponent,
    UiFormMessageComponent,
  ],
  exports: [
    UiCheckboxComponent,
    UiPinInputComponent,
    UiFormMessageComponent,
  ],
  imports: [
    CommonModule,
    FormDirectivesModule,
    FormsModule,
  ]
})
export class UiFormModule { }
