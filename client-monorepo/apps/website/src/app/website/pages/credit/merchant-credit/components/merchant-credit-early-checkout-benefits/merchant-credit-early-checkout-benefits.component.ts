import { Component, effect, input, signal } from '@angular/core';
import { Benefits } from '../../../../../../api/clients/models/templates/merchant-credit-v2/merchant-credit-template-data';
import { TempFeatureCardProxy } from '../../../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { FeatureCards } from '../../../../../../api/clients/models/templates/ipg/feature-cards';
import { UiValueSimpleComponent } from '../../../../../../ui/ui-components/ui-value-cards/ui-value-simple/ui-value-simple.component';

@Component({
  selector: 'app-merchant-credit-early-checkout-benefits',
  templateUrl: './merchant-credit-early-checkout-benefits.component.html',
  styleUrls: ['./merchant-credit-early-checkout-benefits.component.scss'],
  standalone: true,
  imports: [UiValueSimpleComponent],
})
export class MerchantCreditEarlyCheckoutBenefitsComponent {
  earlyCheckoutBenefits = input<Benefits | undefined>();
  features = signal<FeatureCards[]>([]);

  constructor() {
    effect(
      () => {
        const benefits = this.earlyCheckoutBenefits();
        if (benefits?.items?.length > 0) {
          const newFeatures = benefits.items.map((item) => new TempFeatureCardProxy(item).newFeatureCard);
          this.features.set(newFeatures);
        } else {
          this.features.set([]);
        }
      },
      { allowSignalWrites: true },
    );
  }
}
