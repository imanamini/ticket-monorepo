import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSectionBenefitsComponent } from './ui-section-benefits/ui-section-benefits.component';
import { UiValueCardsModule } from '../ui-value-cards/ui-value-cards.module';

@NgModule({
  exports: [UiSectionBenefitsComponent],
  imports: [CommonModule, UiValueCardsModule, UiSectionBenefitsComponent],
})
export class UiSectionBenefitsModule {}
