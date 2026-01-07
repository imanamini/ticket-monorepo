import { Component, Input, OnInit } from '@angular/core';
import { TempFeatureCardProxy } from '../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { FeatureCards } from '../../../../api/clients/models/templates/ipg/feature-cards';
import { SectionBenefits } from '../../../models/ui-section-benefits';
import { UiValueSimpleComponent } from '../../ui-value-cards/ui-value-simple/ui-value-simple.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-section-benefits',
  templateUrl: './ui-section-benefits.component.html',
  styleUrls: ['./ui-section-benefits.component.scss'],
  standalone: true,
  imports: [NgIf, UiValueSimpleComponent],
})
export class UiSectionBenefitsComponent implements OnInit {
  @Input()
  benefits: SectionBenefits;

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
