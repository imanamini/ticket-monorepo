import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopUpAppletComponent } from './top-up-applet/top-up-applet.component';
import { TopUpAppletService } from './top-up-applet/top-up-applet.service';
import { UiCellNumberFieldModule } from '../../../ui/ui-components/ui-cell-number-field/ui-cell-number-field.module';
import { UiRecommendationModule } from '../../../ui/ui-components/ui-recommendation/ui-recommendation.module';

@NgModule({
  exports: [TopUpAppletComponent],
  imports: [CommonModule, UiCellNumberFieldModule, UiRecommendationModule, TopUpAppletComponent],
  providers: [TopUpAppletService],
})
export class TopUpAppletModule {}
