import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UiSimilarServicesComponent } from './ui-similar-services/ui-similar-services.component';
import { register } from 'swiper/element/bundle';

register();

@NgModule({
  exports: [UiSimilarServicesComponent],
  imports: [CommonModule, NgOptimizedImage, UiSimilarServicesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiSimilarServicesModule {}
