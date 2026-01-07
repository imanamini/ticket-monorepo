import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UiIntroductionDefaultComponent } from './ui-introduction-default/ui-introduction-default.component';

import { UiValueCardsModule } from '../ui-value-cards/ui-value-cards.module';

@NgModule({
  exports: [UiIntroductionDefaultComponent],
  imports: [CommonModule, UiValueCardsModule, NgOptimizedImage, UiIntroductionDefaultComponent],
})
export class UiIntroductionDefaultModule {}
