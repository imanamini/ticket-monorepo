import { Component, Input } from '@angular/core';
import { GainCreditOffer } from '../../../../../../../../api/clients/models/templates/merchants-digikala/merchants-digikala-template-data';
import { UiButtonComponent } from '../../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-gain-credit-offer',
  templateUrl: './gain-credit-offer.component.html',
  styleUrls: ['./gain-credit-offer.component.scss'],
  standalone: true,
  imports: [NgIf, NgOptimizedImage, UiButtonComponent],
})
export class GainCreditOfferComponent {
  @Input()
  gainCreditOfferData: GainCreditOffer;
}
