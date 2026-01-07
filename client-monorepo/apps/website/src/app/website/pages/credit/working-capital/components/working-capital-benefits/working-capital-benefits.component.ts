import { Component, Input, OnInit } from '@angular/core';
import { TempFeatureCardProxy } from '../../../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { Benefits } from '../../../../../../api/clients/models/templates/merchant-credit-v2/merchant-credit-template-data';
import { FeatureCards } from '../../../../../../api/clients/models/templates/ipg/feature-cards';
import { UiValueSimpleComponent } from '../../../../../../ui/ui-components/ui-value-cards/ui-value-simple/ui-value-simple.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-working-capital-benefits',
  templateUrl: './working-capital-benefits.component.html',
  styleUrls: ['./working-capital-benefits.component.scss'],
  standalone: true,
  imports: [NgIf, UiValueSimpleComponent],
})
export class WorkingCapitalBenefitsComponent implements OnInit {
  @Input() benefits: Benefits;

  features: FeatureCards[] = [];

  ngOnInit(): void {
    if (this.benefits.items.length > 0) {
      for (let i = 0; i < this.benefits.items.length; ++i) {
        const x = new TempFeatureCardProxy(this.benefits.items[i]).newFeatureCard;
        this.features.push(x);
      }
    }
  }
}
