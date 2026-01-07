import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiValueSwiperComponent } from './ui-value-swiper/ui-value-swiper.component';
import { UiValueSectionComponent } from './ui-value-section/ui-value-section.component';
import { UiValueSimpleComponent } from './ui-value-simple/ui-value-simple.component';
import { register } from 'swiper/element/bundle';

register();

@NgModule({
  exports: [UiValueSwiperComponent, UiValueSectionComponent, UiValueSimpleComponent],
  imports: [CommonModule, UiValueSwiperComponent, UiValueSectionComponent, UiValueSimpleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiValueCardsModule {}
