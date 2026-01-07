import { Component, input, inject } from '@angular/core';
import { InsurancePromotionModel } from '../../features/home/data-access/models/insurance-promotion.model';
import { NgOptimizedImage } from '@angular/common';
import { FeatureToggleService } from '../../data-access/services/feature-toggle.service';

@Component({
  selector: 'insurance-promotion',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './insurance-promotion.component.html',
  styleUrl: './insurance-promotion.component.scss'
})
export class InsurancePromotionComponent {
  title = input<string>();
  firstSubtitle = input<string>();
  secondSubtitle = input<string>();
  promotions = input.required<InsurancePromotionModel[]>();

  private featureToggleService = inject(FeatureToggleService);
  private secondSubtitleClickCount = 0;

  onSecondSubtitleClick(): void {
    this.secondSubtitleClickCount++;
    if (this.secondSubtitleClickCount >= 10) {
      this.featureToggleService.featureToggle(true);
      this.secondSubtitleClickCount = 0;
    }
  }
}
