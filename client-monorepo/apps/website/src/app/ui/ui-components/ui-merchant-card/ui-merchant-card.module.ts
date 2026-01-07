import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UiMerchantCardComponent } from './ui-merchant-card.component';

@NgModule({
  exports: [UiMerchantCardComponent],
  imports: [CommonModule, NgOptimizedImage, UiMerchantCardComponent],
})
export class UiMerchantCardModule {}
