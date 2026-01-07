import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternetInitialComponent } from './internet-initial/internet-initial.component';
import { InternetPackageSelectComponent } from './internet-package-select/internet-package-select.component';
import { InternetService } from './internet.service';

import { UiCellNumberFieldModule } from '../../../ui/ui-components/ui-cell-number-field/ui-cell-number-field.module';
import { UiRecommendationModule } from '../../../ui/ui-components/ui-recommendation/ui-recommendation.module';
import { UiInternetModule } from '../../../ui/ui-sub/ui-internet/ui-internet.module';
import { register } from 'swiper/element/bundle';

register();

@NgModule({
  imports: [
    CommonModule,
    UiInternetModule,
    UiCellNumberFieldModule,
    UiRecommendationModule,
    UiCellNumberFieldModule,
    InternetInitialComponent,
    InternetPackageSelectComponent,
  ],
  exports: [InternetInitialComponent],
  providers: [InternetService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ServiceInternetModule {}
