import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiPageTitleBarComponent } from './ui-page-title-bar.component';

@NgModule({
  exports: [UiPageTitleBarComponent],
  imports: [CommonModule, UiPageTitleBarComponent],
})
export class UiPageTitleBarModule {}
