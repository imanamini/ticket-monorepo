import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCellNumberFieldComponent } from './ui-cell-number-field/ui-cell-number-field.component';
import { UiCarrierSelectComponent } from './ui-carrier-select/ui-carrier-select.component';
import { UiCarrierIconComponent } from './ui-carrier-icon/ui-carrier-icon.component';
import { FormsModule } from '@angular/forms';
import { UiSimTypeSwitchComponent } from './ui-sim-type-switch/ui-sim-type-switch.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormDirectivesModule } from '@digipay/ng-form-directives';

@NgModule({
  exports: [UiCellNumberFieldComponent, UiCarrierIconComponent, UiSimTypeSwitchComponent],
  imports: [
    CommonModule,
    FormsModule,
    FormDirectivesModule,
    UiFormFieldBuilderModule,
    UiCellNumberFieldComponent,
    UiCarrierSelectComponent,
    UiCarrierIconComponent,
    UiSimTypeSwitchComponent,
  ],
})
export class UiCellNumberFieldModule {}
