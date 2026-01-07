import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiContentNavComponent } from './ui-content-nav/ui-content-nav.component';
import { register } from 'swiper/element/bundle';

register();
@NgModule({
  exports: [UiContentNavComponent],
  imports: [CommonModule, UiContentNavComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiContentNavModule {}
