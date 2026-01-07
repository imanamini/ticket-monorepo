import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCardNumberInputComponent } from './ui-card-number-input/ui-card-number-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import {UserInterfaceModule} from "../../../../user-interface/user-interface.module";

@NgModule({
  declarations: [UiCardNumberInputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserInterfaceModule,
  ],
  exports: [UiCardNumberInputComponent]
})
export class UiCardNumberInputModule {
}
