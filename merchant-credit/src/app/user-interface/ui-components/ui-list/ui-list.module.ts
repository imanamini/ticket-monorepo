import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiKeyValueListComponent } from './ui-key-value-list/ui-key-value-list.component';

@NgModule({
  declarations: [
    UiKeyValueListComponent,
  ],
  exports: [
    UiKeyValueListComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class UiListModule { }
