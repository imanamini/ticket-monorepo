import { Component, Input } from '@angular/core';
import { PromotionBanner } from '../../../../api/clients/models/templates/warranty/warranty-template-data';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-section-promotion-banner',
  templateUrl: './ui-section-promotion-banner.component.html',
  styleUrls: ['./ui-section-promotion-banner.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent],
})
export class UiSectionPromotionBannerComponent {
  @Input()
  promotionBanner!: PromotionBanner;
}
