import { Component, effect, input, signal } from '@angular/core';
import { FeatureCards } from '../../../../../../api/clients/models/templates/ipg/feature-cards';
import { TempFeatureCardProxy } from '../../../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { SectionBenefits } from '../../../../../../api/clients/models/templates/merchants-seller/merchants-seller-template-data';

@Component({
  selector: 'app-merchants-seller-benefits-section',
  templateUrl: './merchants-seller-benefits-section.component.html',
  styleUrls: ['./merchants-seller-benefits-section.component.scss'],
  standalone: true,
  imports: [],
})
export class MerchantsSellerBenefitsSectionComponent {
  benefits = input<SectionBenefits | undefined>();
  features = signal<FeatureCards[]>([]);

  constructor() {
    effect(
      () => {
        const benefitsData = this.benefits();
        if (benefitsData?.items?.length > 0) {
          const newFeatures = benefitsData.items.map((item) => new TempFeatureCardProxy(item).newFeatureCard);
          this.features.set(newFeatures);
        } else {
          this.features.set([]);
        }
      },
      { allowSignalWrites: true },
    );
  }
}
