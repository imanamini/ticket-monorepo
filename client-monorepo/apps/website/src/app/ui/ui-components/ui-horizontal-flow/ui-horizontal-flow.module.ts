import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiHorizontalFlowComponent } from './ui-horizontal-flow/ui-horizontal-flow.component';

import { register } from 'swiper/element/bundle';
import { UiRecommendationModule } from '../ui-recommendation/ui-recommendation.module';

register();

@NgModule({
  exports: [UiHorizontalFlowComponent],
  imports: [CommonModule, UiRecommendationModule, UiHorizontalFlowComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiHorizontalFlowModule {}
