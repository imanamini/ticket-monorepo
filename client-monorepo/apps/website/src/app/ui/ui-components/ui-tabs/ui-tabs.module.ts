import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTabsComponent } from './ui-tabs.component';
import { register } from 'swiper/element/bundle';

register();

@NgModule({
  exports: [UiTabsComponent],
  imports: [CommonModule, UiTabsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiTabsModule {}
