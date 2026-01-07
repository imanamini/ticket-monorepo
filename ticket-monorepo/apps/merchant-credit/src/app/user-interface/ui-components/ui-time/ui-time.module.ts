import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCountDownTextComponent } from './ui-count-down-text/ui-count-down-text.component';

@NgModule({
  declarations: [
    UiCountDownTextComponent,
  ],
  exports: [
    UiCountDownTextComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class UiTimeModule {
}
