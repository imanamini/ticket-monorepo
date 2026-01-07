import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiRecommendationsListComponent } from './ui-recommendations-list/ui-recommendations-list.component';
import { UiRecommendationItemComponent } from './ui-recommendation-item/ui-recommendation-item.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

`import { register } from 'swiper/element/bundle';

register();`;

@NgModule({
  exports: [UiRecommendationsListComponent, UiRecommendationItemComponent],
  imports: [CommonModule, ApiImageModule, UiRecommendationsListComponent, UiRecommendationItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiRecommendationModule {}
