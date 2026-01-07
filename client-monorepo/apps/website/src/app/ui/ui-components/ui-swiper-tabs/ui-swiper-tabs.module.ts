import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSwiperTabsComponent } from './ui-swiper-tabs/ui-swiper-tabs.component';
import { register } from 'swiper/element/bundle';

register();
@NgModule({
  exports: [UiSwiperTabsComponent],
  imports: [CommonModule, UiSwiperTabsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiSwiperTabsModule {}
